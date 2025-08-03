// Type definitions for database entities
// Using client-side Supabase client from services

export interface Workspace {
  id: string
  user_id: string
  name: string
  description?: string
  created_at: string
  updated_at: string
}

export interface Site {
  id: string
  workspace_id: string
  user_id: string
  domain: string
  name: string
  location: string
  created_at: string
  updated_at: string
}

export interface Keyword {
  id: string
  site_id: string
  workspace_id: string
  user_id: string
  keyword: string
  target_url?: string
  volume?: number
  created_at: string
  updated_at: string
}

export interface KeywordRanking {
  id: string
  keyword_id: string
  site_id: string
  workspace_id: string
  user_id: string
  position?: number
  device: 'desktop' | 'mobile'
  location: string
  recorded_at: string
  created_at: string
}

export interface UserProfile {
  id: string
  user_id: string
  full_name?: string
  avatar_url?: string
  plan: 'free' | 'pro' | 'enterprise'
  created_at: string
  updated_at: string
  phone_number?: string
  email?: string
}

export interface KeywordWithRanking {
  id: string
  site_id: string
  workspace_id: string
  user_id: string
  keyword: string
  target_url?: string
  volume?: number
  created_at: string
  updated_at: string
  latest_position?: number
  latest_device?: 'desktop' | 'mobile'
  latest_location?: string
  latest_recorded_at?: string
}