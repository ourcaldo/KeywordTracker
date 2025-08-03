/**
 * Database Types
 * 
 * TypeScript definitions for all database tables and relationships.
 * Generated from Supabase schema for type safety.
 */

export interface Database {
  public: {
    Tables: {
      user_profiles: {
        Row: {
          id: string
          user_id: string
          full_name: string | null
          avatar_url: string | null
          plan: 'free' | 'basic' | 'pro' | 'enterprise'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'basic' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          full_name?: string | null
          avatar_url?: string | null
          plan?: 'free' | 'basic' | 'pro' | 'enterprise'
          created_at?: string
          updated_at?: string
        }
      }
      workspaces: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      sites: {
        Row: {
          id: string
          workspace_id: string
          domain: string
          name: string
          location: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          workspace_id: string
          domain: string
          name: string
          location: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          workspace_id?: string
          domain?: string
          name?: string
          location?: string
          created_at?: string
          updated_at?: string
        }
      }
      keywords: {
        Row: {
          id: string
          site_id: string
          keyword: string
          target_url: string | null
          volume: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          site_id: string
          keyword: string
          target_url?: string | null
          volume?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          site_id?: string
          keyword?: string
          target_url?: string | null
          volume?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      keyword_rankings: {
        Row: {
          id: string
          keyword_id: string
          position: number | null
          device: 'mobile' | 'desktop'
          location: string
          recorded_at: string
          created_at: string
        }
        Insert: {
          id?: string
          keyword_id: string
          position?: number | null
          device: 'mobile' | 'desktop'
          location: string
          recorded_at: string
          created_at?: string
        }
        Update: {
          id?: string
          keyword_id?: string
          position?: number | null
          device?: 'mobile' | 'desktop'
          location?: string
          recorded_at?: string
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
      user_plan: 'free' | 'basic' | 'pro' | 'enterprise'
      device_type: 'mobile' | 'desktop'
    }
  }
}

// Convenience types
export type UserProfile = Database['public']['Tables']['user_profiles']['Row']
export type Workspace = Database['public']['Tables']['workspaces']['Row']
export type Site = Database['public']['Tables']['sites']['Row']
export type Keyword = Database['public']['Tables']['keywords']['Row']
export type KeywordRanking = Database['public']['Tables']['keyword_rankings']['Row']

export type UserPlan = Database['public']['Enums']['user_plan']
export type DeviceType = Database['public']['Enums']['device_type']