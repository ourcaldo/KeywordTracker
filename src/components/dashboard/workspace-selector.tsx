'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { 
  ChevronDown, 
  Plus, 
  Search,
  Building2,
  Globe,
  Star,
  CheckCircle
} from 'lucide-react'
import { DashboardService } from '@/services/dashboard.service'
import { Workspace, Site } from '@/lib/database'

interface WorkspaceSelectorProps {
  userId: string
  onWorkspaceSelect: (workspace: Workspace) => void
  onSiteSelect: (site: Site) => void
  onCreateWorkspace: () => void
  onCreateSite: () => void
  selectedWorkspace?: Workspace
  selectedSite?: Site
}

export function WorkspaceSelector({
  userId,
  onWorkspaceSelect,
  onSiteSelect,
  onCreateWorkspace,
  onCreateSite,
  selectedWorkspace,
  selectedSite
}: WorkspaceSelectorProps) {
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [sites, setSites] = useState<Site[]>([])
  const [showWorkspaceDropdown, setShowWorkspaceDropdown] = useState(false)
  const [showSiteDropdown, setShowSiteDropdown] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadWorkspaces()
  }, [userId])

  useEffect(() => {
    if (selectedWorkspace) {
      loadSites(selectedWorkspace.id)
    }
  }, [selectedWorkspace])

  const loadWorkspaces = async () => {
    try {
      const userWorkspaces = await DashboardService.getUserWorkspaces(userId)
      setWorkspaces(userWorkspaces)
      setLoading(false)
    } catch (error) {
      console.error('Error loading workspaces:', error)
      setLoading(false)
    }
  }

  const loadSites = async (workspaceId: string) => {
    try {
      const workspaceSites = await DashboardService.getWorkspaceSites(workspaceId, userId)
      setSites(workspaceSites)
    } catch (error) {
      console.error('Error loading sites:', error)
    }
  }

  const filteredWorkspaces = workspaces.filter(workspace =>
    workspace.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredSites = sites.filter(site =>
    site.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    site.domain.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (loading) {
    return (
      <div className="flex items-center gap-4">
        <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse"></div>
        <div className="h-10 w-48 bg-gray-100 rounded-lg animate-pulse"></div>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      {/* Workspace Selector */}
      <div className="relative">
        <Button
          variant="outline"
          className="h-10 px-4 bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50/80 justify-between min-w-[200px]"
          onClick={() => {
            setShowWorkspaceDropdown(!showWorkspaceDropdown)
            setShowSiteDropdown(false)
            setSearchTerm('')
          }}
        >
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-gray-500" />
            <span className="truncate">
              {selectedWorkspace ? selectedWorkspace.name : 'Select Workspace'}
            </span>
          </div>
          <ChevronDown className="h-4 w-4 text-gray-500" />
        </Button>

        {showWorkspaceDropdown && (
          <div className="absolute top-12 left-0 w-80 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-lg shadow-lg z-50">
            {/* Header */}
            <div className="p-4 border-b border-gray-100/50">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">All Workspaces</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onCreateWorkspace}
                  className="text-blue-600 hover:bg-blue-50/80"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  New
                </Button>
              </div>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search workspaces..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-200/50 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Workspace List */}
            <div className="max-h-64 overflow-y-auto">
              {filteredWorkspaces.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  {searchTerm ? 'No workspaces found' : 'No workspaces yet'}
                </div>
              ) : (
                <div className="p-2">
                  {filteredWorkspaces.map((workspace) => (
                    <button
                      key={workspace.id}
                      className="w-full p-3 text-left hover:bg-gray-50/80 rounded-lg transition-colors flex items-center justify-between group"
                      onClick={() => {
                        onWorkspaceSelect(workspace)
                        setShowWorkspaceDropdown(false)
                        setSearchTerm('')
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {workspace.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">{workspace.name}</div>
                          {workspace.description && (
                            <div className="text-sm text-gray-500 truncate">{workspace.description}</div>
                          )}
                        </div>
                      </div>
                      {selectedWorkspace?.id === workspace.id && (
                        <CheckCircle className="h-5 w-5 text-blue-600" />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Site Selector */}
      {selectedWorkspace && (
        <div className="relative">
          <Button
            variant="outline"
            className="h-10 px-4 bg-white/80 backdrop-blur-sm border-gray-200/50 hover:bg-gray-50/80 justify-between min-w-[200px]"
            onClick={() => {
              setShowSiteDropdown(!showSiteDropdown)
              setShowWorkspaceDropdown(false)
              setSearchTerm('')
            }}
          >
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="truncate">
                {selectedSite ? selectedSite.name : 'Select Domain'}
              </span>
            </div>
            <ChevronDown className="h-4 w-4 text-gray-500" />
          </Button>

          {showSiteDropdown && (
            <div className="absolute top-12 left-0 w-80 bg-white/95 backdrop-blur-sm border border-gray-200/50 rounded-lg shadow-lg z-50">
              {/* Header */}
              <div className="p-4 border-b border-gray-100/50">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-gray-900">Properties & Apps</h3>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCreateSite}
                    className="text-blue-600 hover:bg-blue-50/80"
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    New
                  </Button>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search domains..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200/50 rounded-lg bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {/* Sites List */}
              <div className="max-h-64 overflow-y-auto">
                {filteredSites.length === 0 ? (
                  <div className="p-4 text-center text-gray-500">
                    {searchTerm ? 'No domains found' : 'No domains yet'}
                  </div>
                ) : (
                  <div className="p-2">
                    {filteredSites.map((site) => (
                      <button
                        key={site.id}
                        className="w-full p-3 text-left hover:bg-gray-50/80 rounded-lg transition-colors flex items-center justify-between group"
                        onClick={() => {
                          onSiteSelect(site)
                          setShowSiteDropdown(false)
                          setSearchTerm('')
                        }}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
                            <Globe className="h-4 w-4 text-white" />
                          </div>
                          <div>
                            <div className="font-medium text-gray-900">{site.name}</div>
                            <div className="text-sm text-gray-500">{site.domain}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {selectedSite?.id === site.id && (
                            <CheckCircle className="h-5 w-5 text-blue-600" />
                          )}
                          <Star className="h-4 w-4 text-gray-400 group-hover:text-yellow-500" />
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Click outside to close dropdowns */}
      {(showWorkspaceDropdown || showSiteDropdown) && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowWorkspaceDropdown(false)
            setShowSiteDropdown(false)
            setSearchTerm('')
          }}
        />
      )}
    </div>
  )
}