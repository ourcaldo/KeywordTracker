import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password } = await request.json()
  
  console.log('=== LOGIN ATTEMPT ===')
  console.log('Email:', email)
  
  try {
    const supabase = await createClient()
    
    // Use proper Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    
    if (authError || !authData.user) {
      console.log('Login failed:', authError?.message)
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 })
    }
    
    console.log('SUCCESS: User authenticated:', authData.user.id)
    
    return NextResponse.json({ 
      success: true, 
      user: { 
        id: authData.user.id,
        email: authData.user.email,
        user_metadata: authData.user.user_metadata
      }
    })
    
  } catch (error: any) {
    console.error('LOGIN ERROR:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}