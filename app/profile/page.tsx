"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select } from "@/components/ui/select"
import { useProfile } from "@/hooks/useProfile"
import { toast } from "@/hooks/use-toast"
import { createClient } from '@/app/utils/supabase/client'

// プロフィールの型を定義
interface Profile {
  name: string;
  age: number;
  gender: string;
  bio: string;
}

export default function ProfilePage() {
  const { profile, updateProfile, isLoading, isInitialProfile } = useProfile();
  const [formData, setFormData] = useState<Profile>({
    name: '',
    age: 18,
    gender: '',
    bio: ''
  })
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
      }
    }
    checkSession()
  }, [supabase, router])

  useEffect(() => {
    if (profile) {
      setFormData(profile)
    }
  }, [profile])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: name === 'age' ? Number(value) : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (updateProfile) {
      const result = await updateProfile(formData);
      if (result.success) {
        toast({
          title: "成功",
          description: result.message,
        })
      } else {
        toast({
          title: "エラー",
          description: result.message,
          variant: "destructive",
        })
      }
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">あなたのプロフィール</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            名前
          </label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-gray-700">
            年齢
          </label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            required
            min={1}
          />
        </div>
        <div>
          <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
            性別
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            required
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="">選択してください</option>
            <option value="男性">男性</option>
            <option value="女性">女性</option>
            <option value="その他">その他</option>
          </select>
        </div>
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
            自己紹介
          </label>
          <Textarea
            id="bio"
            name="bio"
            value={formData.bio}
            onChange={handleChange}
            rows={4}
          />
        </div>
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "処理中..." : isInitialProfile ? "プロフィールを登録" : "プロフィールを更新"}
        </Button>
      </form>
    </div>
  )
}
