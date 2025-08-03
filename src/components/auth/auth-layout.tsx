/**
 * Authentication Layout Component
 * 
 * Clean, modern authentication layout with proper styling and branding.
 * Simple two-column design with logo and form.
 */

import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-blue-600 relative">
        <div className="flex items-center justify-center w-full p-12">
          <div className="text-center text-white">
            <div className="w-20 h-20 mx-auto mb-8 bg-white/20 rounded-2xl flex items-center justify-center">
              <svg 
                className="w-10 h-10 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold mb-4">Keyword Tracker</h1>
            <p className="text-blue-100 text-lg">
              Professional SEO keyword tracking and ranking monitoring
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <div className="w-16 h-16 mx-auto mb-4 bg-blue-600 rounded-xl flex items-center justify-center">
              <svg 
                className="w-8 h-8 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" 
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Keyword Tracker</h1>
          </div>
          
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
            {subtitle && (
              <p className="text-gray-600 text-sm">{subtitle}</p>
            )}
          </div>
          
          {children}
        </div>
      </div>
    </div>
  )
}