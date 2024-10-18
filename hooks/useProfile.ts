"use client"

import { useState, useEffect } from "react"
import { supabase } from '../lib/supabase'
import { Database } from '../types/supabase'

// ここでProfileの型を定義
type Profile = Database['public']['Tables']['profiles']['Row']

export function useProfile() {
  const [profile, setProfile] = useState<Profile>({
    id: "",
    name: "",
    age: 0,
    gender: "",
    bio: "",
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    setIsLoading(true)
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .single()

    if (error) {
      console.error("Error fetching profile:", error)
    } else if (data) {
      setProfile(data)
    }
    setIsLoading(false)
  }

  const updateProfile = async (updatedProfile: Partial<Profile>) => {
    setIsLoading(true)
    const { error } = await supabase
      .from("profiles")
      .update(updatedProfile)
      .eq("id", profile.id)

    if (error) {
      console.error("Error updating profile:", error)
    } else {
      setProfile((prev) => ({ ...prev, ...updatedProfile }))
    }
    setIsLoading(false)
  }

  return { profile, updateProfile, isLoading }
}
