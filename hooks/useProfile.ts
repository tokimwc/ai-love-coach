"use client"

import { useState, useEffect } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient("YOUR_SUPABASE_URL", "YOUR_SUPABASE_ANON_KEY")

interface Profile {
  id: string
  name: string
  age: number
  gender: string
  bio: string
}

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