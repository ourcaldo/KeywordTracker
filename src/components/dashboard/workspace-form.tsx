'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface WorkspaceFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, description?: string) => void
  loading?: boolean
}

export function WorkspaceForm({ isOpen, onClose, onSubmit, loading = false }: WorkspaceFormProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) {
      onSubmit(name.trim(), description.trim() || undefined)
      setName('')
      setDescription('')
    }
  }

  console.log('WorkspaceForm render:', { isOpen, loading })
  
  // Test: Always show a simple div first to verify rendering
  if (isOpen) {
    console.log('Dialog should be visible')
    return (
      <div 
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      >
        <div 
          className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full mx-4 border border-gray-200"
          onClick={(e) => e.stopPropagation()}
        >
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Create New Workspace</h2>
          <p className="text-gray-600 mb-4">A workspace helps you organize your SEO projects. You can add multiple domains to each workspace.</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700 mb-2">
                Workspace Name *
              </label>
              <input
                id="workspace-name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g., My SEO Project"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                required
                disabled={loading}
              />
            </div>
            
            <div>
              <label htmlFor="workspace-description" className="block text-sm font-medium text-gray-700 mb-2">
                Description (Optional)
              </label>
              <textarea
                id="workspace-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Brief description of this workspace..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                disabled={loading}
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
                className="bg-white border-gray-200 flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!name.trim() || loading}
                className="bg-blue-600 hover:bg-blue-700 flex-1"
              >
                {loading ? 'Creating...' : 'Create Workspace'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    )
  }
  
  return null
  
  // Original Radix Dialog (commented out for testing)
  /*
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 shadow-lg" style={{ zIndex: 9999 }}>
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Create New Workspace
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            A workspace helps you organize your SEO projects. You can add multiple domains to each workspace.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="workspace-name" className="block text-sm font-medium text-gray-700 mb-2">
              Workspace Name *
            </label>
            <input
              id="workspace-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My SEO Project"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="workspace-description" className="block text-sm font-medium text-gray-700 mb-2">
              Description (Optional)
            </label>
            <textarea
              id="workspace-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this workspace..."
              rows={3}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
              disabled={loading}
            />
          </div>
          
          <DialogFooter className="gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
              className="bg-white border-gray-200"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!name.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Creating...' : 'Create Workspace'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
  */
}