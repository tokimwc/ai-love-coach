"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

export default function Settings() {
  const [openaiApiKey, setOpenaiApiKey] = useState('')

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
        alert('Error saving API key. Please try again.')
      } else {
        alert('API key saved successfully!')
      }
    }
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <div className="space-y-4">
        <div>
          <label htmlFor="openai-api-key" className="block text-sm font-medium text-gray-700">
            OpenAI API Key
          </label>
          <Input
            id="openai-api-key"
            type="password"
            value={openaiApiKey}
            onChange={(e) => setOpenaiApiKey(e.target.value)}
            placeholder="Enter your OpenAI API key"
          />
        </div>
        <Button onClick={handleSaveApiKey}>Save API Key</Button>
      </div>
    </div>
  )
}