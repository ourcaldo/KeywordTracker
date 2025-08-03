import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  console.log('=== TEMPORARY LOGIN BYPASS ===')
  console.log('Email:', email)
  
  try {
    const adminSupabase = createAdminClient()
    
    // Check if user exists in user_profiles
    const { data: user, error } = await adminSupabase
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (error || !user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
    }
    
    console.log('SUCCESS: User found with ID:', user.user_id)
    
    // Create a session cookie (temporary solution)
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: user.user_id,
        email: user.email,
        user_metadata: {
          first_name: user.first_name,
          last_name: user.last_name
        }
      }
    })
    
    // Set session cookie
    response.cookies.set('user_session', JSON.stringify({
      id: user.user_id,
      email: user.email,
      firstName: user.first_name,
      lastName: user.last_name
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return response
    
  } catch (error: any) {
    console.error('LOGIN ERROR:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}