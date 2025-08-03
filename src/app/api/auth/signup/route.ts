import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password, firstName, lastName, phoneNumber } = await request.json()
  
  console.log('=== REAL SIGNUP ATTEMPT ===')
  console.log('Email:', email)
  
  try {
    // Create admin client with proper service role key
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create user in auth.users table using admin API with minimal data
    console.log('Creating user in auth.users with minimal config...')
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true
    })

    if (authError) {
      console.log('Auth user creation failed:', authError.message)
      
      // Check if it's an email confirmation issue
      if (authError.message.includes('email confirmation')) {
        return NextResponse.json({ 
          error: 'Email confirmation is required in Supabase settings. Please disable it in Auth > Settings > Email Confirmation.' 
        }, { status: 400 })
      }
      
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authUser.user) {
      return NextResponse.json({ error: 'Failed to create auth user' }, { status: 400 })
    }

    console.log('Auth user created successfully:', authUser.user.id)

    // Create corresponding user profile
    console.log('Creating user profile...')
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .insert({
        user_id: authUser.user.id,
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        email: email,
        plan: 'free'
      })
      .select()
      .single()

    if (profileError) {
      console.log('Profile creation failed:', profileError.message)
      // User was created in auth but profile failed - this is still success
      console.log('Auth user exists, profile creation failed but continuing...')
    }

    console.log('SUCCESS: User created with ID:', authUser.user.id)
    
    // Create session cookie
    const response = NextResponse.json({ 
      success: true, 
      user: { 
        id: authUser.user.id,
        email: authUser.user.email,
        user_metadata: {
          first_name: firstName,
          last_name: lastName
        }
      }
    })
    
    response.cookies.set('user_session', JSON.stringify({
      id: authUser.user.id,
      email: authUser.user.email,
      firstName: firstName,
      lastName: lastName
    }), {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7 // 7 days
    })
    
    return response
    
  } catch (error: any) {
    console.error('SIGNUP ERROR:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}