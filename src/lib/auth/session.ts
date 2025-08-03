import { cookies } from 'next/headers'

export interface SessionUser {
  id: string
  email: string
  firstName: string
  lastName: string
}

export async function getServerSession(): Promise<SessionUser | null> {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('user_session')
    
    if (!sessionCookie) {
      return null
    }
    
    const user = JSON.parse(sessionCookie.value) as SessionUser
    return user
  } catch (error) {
    console.error('Session parsing error:', error)
    return null
  }
}

export function getClientSession(): SessionUser | null {
  if (typeof window === 'undefined') return null
  
  try {
    // For client-side, we'll check for the cookie manually or use localStorage
    const sessionData = localStorage.getItem('user_session')
    if (sessionData) {
      return JSON.parse(sessionData) as SessionUser
    }
    return null
  } catch (error) {
    console.error('Client session parsing error:', error)
    return null
  }
}

export function setClientSession(user: SessionUser) {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('user_session', JSON.stringify(user))
}

export function clearClientSession() {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('user_session')
}