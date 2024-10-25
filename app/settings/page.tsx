"use client"

import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { useRouter } from "next/navigation"
import { Button } from '@/components/ui/button'
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
import Link from "next/link"

export default function Settings() {
  const { theme, setTheme } = useTheme()
  const [selectedService, setSelectedService] = useState<string>('dify')
  const [openaiKey, setOpenaiKey] = useState<string>('')
  const [difyKey, setDifyKey] = useState<string>('')

  // セッションストレージからキーを読み込む
  useEffect(() => {
    const storedOpenaiKey = sessionStorage.getItem('openai_api_key')
    const storedDifyKey = sessionStorage.getItem('dify_api_key')
    const storedService = sessionStorage.getItem('selected_service')
    if (storedOpenaiKey) setOpenaiKey(storedOpenaiKey)
    if (storedDifyKey) setDifyKey(storedDifyKey)
    if (storedService) setSelectedService(storedService)
  }, [])

  // キーの保存
  const handleSaveKeys = () => {
    sessionStorage.setItem('selected_service', selectedService)
    if (selectedService === 'openai') {
      sessionStorage.setItem('openai_api_key', openaiKey)
    } else {
      sessionStorage.setItem('dify_api_key', difyKey)
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
              <SelectValue placeholder="テーマを選択" />
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
              <div className="space-y-2">
                <label className="text-sm font-medium">Dify APIキー</label>
                <Input
                  type="password"
                  value={difyKey}
                  onChange={(e) => setDifyKey(e.target.value)}
                  placeholder="app-..."
                />
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
