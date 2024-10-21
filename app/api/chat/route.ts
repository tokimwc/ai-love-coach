import { createClient } from '@/app/utils/supabase/server'  // clientからserverに変更
import { cookies } from 'next/headers'
import { NextResponse } from "next/server"

const DIFY_API_KEY = process.env.DIFY_API_KEY!
const DIFY_API_URL = 'https://api.dify.ai/v1'

export async function POST(request: Request) {
  const cookieStore = cookies()
  const supabase = createClient(cookieStore) 
  const { data: { session } } = await supabase.auth.getSession()

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { message, conversationId } = await request.json()

  try {
    const response = await fetch(`${DIFY_API_URL}/chat-messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${DIFY_API_KEY}`,
      },
      body: JSON.stringify({
        query: message,
        user: 'abc-123', // ユーザー識別子を適切に設定
        conversation_id: conversationId,
        inputs: {},
      }),
    })

    const data = await response.json()
    console.log('Dify API Response:', data);

    if (!response.ok) {
      console.error('Dify API Error:', {
        status: response.status,
        statusText: response.statusText,
        data: data
      });
      return NextResponse.json({ error: `API Error: ${response.status} ${response.statusText}` }, { status: response.status });
    }

    return NextResponse.json({ response: data.answer || data.response, conversationId: data.conversation_id })
  } catch (error) {
    return NextResponse.json({ error: 'サーバーエラーが発生しました' }, { status: 500 })
  }
}
