'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { Button } from '@/components/ui/button'
import { ChevronDown, RefreshCw, Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DashboardService } from '@/services/dashboard.service'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [currentSite, setCurrentSite] = useState<any>(null)
  const [keywords, setKeywords] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    initializeDashboard()
  }, [])

  const initializeDashboard = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session) {
        router.push('/auth/login')
        return
      }

      setUser(session.user)
      await loadDashboardData(session.user.id)
    } catch (error) {
      console.error('Error initializing dashboard:', error)
      setLoading(false)
    }
  }

  const loadDashboardData = async (userId: string) => {
    try {
      // Get user's workspaces
      const workspaces = await DashboardService.getUserWorkspaces(userId)
      if (workspaces.length === 0) {
        setLoading(false)
        return
      }

      // Get sites from the first workspace
      const sites = await DashboardService.getWorkspaceSites(workspaces[0].id, userId)
      if (sites.length === 0) {
        setLoading(false)
        return
      }

      const site = sites[0]
      setCurrentSite(site)

      // Get keywords and stats for this site
      const [siteKeywords, siteStats] = await Promise.all([
        DashboardService.getSiteKeywords(site.id, userId),
        DashboardService.getSiteStats(site.id, userId)
      ])

      setKeywords(siteKeywords)
      setStats(siteStats)
      setLastUpdate('3 seconds ago')
      setLoading(false)
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    if (user) {
      setLoading(true)
      loadDashboardData(user.id)
    }
  }

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading dashboard data...</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  if (!currentSite) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-gray-600 mb-4">No sites found. Create a workspace and add your first domain to get started.</p>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Add Your First Domain
            </Button>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Site Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                {currentSite.domain}
                <ChevronDown className="h-5 w-5 text-gray-400" />
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">Last full update: {lastUpdate}</span>
            <Button
              onClick={handleRefresh}
              variant="ghost"
              size="sm"
              className="text-blue-600 hover:bg-blue-50"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4 py-4">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-gray-200/50">
              Tags <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-gray-200/50">
              Locations <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-gray-200/50">
              Positions <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-gray-200/50">
              Volume <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-gray-200/50">
              Traffic <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/80 backdrop-blur-sm border-gray-200/50">
              KD <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search keywords"
                className="w-full pl-10 pr-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards with Glass Effects */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">VISIBILITY</h3>
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.visibility || 0}%</div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">+1.34</span>
              <span className="text-sm text-gray-500 ml-1">1.34%</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">TRAFFIC</h3>
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.traffic?.toLocaleString() || '0'}</div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">+126</span>
              <span className="text-sm text-gray-500 ml-1">2.1%</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">AVERAGE POSITION</h3>
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.averagePosition || '0.00'}</div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-red-600">+2.65</span>
              <span className="text-sm text-gray-500 ml-1">2.65%</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">SERP FEATURES</h3>
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div className="text-2xl font-bold text-gray-900">{stats?.serpFeatures || 0}</div>
            <div className="flex items-center mt-2">
              <span className="text-sm text-green-600">+90</span>
              <span className="text-sm text-gray-500 ml-1">26.6%</span>
            </div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-medium text-gray-600">RANK DISTRIBUTIONS</h3>
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              </div>
            </div>
            <div className="flex items-center gap-1 mt-2">
              <span className="text-sm text-green-600">↑{stats?.rankDistribution?.['1-3'] || 0}</span>
              <span className="text-xs text-gray-500">1-3</span>
              <span className="text-sm text-red-600 ml-2">↓{stats?.rankDistribution?.['4-10'] || 0}</span>
              <span className="text-xs text-gray-500">4-10</span>
            </div>
          </div>
        </div>

        {/* Keywords Table */}
        <div className="bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-xl shadow-sm">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" className="bg-gray-100 text-gray-900">Top 100</Button>
              <Button variant="ghost" size="sm" className="text-gray-600">Top 50</Button>
              <Button variant="ghost" size="sm" className="text-gray-600">Top 20</Button>
              <Button variant="ghost" size="sm" className="text-gray-600">Top 10</Button>
              <Button variant="ghost" size="sm" className="text-gray-600">Top 5</Button>
              <Button variant="ghost" size="sm" className="text-gray-600">Top 3</Button>
              <div className="flex-1"></div>
              <Button variant="outline" size="sm" className="bg-white border-gray-200">
                Export All
              </Button>
              <Button className="bg-blue-600 hover:bg-blue-700" size="sm">
                + Add Keywords
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200/50">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">KEYWORD</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">POSITION</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">1D</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">7D</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">30D</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">VOLUME</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">TRAFFIC</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">KD</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">SERP</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">LOCATION</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-600">UPDATE</th>
                  </tr>
                </thead>
                <tbody>
                  {keywords.length === 0 ? (
                    <tr>
                      <td colSpan={11} className="text-center py-8 text-gray-500">
                        No keywords found. Add your first keywords to start tracking.
                      </td>
                    </tr>
                  ) : (
                    keywords.slice(0, 10).map((keyword) => (
                      <tr key={keyword.id} className="border-b border-gray-100 hover:bg-gray-50/50">
                        <td className="py-3 px-4">
                          <span className="text-blue-600 hover:underline cursor-pointer">
                            {keyword.keyword}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-medium">
                            {keyword.latest_position || '--'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-600">↑1</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-600">↑1</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-red-600">↓1</span>
                        </td>
                        <td className="py-3 px-4">
                          {keyword.volume?.toLocaleString() || '--'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-green-600">↑12</span>
                        </td>
                        <td className="py-3 px-4">
                          {Math.floor(Math.random() * 50) + 1}
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-blue-600">SERP→</span>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-2">
                            <span className="text-xs">🇺🇸</span>
                            <span className="text-sm">{keyword.latest_location || 'United States (EN)'}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-500">
                          7 sep
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}