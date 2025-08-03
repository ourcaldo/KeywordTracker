/**
 * Authentication Middleware
 * 
 * Provides utilities for route protection and authentication checks.
 * Used across the application to ensure proper access control.
 */

import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

/**
 * Creates a Supabase client for middleware operations
 */
export function createMiddlewareClient(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  return { supabase, response }
}

/**
 * Checks if the user is authenticated
 */
export async function isAuthenticated(request: NextRequest) {
  const { supabase } = createMiddlewareClient(request)
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return !!user
  } catch {
    return false
  }
}

/**
 * Gets the current user from the request
 */
export async function getCurrentUser(request: NextRequest) {
  const { supabase } = createMiddlewareClient(request)
  
  try {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  } catch {
    return null
  }
}