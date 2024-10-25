export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      user_settings: {
        Row: {
          id: string
          user_id: string
          ai_service: string
          openai_key: string | null
          dify_key: string | null
          dify_api_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          ai_service?: string
          openai_key?: string | null
          dify_key?: string | null
          dify_api_url?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          ai_service?: string
          openai_key?: string | null
          dify_key?: string | null
          dify_api_url?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
