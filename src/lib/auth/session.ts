/**
 * Session Management Utilities
 * 
 * Client-side and server-side utilities for managing user sessions.
 * Provides consistent session handling across the application.
 */

import { createClient } from '@/lib/supabase/client'
import { createClient as createServerClient } from '@/lib/supabase/server'

/**
 * Client-side session utilities
 */
export const clientAuth = {
  /**
   * Get current user on client side
   */
  async getCurrentUser() {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  /**
   * Sign out user on client side
   */
  async signOut() {
    const supabase = createClient()
    await supabase.auth.signOut()
  },

  /**
   * Listen to auth state changes
   */
  onAuthStateChange(callback: (user: any) => void) {
    const supabase = createClient()
    return supabase.auth.onAuthStateChange((event, session) => {
      callback(session?.user || null)
    })
  }
}

/**
 * Server-side session utilities
 */
export const serverAuth = {
  /**
   * Get current user on server side
   */
  async getCurrentUser() {
    const supabase = await createServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  /**
   * Require authentication (throws if not authenticated)
   */
  async requireAuth() {
    const user = await this.getCurrentUser()
    if (!user) {
      throw new Error('Authentication required')
    }
    return user
  }
}