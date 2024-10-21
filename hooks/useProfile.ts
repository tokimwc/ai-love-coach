"use client"

import { useState, useEffect, useCallback } from "react"
import { createClient } from '@/lib/supabase'

interface Profile {
  id: string;
  name: string;
  age: number;
  gender: string;
  bio: string;
}

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isInitialProfile, setIsInitialProfile] = useState(false)
  const supabase = createClient()

  const fetchProfile = useCallback(async () => {
    setIsLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      if (error) {
        if (error.code === 'PGRST116') {
          // プロフィールが見つからない場合、初回プロフィール作成とみなす
          setIsInitialProfile(true)
          setProfile(null)
        } else {
          console.error('プロフィールの取得中にエラーが発生しました:', error)
          setProfile(null)
        }
      } else {
        setProfile(data)
        setIsInitialProfile(false)
      }
    }
    setIsLoading(false)
  }, [supabase])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = useCallback(async (updatedProfile: Omit<Profile, 'id'>): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      setIsLoading(false)
      return { success: false, message: 'ユーザーが認証されていません。' }
    }

    const profileData = { ...updatedProfile, id: user.id }

    let result
    if (isInitialProfile) {
      result = await supabase.from('profiles').insert([profileData])
    } else {
      result = await supabase.from('profiles').update(profileData).eq('id', user.id)
    }

    if (result.error) {
      console.error('プロフィールの更新中にエラーが発生しました:', result.error)
      setIsLoading(false)
      return { success: false, message: 'プロフィールの更新に失敗しました。' }
    } else {
      setProfile(profileData as Profile)
      setIsInitialProfile(false)
      setIsLoading(false)
      return { success: true, message: 'プロフィールが正常に更新されました。' }
    }
  }, [supabase, isInitialProfile])

  return { profile, updateProfile, isLoading, fetchProfile, isInitialProfile }
}
