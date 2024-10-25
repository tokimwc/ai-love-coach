"use client"

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { supabase } from '@/lib/supabase' 
import { Heart } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'

export default function ClientNavigation() {
  const router = useRouter()
  const { user } = useAuth()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <nav className="bg-white shadow-md dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Heart className="h-8 w-8 text-pink-500" />
              <span className="ml-2 text-xl font-bold text-gray-900 dark:text-white">AI Love Coach</span>
            </Link>
          </div>
          <div className="flex items-center">
            {user ? (
              <>
                <Link href="/chat" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  チャット
                </Link>
                <Link href="/profile" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  プロフィール
                </Link>
                <Link href="/settings" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  設定
                </Link>
                <Button onClick={handleLogout} variant="ghost" className="ml-4">
                  ログアウト
                </Button>
              </>
            ) : (
              <>
                <Link href="/login" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  ログイン
                </Link>
                <Link href="/signup" className="text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 px-3 py-2 rounded-md text-sm font-medium">
                  サインアップ
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
