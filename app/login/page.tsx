"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/app/utils/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function LoginPage() {
  const supabase = createClient()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      console.log('ログイン試行中:', email)
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password,
      })
      console.log('ログイン詳細:', { data, error })
      
      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setError('メールアドレスまたはパスワードが正しくありません。')
        } else {
          setError(error.message)
        }
        return
      }
      
      router.push('/')
    } catch (error) {
      console.error('詳細なログインエラー:', error)
      setError('ログイン中にエラーが発生しました。もう一度お試しください。')
    }
  }

  const handleSignupClick = () => {
    router.push('/signup')
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleLogin} className="space-y-4 w-full max-w-md p-8 bg-card rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">ログイン</h1>
        <Input
          type="email"
          placeholder="メールアドレス"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="パスワード"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full">ログイン</Button>
        <div className="mt-4 text-center">
          <p>
            アカウントをお持ちでない方は{' '}
            <Button variant="link" onClick={handleSignupClick}>サインアップ</Button>
          </p>
        </div>
      </form>
    </div>
  )
}
