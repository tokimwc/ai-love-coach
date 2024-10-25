"use client"

import { useState, useEffect } from 'react'
import { useTheme } from "next-themes"
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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

export default function Settings() {
  const [openaiApiKey, setOpenaiApiKey] = useState('')
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    fetchApiKey()
  }, [])

  const fetchApiKey = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('user_settings')
        .select('openai_api_key')
        .eq('user_id', user.id)
        .single()

      if (data) {
        setOpenaiApiKey(data.openai_api_key || '')
      }
    }
  }

  const handleSaveApiKey = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { error } = await supabase
        .from('user_settings')
        .upsert({ user_id: user.id, openai_api_key: openaiApiKey })

      if (error) {
        console.error('Error saving API key:', error)
        alert('APIキーの保存中にエラーが発生しました。')
      } else {
        alert('APIキーが正常に保存されました！')
      }
    }
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
          <CardTitle>API設定</CardTitle>
          <CardDescription>
            OpenAI APIキーを設定してください
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Input
            type="password"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            placeholder="OpenAI APIキーを入力"
          />
          <Button onClick={handleSaveApiKey}>APIキーを保存</Button>
        </CardContent>
      </Card>
    </div>
  )
}
