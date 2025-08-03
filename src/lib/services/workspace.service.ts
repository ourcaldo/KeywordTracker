/**
 * Workspace Service
 * 
 * Business logic for workspace management operations.
 * Handles workspace CRUD operations and user associations.
 */

import { apiClient } from '@/lib/api/client'
import type { Workspace } from '@/types/database'

export interface CreateWorkspaceData {
  name: string
  description?: string
}

export interface UpdateWorkspaceData {
  name?: string
  description?: string
}

export const workspaceService = {
  /**
   * Get all workspaces for the current user
   */
  async getWorkspaces(): Promise<Workspace[]> {
    return apiClient.get<Workspace[]>('/workspaces')
  },

  /**
   * Get a specific workspace by ID
   */
  async getWorkspace(id: string): Promise<Workspace> {
    return apiClient.get<Workspace>(`/workspaces/${id}`)
  },

  /**
   * Create a new workspace
   */
  async createWorkspace(data: CreateWorkspaceData): Promise<Workspace> {
    return apiClient.post<Workspace>('/workspaces', data)
  },

  /**
   * Update an existing workspace
   */
  async updateWorkspace(id: string, data: UpdateWorkspaceData): Promise<Workspace> {
    return apiClient.put<Workspace>(`/workspaces/${id}`, data)
  },

  /**
   * Delete a workspace
   */
  async deleteWorkspace(id: string): Promise<void> {
    return apiClient.delete(`/workspaces/${id}`)
  }
}