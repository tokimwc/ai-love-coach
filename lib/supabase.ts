import { createBrowserClient } from '@supabase/ssr'
import { Database } from '../types/supabase'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const createClient = () =>
  createBrowserClient<Database>(supabaseUrl, supabaseAnonKey)

// クライアントコンポーネントで使用するためのsupabaseインスタンスを作成
export const supabase = createClient()