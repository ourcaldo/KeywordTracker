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

interface SiteFormProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (domain: string, name: string, location: string) => void
  loading?: boolean
  workspaceName?: string
}

export function SiteForm({ isOpen, onClose, onSubmit, loading = false, workspaceName }: SiteFormProps) {
  const [domain, setDomain] = useState('')
  const [name, setName] = useState('')
  const [location, setLocation] = useState('US')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (domain.trim()) {
      const siteName = name.trim() || domain.trim()
      onSubmit(domain.trim(), siteName, location)
      setDomain('')
      setName('')
      setLocation('US')
    }
  }

  const handleDomainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setDomain(value)
    // Auto-fill name if empty
    if (!name) {
      setName(value)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-sm border border-gray-200/50">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-gray-900">
            Add Domain to Workspace
          </DialogTitle>
          <DialogDescription className="text-gray-600">
            {workspaceName && `Adding domain to "${workspaceName}" workspace. `}
            Enter the domain you want to track keywords for.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="domain" className="block text-sm font-medium text-gray-700 mb-2">
              Domain *
            </label>
            <input
              id="domain"
              type="text"
              value={domain}
              onChange={handleDomainChange}
              placeholder="e.g., tesla.com"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              required
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">Don't include http:// or https://</p>
          </div>
          
          <div>
            <label htmlFor="site-name" className="block text-sm font-medium text-gray-700 mb-2">
              Site Name
            </label>
            <input
              id="site-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Display name for this site"
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              disabled={loading}
            />
          </div>
          
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
              Default Location
            </label>
            <select
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              disabled={loading}
            >
              <option value="US">United States</option>
              <option value="UK">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="AU">Australia</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="ES">Spain</option>
              <option value="IT">Italy</option>
              <option value="JP">Japan</option>
              <option value="BR">Brazil</option>
            </select>
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
              disabled={!domain.trim() || loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? 'Adding...' : 'Add Domain'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}