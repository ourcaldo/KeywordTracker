/**
 * Sign Up Page - Dedicated Route
 * Redirects to main auth page with signup mode enabled
 */

'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function SignUpPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirect to main login page with signup mode
    router.push('/auth/login?mode=signup')
  }, [router])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ color: 'white', textAlign: 'center' }}>
        <p>Redirecting to sign up...</p>
      </div>
    </div>
  )
}