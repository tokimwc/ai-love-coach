"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import ChatMessage from "@/components/ChatMessage"
import { createBrowserClient } from '@supabase/ssr'
import { useRouter } from 'next/navigation'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

interface SuggestionButton {
  text: string;
  message: string;
}

export default function Chat() {
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
  const [showWelcome, setShowWelcome] = useState(true)

  const initialSuggestions: SuggestionButton[] = [
    {
      text: "恋愛相談をしたい",
      message: "恋愛について相談があります。アドバイスをお願いできますか？"
    },
    {
      text: "好きな人へのアプローチ方法",
      message: "好きな人がいるのですが、どうやってアプローチすればいいですか？"
    },
    {
      text: "デートプランについて",
      message: "理想的なデートプランを考えたいです。アドバイスをください。"
    }
  ]

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }
    checkSession()
  }, [supabase, router])

  const sendMessage = async () => {
    if (!message.trim()) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message, conversationId }),
      })

      if (!response.ok) {
        throw new Error('ネットワークエラーが発生しました')
      }

      const data = await response.json()
      console.log('API Response:', data);

      if (data.error) {
        throw new Error(data.error)
      }

      setConversation(prev => [
        ...prev, 
        { role: 'user', content: message }, 
        { role: 'assistant', content: data.response }
      ])
      setConversationId(data.conversationId)
      setMessage('')
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message)
      } else {
        setError('不明なエラーが発生しました')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestionClick = (message: string) => {
    setMessage(message)
    sendMessage()
    setShowWelcome(false)
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4 p-4">
        <div className="space-y-4">
          {showWelcome && conversation.length === 0 && (
            <div className="text-center space-y-4">
              <h2 className="text-xl font-bold">AI恋愛コーチへようこそ！</h2>
              <p className="text-gray-600">どのようなお悩みでしょうか？</p>
              <div className="flex flex-col gap-2">
                {initialSuggestions.map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="text-left"
                    onClick={() => handleSuggestionClick(suggestion.message)}
                  >
                    {suggestion.text}
                  </Button>
                ))}
              </div>
            </div>
          )}
          {conversation.map((msg, index) => (
            <ChatMessage key={index} message={msg} />
          ))}
        </div>
      </Card>
      {isLoading && <div className="text-center">応答を待っています...</div>}
      {error && <div className="text-red-500 text-center">{error}</div>}
      <div className="flex space-x-2">
        <Input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="メッセージを入力..."
          disabled={isLoading}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              if (e.shiftKey) {
                // 改行
                setMessage(prev => prev + '\n')
              } else {
                // 送信
                sendMessage()
              }
              e.preventDefault()
            }
          }}
        />
        <Button onClick={sendMessage} disabled={isLoading}>
          送信
        </Button>
      </div>
    </div>
  )
}
