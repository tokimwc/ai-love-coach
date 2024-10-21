import { createClient } from '@/app/utils/supabase/server'
import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: Request) {
  console.log('auth/confirm/route.ts が呼ばれました')
  const requestUrl = new URL(request.url)
  const token_hash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null

  if (token_hash && type) {
    const cookieStore = cookies()
    const supabase = createClient(cookieStore)
    const { error } = await supabase.auth.verifyOtp({ token_hash, type })
    if (error) {
      console.error('メール確認エラー:', error)
      return NextResponse.redirect(`${requestUrl.origin}/auth/auth-error`)
    }
  }

  return NextResponse.redirect(`${requestUrl.origin}/auth/auth-success`)
}
