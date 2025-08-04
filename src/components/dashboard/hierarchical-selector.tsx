'use client'

import { useState, useEffect } from 'react'
import { ChevronDown, Plus, Building2, Globe } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { DashboardService } from '@/services/dashboard.service'
import { Workspace, Site } from '@/lib/database'

interface HierarchicalSelectorProps {
  userId: string
  selectedWorkspace?: Workspace | null
  selectedSite?: Site | null
  onWorkspaceSelect: (workspace: Workspace) => void
  onSiteSelect: (site: Site) => void
  onCreateWorkspace: () => void
  onCreateSite: () => void
}

export function HierarchicalSelector({
  userId,
  selectedWorkspace,
  selectedSite,
  onWorkspaceSelect,
  onSiteSelect,
  onCreateWorkspace,
  onCreateSite
}: HierarchicalSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [workspaces, setWorkspaces] = useState<Workspace[]>([])
  const [sites, setSites] = useState<Site[]>([])
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
      setLoading(true)
      const workspaceData = await DashboardService.getUserWorkspaces(userId)
      setWorkspaces(workspaceData)
    } catch (error) {
      console.error('Error loading workspaces:', error)
    } finally {
      setLoading(false)
    }
  }

  const loadSites = async (workspaceId: string) => {
    try {
      const siteData = await DashboardService.getWorkspaceSites(workspaceId, userId)
      setSites(siteData)
    } catch (error) {
      console.error('Error loading sites:', error)
    }
  }

  const handleWorkspaceClick = (workspace: Workspace) => {
    onWorkspaceSelect(workspace)
    // Don't close dropdown when selecting workspace - user needs to select site
  }

  const handleSiteClick = (site: Site) => {
    onSiteSelect(site)
    setIsOpen(false)
  }

  const displayText = () => {
    if (selectedSite && selectedWorkspace) {
      return (
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center overflow-hidden">
            <img 
              src={`https://www.google.com/s2/favicons?domain=${selectedSite.domain}&sz=16`}
              alt={`${selectedSite.domain} favicon`}
              className="w-4 h-4"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `<span class="text-white font-bold text-xs">${selectedSite.domain.charAt(0).toUpperCase()}</span>`;
                }
              }}
            />
          </div>
          <div className="flex flex-col items-start">
            <span className="text-sm font-medium text-gray-900">{selectedSite.domain}</span>
            <span className="text-xs text-gray-500">{selectedWorkspace.name}</span>
          </div>
        </div>
      )
    }
    
    if (selectedWorkspace) {
      return (
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-900">{selectedWorkspace.name}</span>
        </div>
      )
    }
    
    return (
      <div className="flex items-center gap-2">
        <Building2 className="h-4 w-4 text-gray-500" />
        <span className="text-sm text-gray-500">Select Account</span>
      </div>
    )
  }

  if (loading) {
    return (
      <Button variant="ghost" size="sm" disabled className="bg-white/60 backdrop-blur-sm border border-gray-200/50">
        <div className="flex items-center gap-2">
          <Building2 className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-400">Loading...</span>
        </div>
      </Button>
    )
  }

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="bg-white/60 backdrop-blur-sm border border-gray-200/50 hover:bg-white/80 h-12 px-3"
      >
        {displayText()}
        <ChevronDown className="h-4 w-4 ml-2 text-gray-400" />
      </Button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-white/95 backdrop-blur-xl border border-gray-200/50 rounded-xl shadow-xl z-50 max-h-96 overflow-hidden">
          <div className="p-4">
            <h3 className="text-sm font-medium text-gray-900 mb-3">Select Account & Property</h3>
            
            {/* Workspaces */}
            <div className="space-y-1">
              {workspaces.map((workspace) => (
                <div key={workspace.id} className="space-y-1">
                  <button
                    onClick={() => handleWorkspaceClick(workspace)}
                    className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-50/80 transition-colors ${
                      selectedWorkspace?.id === workspace.id ? 'bg-blue-50/80 text-blue-600' : 'text-gray-700'
                    }`}
                  >
                    <Building2 className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium">{workspace.name}</span>
                  </button>
                  
                  {/* Sites under selected workspace */}
                  {selectedWorkspace?.id === workspace.id && sites.length > 0 && (
                    <div className="ml-7 space-y-1 border-l border-gray-200/50 pl-3">
                      {sites.map((site) => (
                        <button
                          key={site.id}
                          onClick={() => handleSiteClick(site)}
                          className={`w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-50/80 transition-colors ${
                            selectedSite?.id === site.id ? 'bg-blue-50/80 text-blue-600' : 'text-gray-600'
                          }`}
                        >
                          <div className="w-4 h-4 bg-gradient-to-br from-blue-500 to-purple-600 rounded flex items-center justify-center overflow-hidden flex-shrink-0">
                            <img 
                              src={`https://www.google.com/s2/favicons?domain=${site.domain}&sz=16`}
                              alt={`${site.domain} favicon`}
                              className="w-3 h-3"
                              onError={(e) => {
                                const target = e.target as HTMLImageElement;
                                target.style.display = 'none';
                                const parent = target.parentElement;
                                if (parent) {
                                  parent.innerHTML = `<span class="text-white font-bold text-xs">${site.domain.charAt(0).toUpperCase()}</span>`;
                                }
                              }}
                            />
                          </div>
                          <span className="text-sm">{site.domain}</span>
                        </button>
                      ))}
                      
                      {/* Add Site Button */}
                      <button
                        onClick={() => {
                          onCreateSite()
                          setIsOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-50/80 transition-colors text-blue-600"
                      >
                        <Plus className="h-4 w-4 flex-shrink-0" />
                        <span className="text-sm">Add Property</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
              
              {/* Add Workspace Button */}
              <button
                onClick={() => {
                  onCreateWorkspace()
                  setIsOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-left rounded-lg hover:bg-gray-50/80 transition-colors text-blue-600"
              >
                <Plus className="h-4 w-4 flex-shrink-0" />
                <span className="text-sm">Create Account</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}