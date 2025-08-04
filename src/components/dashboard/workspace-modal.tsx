'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Building2, Loader2 } from 'lucide-react'

interface WorkspaceModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (name: string, description?: string) => Promise<void>
  loading?: boolean
}

export function WorkspaceModal({ isOpen, onClose, onSubmit, loading = false }: WorkspaceModalProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [errors, setErrors] = useState<{name?: string}>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})
    
    // Validate
    if (!name.trim()) {
      setErrors({ name: 'Workspace name is required' })
      return
    }

    try {
      await onSubmit(name.trim(), description.trim() || undefined)
      // Reset form on success
      setName('')
      setDescription('')
    } catch (error) {
      console.error('Error creating workspace:', error)
    }
  }

  const handleClose = () => {
    if (!loading) {
      setName('')
      setDescription('')
      setErrors({})
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm" 
        onClick={handleClose}
      />
      
      {/* Modal */}
      <div className="relative bg-white/95 backdrop-blur-sm rounded-xl shadow-xl border border-gray-200/50 w-full max-w-md mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Building2 className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Create New Workspace</h2>
              <p className="text-sm text-gray-500">Organize your SEO projects</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            disabled={loading}
            className="hover:bg-gray-50/80"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <Label htmlFor="workspace-name" className="text-sm font-medium text-gray-700">
              Workspace Name *
            </Label>
            <Input
              id="workspace-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., My SEO Campaign"
              className="mt-1 bg-white/80 backdrop-blur-sm border-gray-200/50"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
          </div>

          <div>
            <Label htmlFor="workspace-description" className="text-sm font-medium text-gray-700">
              Description (Optional)
            </Label>
            <Input
              id="workspace-description"
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief description of this workspace"
              className="mt-1 bg-white/80 backdrop-blur-sm border-gray-200/50"
              disabled={loading}
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="ghost"
              onClick={handleClose}
              disabled={loading}
              className="hover:bg-gray-50/80"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading || !name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                'Create Workspace'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}