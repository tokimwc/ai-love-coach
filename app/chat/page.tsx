"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Send } from "lucide-react"
import ChatMessage from "@/components/ChatMessage"
import VoiceInput from "@/components/VoiceInput"
import { useChat } from "@/hooks/useChat"

export default function ChatPage() {
  const [input, setInput] = useState("")
  const { messages, sendMessage, isLoading } = useChat()
  const [emotion, setEmotion] = useState<string | null>(null)

  const handleSend = () => {
    if (input.trim()) {
      sendMessage(input)
      setInput("")
    }
  }

  const handleVoiceTranscript = (transcript: string) => {
    setInput(transcript)
  }

  const handleEmotion = (detectedEmotion: string) => {
    setEmotion(detectedEmotion)
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="p-4 border-b">
        <h1 className="text-2xl font-bold">AI Love Coach</h1>
        {emotion && (
          <p className="text-sm text-muted-foreground">Detected emotion: {emotion}</p>
        )}
      </header>
      <ScrollArea className="flex-grow p-4">
        {messages.map((message, index) => (
          <ChatMessage key={index} message={message} />
        ))}
      </ScrollArea>
      <div className="p-4 border-t">
        <div className="flex space-x-2 mb-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
          />
          <Button onClick={handleSend} disabled={isLoading}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
        <VoiceInput onTranscript={handleVoiceTranscript} onEmotion={handleEmotion} />
      </div>
    </div>
  )
}