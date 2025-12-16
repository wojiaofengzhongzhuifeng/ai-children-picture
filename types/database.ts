export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string | null
          nickname: string | null
          avatar_url: string | null
          role: 'user' | 'admin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email?: string | null
          nickname?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          nickname?: string | null
          avatar_url?: string | null
          role?: 'user' | 'admin'
          created_at?: string
          updated_at?: string
        }
      }
      images: {
        Row: {
          id: string
          user_id: string
          prompt: string
          negative_prompt: string | null
          image_url: string | null
          model: string
          width: number
          height: number
          is_public: boolean
          status: 'pending' | 'processing' | 'success' | 'failed'
          error_message: string | null
          likes_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt: string
          negative_prompt?: string | null
          image_url?: string | null
          model?: string
          width?: number
          height?: number
          is_public?: boolean
          status?: 'pending' | 'processing' | 'success' | 'failed'
          error_message?: string | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt?: string
          negative_prompt?: string | null
          image_url?: string | null
          model?: string
          width?: number
          height?: number
          is_public?: boolean
          status?: 'pending' | 'processing' | 'success' | 'failed'
          error_message?: string | null
          likes_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      generations: {
        Row: {
          id: string
          user_id: string
          image_id: string | null
          model: string
          prompt: string
          params: Json | null
          status: 'pending' | 'processing' | 'success' | 'failed'
          error_message: string | null
          generation_time: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_id?: string | null
          model: string
          prompt: string
          params?: Json | null
          status?: 'pending' | 'processing' | 'success' | 'failed'
          error_message?: string | null
          generation_time?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_id?: string | null
          model?: string
          prompt?: string
          params?: Json | null
          status?: 'pending' | 'processing' | 'success' | 'failed'
          error_message?: string | null
          generation_time?: number | null
          created_at?: string
        }
      }
      likes: {
        Row: {
          id: string
          user_id: string
          image_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          image_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          image_id?: string
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
