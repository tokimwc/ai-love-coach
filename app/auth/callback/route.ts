import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

console.log('auth/callback/route.ts が呼ばれました')

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    console.log('コードを受け取りました:', code)
    const { error, data } = await supabase.auth.exchangeCodeForSession(code)
    console.log('セッション交換結果:', error ? 'エラー' : '成功', error || data)
    
    if (error) {
      console.error('セッション交換中にエラーが発生しました:', error)
      // エラーページにリダイレクト
      return NextResponse.redirect(`${requestUrl.origin}/auth/error`)
    }

    console.log('セッション交換成功:', data)
    // セッション交換が成功した場合、ホームページにリダイレクト
    return NextResponse.redirect(`${requestUrl.origin}`)
  }

  // コードが存在しない場合、ホームページにリダイレクト
  return NextResponse.redirect(`${requestUrl.origin}`)
}
