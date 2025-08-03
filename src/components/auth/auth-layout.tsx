/**
 * Authentication Layout Component
 * 
 * Provides a consistent layout wrapper for all authentication pages.
 * Features a centered design with branding and responsive layout.
 */

import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
  title: string
  subtitle?: string
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-white">
      <div className="flex min-h-screen">
        {/* Left side - Branding */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-600 to-indigo-700 relative">
          <div className="relative z-10 flex items-center justify-center p-12 w-full">
            <div className="text-center text-white max-w-md">
              <div className="mb-12">
                <div className="w-16 h-16 mx-auto mb-6 bg-white bg-opacity-20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
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
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                    />
                  </svg>
                </div>
                <h1 className="text-4xl font-bold mb-4">Keyword Tracker</h1>
                <p className="text-xl text-blue-100">
                  Professional SEO keyword tracking and ranking monitoring
                </p>
              </div>
              
              <div className="space-y-6 text-left">
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-blue-100 mb-1">Real-time Monitoring</h3>
                    <p className="text-blue-200 text-sm">Track keyword positions across search engines</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-blue-100 mb-1">Advanced Analytics</h3>
                    <p className="text-blue-200 text-sm">Detailed insights and performance metrics</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-2 h-2 bg-blue-300 rounded-full mt-3 flex-shrink-0"></div>
                  <div>
                    <h3 className="font-semibold text-blue-100 mb-1">Multi-site Management</h3>
                    <p className="text-blue-200 text-sm">Organize and track multiple websites</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Form */}
        <div className="flex-1 flex items-center justify-center p-8 bg-gray-50 lg:bg-white">
          <div className="w-full max-w-md">
            <div className="text-center mb-8 lg:hidden">
              <div className="w-12 h-12 mx-auto mb-4 bg-blue-600 rounded-xl flex items-center justify-center">
                <svg 
                  className="w-6 h-6 text-white" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" 
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900">Keyword Tracker</h1>
            </div>
            
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">{title}</h2>
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
            </div>
            
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}