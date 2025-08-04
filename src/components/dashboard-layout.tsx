'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { DashboardService } from '@/services/dashboard.service'
import { Button } from '@/components/ui/button'
import { 
  LayoutDashboard, 
  Search, 
  Settings, 
  LogOut,
  Menu,
  X,
  Plus
} from 'lucide-react'

interface DashboardLayoutProps {
  children: React.ReactNode
  workspaceSelector?: React.ReactNode
}

export function DashboardLayout({ children, workspaceSelector }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [userProfile, setUserProfile] = useState<any>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    loadUserProfile()
  }, [])

  const loadUserProfile = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const profile = await DashboardService.getUserProfile(user.id)
        setUserProfile(profile)
      }
    } catch (error) {
      console.error('Error loading user profile:', error)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/login')
  }

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Keyword Tracker', href: '/keyword-tracker', icon: Search },
    { name: 'Settings', href: '/settings', icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-white relative">
      {/* Subtle background pattern for glass effect */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-72 h-72 bg-gray-400 rounded-full blur-3xl"></div>
        <div className="absolute top-40 right-32 w-64 h-64 bg-gray-500 rounded-full blur-3xl"></div>
        <div className="absolute bottom-40 left-32 w-80 h-80 bg-gray-300 rounded-full blur-3xl"></div>
      </div>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Icon Only */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-16 bg-white/90 backdrop-blur-sm border-r border-gray-200/50 shadow-sm transform transition-transform lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0 w-64' : '-translate-x-full'}
      `}>
        <div className="flex items-center justify-center p-4 border-b border-gray-100/50">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">W</span>
          </div>
          {sidebarOpen && (
            <>
              <h1 className="ml-3 text-lg font-semibold text-gray-900 lg:hidden">whatsmyserp</h1>
              <Button
                variant="ghost"
                size="icon"
                className="ml-auto lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </>
          )}
        </div>

        <nav className="p-2 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = typeof window !== 'undefined' && window.location.pathname === item.href
            return (
              <Button
                key={item.name}
                variant="ghost"
                className={`${sidebarOpen ? 'w-full justify-start h-10' : 'w-12 h-12 p-0 justify-center'} ${
                  isActive 
                    ? "bg-blue-50 text-blue-700 border border-blue-200/50" 
                    : "text-gray-600 hover:bg-gray-50/80"
                }`}
                onClick={() => {
                  router.push(item.href)
                  setSidebarOpen(false)
                }}
                title={item.name}
              >
                <Icon className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : ''} ${isActive ? "text-blue-600" : ""}`} />
                {sidebarOpen && <span className="lg:hidden">{item.name}</span>}
              </Button>
            )
          })}
        </nav>

        <div className={`absolute bottom-4 ${sidebarOpen ? 'left-4 right-4' : 'left-2 right-2'}`}>
          <Button
            variant="ghost"
            className={`${sidebarOpen ? 'w-full justify-start h-10' : 'w-12 h-12 p-0 justify-center'} text-gray-600 hover:bg-gray-50/80`}
            onClick={handleSignOut}
            title="Sign Out"
          >
            <LogOut className={`w-5 h-5 ${sidebarOpen ? 'mr-3' : ''}`} />
            {sidebarOpen && <span className="lg:hidden">Sign Out</span>}
          </Button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-16">
        {/* Top bar */}
        <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-4 py-4 lg:px-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              {workspaceSelector}
            </div>
            <div className="flex items-center gap-3">{/* Add Domain button removed - now handled by workspace selector */}
              <Button variant="ghost" size="icon" className="hover:bg-gray-50/80">
                <Settings className="h-5 w-5" />
              </Button>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {userProfile?.first_name ? userProfile.first_name.charAt(0).toUpperCase() : 'U'}
                  </span>
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {userProfile?.first_name || userProfile?.email || 'User'}
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-6 bg-white min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}