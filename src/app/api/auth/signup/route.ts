import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const { email, password, firstName, lastName, phoneNumber } = await request.json()
  
  console.log('=== SERVER-SIDE SIGNUP DEBUG ===')
  console.log('Email:', email)
  console.log('First Name:', firstName)
  console.log('Last Name:', lastName)
  console.log('Phone:', phoneNumber)
  
  try {
    const supabase = await createClient()
    
    console.log('Creating user with minimal Supabase Auth...')
    const { data, error } = await supabase.auth.signUp({
      email,
      password
    })

    console.log('Supabase Auth response:')
    console.log('Data:', JSON.stringify(data, null, 2))
    console.log('Error:', error)

    if (error) {
      console.error('SIGNUP ERROR:', error.message)
      console.error('Error details:', JSON.stringify(error, null, 2))
      return NextResponse.json({ error: error.message }, { status: 400 })
    }

    if (data.user) {
      console.log('User created successfully with ID:', data.user.id)
      console.log('User metadata:', data.user.user_metadata)
      return NextResponse.json({ success: true, user: data.user })
    }

    return NextResponse.json({ error: 'No user returned' }, { status: 400 })
    
  } catch (error: any) {
    console.error('SERVER ERROR:', error.message)
    console.error('Stack trace:', error.stack)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}