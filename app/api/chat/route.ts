import { createClient } from '@/app/utils/supabase/server'
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"
import OpenAI from 'openai'

const DIFY_API_KEY = process.env.DIFY_API_KEY!
const DEFAULT_DIFY_API_URL = 'https://api.dify.ai/v1'

// AI恋愛コーチのシステムプロンプト
const LOVE_COACH_PROMPT = `
あなたは恋愛のエキスパートAIコーチです。以下の指針に従ってアドバイスを提供してください：

1. 共感的で温かみのある口調を使用
2. 具体的で実践的なアドバイスを提供
3. ユーザーの感情に配慮しながら、建設的な提案を行う
4. 必要に応じて、恋愛心理学や行動科学の知見を活用
5. プライバシーに配慮しつつ、個別の状況に応じたアドバイスを提供
6. 相手の気持ちを考慮した上で、健全な関係構築を支援

ユーザーの質問や悩みに対して、上記の指針を踏まえながら回答してください。
`

export const runtime = 'edge' // エッジランタイムを使用

export const maxDuration = 300 // タイムアウトを300秒に設定

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore)
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: '認証が必要です。再度ログインしてください。' }, { status: 401 })
  }

  try {
    const { message, conversationId } = await request.json()
    
    // ユーザー設定を取得
    const { data: userSettings } = await supabase
      .from('user_settings')
      .select('ai_service, openai_key, dify_key, dify_api_url')
      .eq('user_id', session.user.id)
      .single()

    const storedService = userSettings?.ai_service || 'dify'
    const openaiKey = userSettings?.openai_key
    const difyKey = userSettings?.dify_key
    const difyApiUrl = userSettings?.dify_api_url

    // OpenAI APIの場合
    if (storedService === 'openai' && openaiKey) {
      try {
        const openai = new OpenAI({ apiKey: openaiKey })
        const completion = await openai.chat.completions.create({
          messages: [
            { role: "system", content: LOVE_COACH_PROMPT },
            { role: "user", content: message }
          ],
          model: "gpt-4",
        })

        return NextResponse.json({ 
          response: completion.choices[0].message.content,
          conversationId: conversationId || Date.now().toString()
        })
      } catch (error: any) {
        return NextResponse.json({ 
          error: 'OpenAI APIエラー: ' + (error.message || 'APIキーを確認してください') 
        }, { status: 500 })
      }
    }
    
    // Dify APIの場合
    try {
      const apiKey = difyKey || DIFY_API_KEY
      const apiUrl = difyApiUrl || DEFAULT_DIFY_API_URL
      const response = await fetch(`${apiUrl}/chat-messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          query: message,
          user: session.user.id,
          conversation_id: conversationId,
          inputs: {},
        }),
      })

      if (!response.ok) {
        throw new Error(`Dify API エラー: ${response.status}`)
      }

      try {
        const data = await response.json()
        if (!data || (typeof data !== 'object')) {
          throw new Error('Invalid response format from Dify API')
        }
        
        // マークダウンはそのまま保持
        const formattedResponse = data.answer || 
                                 data.message?.content || 
                                 "応答を生成できませんでした"

        return NextResponse.json({ 
          response: formattedResponse,
          conversationId: data.conversation_id || conversationId
        })
      } catch (error) {
        console.error('Dify応答解析エラー:', error)
        return NextResponse.json({ 
          error: 'APIレスポンスの解析に失敗しました'
        }, { status: 500 })
      }
    } catch (error: any) {
      return NextResponse.json({ 
        error: 'Dify APIエラー: ' + (error.message || 'APIキーを確認してください') 
      }, { status: 500 })
    }

  } catch (error: any) {
    console.error('APIエラー:', error)
    return NextResponse.json(
      { error: 'リクエストの処理中にエラーが発生しました: ' + error.message }, 
      { status: 500 }
    )
  }
}
