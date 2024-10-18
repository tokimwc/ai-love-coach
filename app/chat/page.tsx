"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import ChatMessage from "@/components/ChatMessage"

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export default function ChatPage() {
  const [message, setMessage] = useState("")
  const [conversation, setConversation] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [conversationId, setConversationId] = useState<string | null>(null)

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

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-4 p-4">
        <div className="space-y-4">
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
