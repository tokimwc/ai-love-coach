"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { useVoiceInput } from "@/hooks/useVoiceInput"

interface VoiceInputProps {
  onTranscript: (transcript: string) => void
  onEmotion: (emotion: string) => void
}

export default function VoiceInput({ onTranscript, onEmotion }: VoiceInputProps) {
  const [isRecording, setIsRecording] = useState(false)
  const { startRecording, stopRecording } = useVoiceInput({
    onTranscript,
    onEmotion,
  })

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
    setIsRecording(!isRecording)
  }

  return (
    <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "default"}>
      {isRecording ? <MicOff className="h-4 w-4 mr-2" /> : <Mic className="h-4 w-4 mr-2" />}
      {isRecording ? "Stop Recording" : "Start Recording"}
    </Button>
  )
}