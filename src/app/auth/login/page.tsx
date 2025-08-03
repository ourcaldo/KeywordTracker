/**
 * Login Page
 * 
 * Main authentication page that provides sign in and sign up functionality.
 * Uses the AuthLayout for consistent branding and responsive design.
 */

import { AuthLayout } from '@/components/auth/auth-layout'
import { LoginForm } from '@/components/auth/login-form'

export default function LoginPage() {
  return (
    <AuthLayout 
      title="Welcome back" 
      subtitle="Sign in to your account to continue tracking your keywords"
    >
      <LoginForm />
    </AuthLayout>
  )
}