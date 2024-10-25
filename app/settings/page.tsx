"use client"

import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
import { createClient } from '@/app/utils/supabase/client'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [selectedService, setSelectedService] = useState<string>('dify')
  const [openaiKey, setOpenaiKey] = useState<string>('')
  const [difyKey, setDifyKey] = useState<string>('')
  const [difyUrl, setDifyUrl] = useState<string>('')
  const router = useRouter()
  const supabase = createClient()

  // マウント状態を管理
  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkSession = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push('/login')
      }
    }
    checkSession()
  }, [supabase, router])

  useEffect(() => {
    const storedOpenaiKey = sessionStorage.getItem('openai_api_key')
    const storedDifyKey = sessionStorage.getItem('dify_api_key')
    const storedDifyUrl = sessionStorage.getItem('dify_api_url')
    const storedService = sessionStorage.getItem('selected_service')
    if (storedOpenaiKey) setOpenaiKey(storedOpenaiKey)
    if (storedDifyKey) setDifyKey(storedDifyKey)
    if (storedDifyUrl) setDifyUrl(storedDifyUrl)
    if (storedService) setSelectedService(storedService)
  }, [])

  // マウントされていない場合は何も表示しない
  if (!mounted) {
    return null
  }

  const handleSaveKeys = () => {
    sessionStorage.setItem('selected_service', selectedService)
    if (selectedService === 'openai') {
      sessionStorage.setItem('openai_api_key', openaiKey)
    } else {
      sessionStorage.setItem('dify_api_key', difyKey)
      sessionStorage.setItem('dify_api_url', difyUrl || 'https://api.dify.ai/v1')
    }
    alert('設定が保存されました')
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold mb-6">設定</h1>

      <Card>
        <CardHeader>
          <CardTitle>テーマ設定</CardTitle>
          <CardDescription>
            アプリケーションの表示モードを選択してください
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={theme} onValueChange={setTheme}>
            <SelectTrigger>
              <SelectValue defaultValue={theme} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">ライトモード</SelectItem>
              <SelectItem value="dark">ダークモード</SelectItem>
              <SelectItem value="system">システム設定に従う</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AIサービス設定</CardTitle>
          <CardDescription>
            使用するAIサービスを選択してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedService} onValueChange={setSelectedService}>
            <SelectTrigger>
              <SelectValue placeholder="サービスを選択" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI</SelectItem>
              <SelectItem value="dify">Dify</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-red-500 text-sm">
            注意: ページを更新するか、ログアウトするとデータが消去されます。
          </p>

          <div className="space-y-4">
            {selectedService === 'openai' && (
              <div className="space-y-2">
                <label className="text-sm font-medium">OpenAI APIキー</label>
                <Input
                  type="password"
                  value={openaiKey}
                  onChange={(e) => setOpenaiKey(e.target.value)}
                  placeholder="sk-..."
                />
              </div>
            )}
            
            {selectedService === 'dify' && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dify APIキー</label>
                  <Input
                    type="password"
                    value={difyKey}
                    onChange={(e) => setDifyKey(e.target.value)}
                    placeholder="app-..."
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Dify API URL</label>
                  <Input
                    type="text"
                    value={difyUrl}
                    onChange={(e) => setDifyUrl(e.target.value)}
                    placeholder="https://api.dify.ai/v1"
                  />
                  <p className="text-sm text-gray-500">
                    例: https://api.dify.ai/v1
                  </p>
                </div>
              </div>
            )}

            <Button onClick={handleSaveKeys} className="w-full">
              設定を保存
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
