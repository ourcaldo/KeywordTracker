import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/dashboard'

  if (code) {
    const supabase = await createClient()
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && data.user) {
      // Create user profile after successful email confirmation
      const userData = data.user.user_metadata
      
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('tb_user_profiles')
        .select('id')
        .eq('user_id', data.user.id)
        .single()
      
      if (!existingProfile) {
        // Create profile manually since trigger is broken
        await supabase.from('tb_user_profiles').insert({
          user_id: data.user.id,
          first_name: userData?.first_name || '',
          last_name: userData?.last_name || '',
          phone_number: userData?.phone || '',
          email: data.user.email || '',
          plan: 'free'
        })
      }
      
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`)
}