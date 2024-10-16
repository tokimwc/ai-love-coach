"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import Link from 'next/link'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const router = useRouter()

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      alert('パスワードが一致しません。')
      return
    }
    if (password.length < 6) {
      alert('パスワードは6文字以上である必要があります。')
      return
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
      if (data.user) {
        alert('サインアップ成功！確認メールを確認してください。数分かかる場合があります。')
        router.push('/login')
      } else {
        alert('サインアップに失敗しました。もう一度お試しください。')
      }
    } catch (error: any) {
      console.error('サインアップエラー:', error)
      alert(`サインアップエラー: ${error.message || '不明なエラーが発生しました。'}`)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <form onSubmit={handleSignup} className="space-y-4 w-full max-w-md p-8 bg-card rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center">サインアップ</h1>
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
        <Input
          type="password"
          placeholder="パスワード（確認）"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full">サインアップ</Button>
        <div className="mt-4 text-center">
          <p>すでにアカウントをお持ちの方は <Link href="/login" className="text-blue-500 hover:underline">ログイン</Link></p>
        </div>
      </form>
    </div>
  )
}
