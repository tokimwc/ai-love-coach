import { createClient as createSupabaseClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'

export function createClient(cookieStore: ReturnType<typeof cookies>) {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
        storage: {
          getItem: async (key: string) => {
            return cookieStore.get(key)?.value ?? null // undefined を null に変更し、非同期に対応
          },
          setItem: async (key: string, value: string) => {
            cookieStore.set(key, value, { path: '/' })
          },
          removeItem: async (key: string) => {
            cookieStore.set(key, '', { path: '/', maxAge: 0 })
          },
        },
      },
    }
  )
}
