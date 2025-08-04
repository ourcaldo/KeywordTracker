'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X, Globe, Loader2 } from 'lucide-react'

interface SiteModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (domain: string, name: string) => Promise<void>
  loading?: boolean
}

export function SiteModal({ isOpen, onClose, onSubmit, loading = false }: SiteModalProps) {
  const [domain, setDomain] = useState('')
  const [name, setName] = useState('')
  const [errors, setErrors] = useState<{domain?: string, name?: string}>({})

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Reset errors
    setErrors({})
    
    // Validate
    const newErrors: {domain?: string, name?: string} = {}
    
    if (!domain.trim()) {
      newErrors.domain = 'Domain is required'
    } else if (!isValidDomain(domain.trim())) {
      newErrors.domain = 'Please enter a valid domain (e.g., example.com)'
    }
    
    if (!name.trim()) {
      newErrors.name = 'Site name is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      await onSubmit(domain.trim(), name.trim())
      // Reset form on success
      setDomain('')
      setName('')
    } catch (error) {
      console.error('Error creating site:', error)
    }
  }

  const isValidDomain = (domain: string): boolean => {
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/
    return domainRegex.test(domain.replace(/^https?:\/\//, '').replace(/\/.*$/, ''))
  }

  const handleDomainChange = (value: string) => {
    setDomain(value)
    // Auto-generate name from domain if name is empty
    if (!name && value) {
      const cleanDomain = value.replace(/^https?:\/\//, '').replace(/\/.*$/, '')
      const domainName = cleanDomain.split('.')[0]
      setName(domainName.charAt(0).toUpperCase() + domainName.slice(1))
    }
  }

  const handleClose = () => {
    if (!loading) {
      setDomain('')
      setName('')
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
            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-600 rounded-lg flex items-center justify-center">
              <Globe className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Add New Domain</h2>
              <p className="text-sm text-gray-500">Track keywords for your website</p>
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
            <Label htmlFor="site-domain" className="text-sm font-medium text-gray-700">
              Domain *
            </Label>
            <Input
              id="site-domain"
              type="text"
              value={domain}
              onChange={(e) => handleDomainChange(e.target.value)}
              placeholder="example.com"
              className="mt-1 bg-white/80 backdrop-blur-sm border-gray-200/50"
              disabled={loading}
            />
            {errors.domain && (
              <p className="mt-1 text-sm text-red-600">{errors.domain}</p>
            )}
          </div>

          <div>
            <Label htmlFor="site-name" className="text-sm font-medium text-gray-700">
              Site Name *
            </Label>
            <Input
              id="site-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="My Website"
              className="mt-1 bg-white/80 backdrop-blur-sm border-gray-200/50"
              disabled={loading}
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name}</p>
            )}
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
              disabled={loading || !domain.trim() || !name.trim()}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Adding...
                </>
              ) : (
                'Add Domain'
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}