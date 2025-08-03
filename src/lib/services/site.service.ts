/**
 * Site Service
 * 
 * Business logic for site management operations.
 * Handles site CRUD operations within workspaces.
 */

import { apiClient } from '@/lib/api/client'
import type { Site } from '@/types/database'

export interface CreateSiteData {
  workspace_id: string
  domain: string
  name: string
  location: string
}

export interface UpdateSiteData {
  domain?: string
  name?: string
  location?: string
}

export const siteService = {
  /**
   * Get all sites for a workspace
   */
  async getSites(workspaceId: string): Promise<Site[]> {
    return apiClient.get<Site[]>(`/sites?workspace_id=${workspaceId}`)
  },

  /**
   * Get a specific site by ID
   */
  async getSite(id: string): Promise<Site> {
    return apiClient.get<Site>(`/sites/${id}`)
  },

  /**
   * Create a new site
   */
  async createSite(data: CreateSiteData): Promise<Site> {
    return apiClient.post<Site>('/sites', data)
  },

  /**
   * Update an existing site
   */
  async updateSite(id: string, data: UpdateSiteData): Promise<Site> {
    return apiClient.put<Site>(`/sites/${id}`, data)
  },

  /**
   * Delete a site
   */
  async deleteSite(id: string): Promise<void> {
    return apiClient.delete(`/sites/${id}`)
  }
}