'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { DashboardLayout } from '@/components/dashboard-layout'
import { HierarchicalSelector } from '@/components/dashboard/hierarchical-selector'
import { WorkspaceModal } from '@/components/dashboard/workspace-modal'
import { SiteModal } from '@/components/dashboard/site-modal'
import { Button } from '@/components/ui/button'
import { ChevronDown, RefreshCw, Search, Filter } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { DashboardService } from '@/services/dashboard.service'
import { Workspace, Site } from '@/lib/database'

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null)
  const [currentSite, setCurrentSite] = useState<any>(null)
  const [keywords, setKeywords] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdate, setLastUpdate] = useState<string>('')
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [selectedWorkspace, setSelectedWorkspace] = useState<Workspace | undefined>()
  const [selectedSite, setSelectedSite] = useState<Site | undefined>()
  const [userProfile, setUserProfile] = useState<any>(null)
  const [showWorkspaceModal, setShowWorkspaceModal] = useState(false)
  const [showSiteModal, setShowSiteModal] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
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
      // Get user profile
      const profile = await DashboardService.getUserProfile(userId)
      setUserProfile(profile)

      // Get user's workspaces
      const userWorkspaces = await DashboardService.getUserWorkspaces(userId)
      setWorkspaces(userWorkspaces)
      
      if (userWorkspaces.length === 0) {
        setLoading(false)
        return
      }

      // Set first workspace as selected
      const firstWorkspace = userWorkspaces[0]
      setSelectedWorkspace(firstWorkspace)

      // Get sites from the first workspace
      const sites = await DashboardService.getWorkspaceSites(firstWorkspace.id, userId)
      if (sites.length === 0) {
        setLoading(false)
        return
      }

      const site = sites[0]
      setCurrentSite(site)
      setSelectedSite(site)

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

  const handleCreateWorkspace = async (name: string, description?: string) => {
    if (!user) return
    
    setFormLoading(true)
    try {
      const workspace = await DashboardService.createWorkspace(user.id, name, description)
      if (workspace) {
        const updatedWorkspaces = [...workspaces, workspace]
        setWorkspaces(updatedWorkspaces)
        setSelectedWorkspace(workspace)
        setShowWorkspaceModal(false)
        // Auto-open site form after workspace creation
        setTimeout(() => setShowSiteModal(true), 300)
      }
    } catch (error) {
      console.error('Error creating workspace:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleAddSite = async (domain: string, name: string) => {
    if (!user || !selectedWorkspace) return
    
    setFormLoading(true)
    try {
      const site = await DashboardService.createSite(selectedWorkspace.id, user.id, domain, name)
      if (site) {
        setCurrentSite(site)
        setSelectedSite(site)
        setShowSiteModal(false)
        await loadDashboardData(user.id)
      }
    } catch (error) {
      console.error('Error creating site:', error)
    } finally {
      setFormLoading(false)
    }
  }

  const handleWorkspaceSelect = async (workspace: Workspace) => {
    setSelectedWorkspace(workspace)
    setSelectedSite(undefined)
    setCurrentSite(null)
    
    // Load sites for this workspace
    if (user) {
      const sites = await DashboardService.getWorkspaceSites(workspace.id, user.id)
      if (sites.length > 0) {
        const firstSite = sites[0]
        setCurrentSite(firstSite)
        setSelectedSite(firstSite)
        
        // Load data for this site
        const [siteKeywords, siteStats] = await Promise.all([
          DashboardService.getSiteKeywords(firstSite.id, user.id),
          DashboardService.getSiteStats(firstSite.id, user.id)
        ])
        
        setKeywords(siteKeywords)
        setStats(siteStats)
        setLastUpdate('3 seconds ago')
      }
    }
  }

  const handleSiteSelect = async (site: Site) => {
    setSelectedSite(site)
    setCurrentSite(site)
    
    if (user) {
      // Load data for this site
      const [siteKeywords, siteStats] = await Promise.all([
        DashboardService.getSiteKeywords(site.id, user.id),
        DashboardService.getSiteStats(site.id, user.id)
      ])
      
      setKeywords(siteKeywords)
      setStats(siteStats)
      setLastUpdate('3 seconds ago')
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
    // Check if user has workspaces but no sites
    if (workspaces.length > 0) {
      return (
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Workspace Ready!</h2>
              <p className="text-lg text-gray-700 mb-2">Your workspace "{workspaces[0].name}" is all set</p>
              <p className="text-gray-500 mb-8">Now add your first domain to start tracking keywords and monitor your search rankings.</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowSiteModal(true)}
              >
                Add Your First Domain
              </Button>
              
              {/* Show domain modal directly here if state is true */}
              {showSiteModal && (
                <div 
                  className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowSiteModal(false)}
                >
                  <div 
                    className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Add Domain Site</h2>
                    <p className="text-gray-600 mb-4">Add a domain to track keywords and monitor rankings.</p>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.target as HTMLFormElement)
                      const domain = formData.get('domain') as string
                      const name = formData.get('name') as string
                      
                      if (domain.trim() && name.trim()) {
                        handleAddSite(domain.trim(), name.trim())
                      }
                    }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Domain *
                        </label>
                        <input
                          name="domain"
                          type="text"
                          placeholder="e.g., example.com"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                          disabled={formLoading}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Site Name *
                        </label>
                        <input
                          name="name"
                          type="text"
                          placeholder="e.g., My Website"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                          disabled={formLoading}
                        />
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowSiteModal(false)}
                          disabled={formLoading}
                          className="bg-white border-gray-200 flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={formLoading}
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                        >
                          {formLoading ? 'Adding...' : 'Add Domain'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DashboardLayout>
      )
    } else {
      // No workspaces yet
      return (
        <DashboardLayout>
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Ready to Track Your Rankings?</h2>
              <p className="text-lg text-gray-700 mb-2">Create your first workspace to get started</p>
              <p className="text-gray-500 mb-8">Organize your SEO projects, track keywords, and monitor your search engine rankings in one powerful dashboard.</p>
              <Button 
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() => setShowWorkspaceModal(true)}
              >
                Create Your First Workspace
              </Button>
              
              {/* Show modal directly here if state is true */}
              {showWorkspaceModal && (
                <div 
                  className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
                  onClick={() => setShowWorkspaceModal(false)}
                >
                  <div 
                    className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Workspace</h2>
                    <p className="text-gray-600 mb-4">A workspace helps you organize your SEO projects.</p>
                    
                    <form onSubmit={(e) => {
                      e.preventDefault()
                      const formData = new FormData(e.target as HTMLFormElement)
                      const name = formData.get('name') as string
                      const description = formData.get('description') as string
                      
                      if (name.trim()) {
                        handleCreateWorkspace(name.trim(), description.trim() || undefined)
                      }
                    }} className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Workspace Name *
                        </label>
                        <input
                          name="name"
                          type="text"
                          placeholder="e.g., My SEO Project"
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                          required
                          disabled={formLoading}
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Description (Optional)
                        </label>
                        <textarea
                          name="description"
                          placeholder="Brief description of this workspace..."
                          rows={3}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                          disabled={formLoading}
                        />
                      </div>
                      
                      <div className="flex gap-3 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setShowWorkspaceModal(false)}
                          disabled={formLoading}
                          className="bg-white border-gray-200 flex-1"
                        >
                          Cancel
                        </Button>
                        <Button
                          type="submit"
                          disabled={formLoading}
                          className="bg-blue-600 hover:bg-blue-700 flex-1"
                        >
                          {formLoading ? 'Creating...' : 'Create Workspace'}
                        </Button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          </div>
        </DashboardLayout>
      )
    }
  }

  return (
    <DashboardLayout
      workspaceSelector={
        <HierarchicalSelector
          userId={user.id}
          selectedWorkspace={selectedWorkspace}
          selectedSite={selectedSite}
          onWorkspaceSelect={handleWorkspaceSelect}
          onSiteSelect={handleSiteSelect}
          onCreateWorkspace={() => setShowWorkspaceModal(true)}
          onCreateSite={() => setShowSiteModal(true)}
        />
      }
    >

      <div className="space-y-6">
        {/* Header with refresh controls */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center overflow-hidden">
              <img 
                src={`https://www.google.com/s2/favicons?domain=${currentSite.domain}&sz=32`}
                alt={`${currentSite.domain} favicon`}
                className="w-8 h-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-white font-bold text-lg">${currentSite.domain.charAt(0).toUpperCase()}</span>`;
                  }
                }}
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{currentSite.domain}</h1>
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
            <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-gray-200/50">
              Tags <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-gray-200/50">
              Locations <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-gray-200/50">
              Positions <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-gray-200/50">
              Volume <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-gray-200/50">
              Traffic <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
            <Button variant="outline" size="sm" className="bg-white/60 backdrop-blur-sm border-gray-200/50">
              KD <ChevronDown className="h-3 w-3 ml-1" />
            </Button>
          </div>
          <div className="flex-1 max-w-md">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search keywords"
                className="w-full pl-10 pr-4 py-2 bg-white/60 backdrop-blur-sm border border-gray-200/50 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500/50"
              />
            </div>
          </div>
        </div>

        {/* Stats Cards with Glass Effects */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-xl p-6 shadow-xl">
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

          <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-xl p-6 shadow-xl">
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

          <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-xl p-6 shadow-xl">
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

          <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-xl p-6 shadow-xl">
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

          <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-xl p-6 shadow-xl">
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
        <div className="bg-white/60 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-xl">
          <div className="p-6">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" className="bg-blue-50/80 backdrop-blur-sm text-blue-600">Top 100</Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-white/50">Top 50</Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-white/50">Top 20</Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-white/50">Top 10</Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-white/50">Top 5</Button>
              <Button variant="ghost" size="sm" className="text-gray-600 hover:bg-white/50">Top 3</Button>
              <div className="flex-1"></div>
              <Button variant="outline" size="sm" className="bg-white/50 backdrop-blur-sm border-white/20">
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

      {/* Modals */}
      <WorkspaceModal
        isOpen={showWorkspaceModal}
        onClose={() => setShowWorkspaceModal(false)}
        onSubmit={handleCreateWorkspace}
        loading={formLoading}
      />
      <SiteModal
        isOpen={showSiteModal}
        onClose={() => setShowSiteModal(false)}
        onSubmit={handleAddSite}
        loading={formLoading}
      />
    </DashboardLayout>
  )
}