"use client"

import { useState, useCallback } from "react"
import { supabase } from '@/lib/supabase'
import OpenAI from 'openai'

interface UseVoiceInputProps {
  onTranscript: (transcript: string) => void
  onEmotion: (emotion: string) => void
}

export function useVoiceInput({ onTranscript, onEmotion }: UseVoiceInputProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null)
  const [openai, setOpenai] = useState<OpenAI | null>(null)

  const initOpenAI = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('user_settings')
        .select('openai_api_key')
        .eq('user_id', user.id)
        .single()

      if (data && data.openai_api_key) {
        setOpenai(new OpenAI({ apiKey: data.openai_api_key }))
      } else {
        console.error('OpenAI API key not found')
        alert('Please set your OpenAI API key in the settings page.')
      }
    }
  }

  const startRecording = useCallback(async () => {
    await initOpenAI()
    if (!openai) return

    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const recorder = new MediaRecorder(stream)
        setMediaRecorder(recorder)

        recorder.ondataavailable = async (event) => {
          const audioBlob = event.data
          const formData = new FormData()
          formData.append('file', audioBlob, 'audio.webm')
          formData.append('model', 'whisper-1')

          try {
            const response = await openai.audio.transcriptions.create({
              file: audioBlob,
              model: 'whisper-1',
            })

            const transcript = response.text
            onTranscript(transcript)

            // Simple emotion analysis (you may want to use a more sophisticated method)
            const emotion = analyzeEmotion(transcript)
            onEmotion(emotion)
          } catch (error) {
            console.error('Error transcribing audio:', error)
          }
        }

        recorder.start()
      })
      .catch((error) => console.error("Error accessing microphone:", error))
  }, [onTranscript, onEmotion, openai])

  const stopRecording = useCallback(() => {
    if (mediaRecorder) {
      mediaRecorder.stop()
      mediaRecorder.stream.getTracks().forEach((track) => track.stop())
    }
  }, [mediaRecorder])

  const analyzeEmotion = (text: string): string => {
    const emotionKeywords: Record<string, string[]> = {
      happy: ['happy', 'joy', 'excited', 'glad', 'delighted'],
      sad: ['sad', 'unhappy', 'depressed', 'down', 'blue'],
      angry: ['angry', 'mad', 'furious', 'irritated', 'annoyed'],
      neutral: ['okay', 'fine', 'normal', 'average', 'so-so']
    }

    const words = text.toLowerCase().split(/\s+/)
    const emotionScores: Record<string, number> = {
      happy: 0,
      sad: 0,
      angry: 0,
      neutral: 0
    }

    for (const word of words) {
      for (const [emotion, keywords] of Object.entries(emotionKeywords)) {
        if (keywords.includes(word)) {
          emotionScores[emotion]++
        }
      }
    }

    const dominantEmotion = Object.entries(emotionScores).reduce((a, b) => a[1] > b[1] ? a : b)[0]
    return dominantEmotion
  }

  return { startRecording, stopRecording }
}