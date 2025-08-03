import { createAdminClient } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password, firstName, lastName, phoneNumber } = await request.json()
  
  console.log('=== SIGNUP ATTEMPT ===')
  console.log('Email:', email)
  
  try {
    const supabaseAdmin = createAdminClient()

    // Check if user already exists
    const { data: existingUser } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('email', email)
      .single()
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }

    // Create user with proper metadata for the trigger function
    console.log('Creating user with proper metadata...')
    const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        full_name: `${firstName} ${lastName}` // This will be used by the trigger
      }
    })

    if (authError) {
      console.log('Auth user creation failed:', authError.message)
      return NextResponse.json({ error: authError.message }, { status: 400 })
    }

    if (!authUser.user) {
      return NextResponse.json({ error: 'Failed to create auth user' }, { status: 400 })
    }

    console.log('Auth user created successfully:', authUser.user.id)

    // The trigger should have created the user_profiles record automatically
    // But let's make sure it has all the data we need
    const { data: profile, error: profileError } = await supabaseAdmin
      .from('user_profiles')
      .select('*')
      .eq('user_id', authUser.user.id)
      .single()

    if (profileError || !profile) {
      // Manually create profile if trigger failed
      console.log('Creating user profile manually...')
      const { data: newProfile, error: insertError } = await supabaseAdmin
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

      if (insertError) {
        console.log('Profile creation failed:', insertError.message)
        return NextResponse.json({ error: 'Failed to create user profile' }, { status: 500 })
      }
    }

    console.log('SUCCESS: User and profile created')
    
    return NextResponse.json({ 
      success: true, 
      message: 'Account created successfully! Please log in.',
      redirect: '/auth/login'
    })
    
  } catch (error: any) {
    console.error('SIGNUP ERROR:', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}