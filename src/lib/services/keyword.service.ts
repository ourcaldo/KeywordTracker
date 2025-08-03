/**
 * Keyword Service
 * 
 * Business logic for keyword management and ranking operations.
 * Handles keyword CRUD operations and ranking data retrieval.
 */

import { apiClient } from '@/lib/api/client'
import type { Keyword, KeywordRanking, DeviceType } from '@/types/database'

export interface CreateKeywordData {
  site_id: string
  keyword: string
  target_url?: string
  volume?: number
}

export interface UpdateKeywordData {
  keyword?: string
  target_url?: string
  volume?: number
}

export interface GetRankingsParams {
  keyword_id?: string
  site_id?: string
  device?: DeviceType
  start_date?: string
  end_date?: string
  limit?: number
}

export interface RankingWithKeyword extends KeywordRanking {
  keyword: {
    keyword: string
    target_url: string | null
    volume: number | null
  }
}

export const keywordService = {
  /**
   * Get all keywords for a site
   */
  async getKeywords(siteId: string): Promise<Keyword[]> {
    return apiClient.get<Keyword[]>(`/keywords?site_id=${siteId}`)
  },

  /**
   * Get a specific keyword by ID
   */
  async getKeyword(id: string): Promise<Keyword> {
    return apiClient.get<Keyword>(`/keywords/${id}`)
  },

  /**
   * Create a new keyword
   */
  async createKeyword(data: CreateKeywordData): Promise<Keyword> {
    return apiClient.post<Keyword>('/keywords', data)
  },

  /**
   * Update an existing keyword
   */
  async updateKeyword(id: string, data: UpdateKeywordData): Promise<Keyword> {
    return apiClient.put<Keyword>(`/keywords/${id}`, data)
  },

  /**
   * Delete a keyword
   */
  async deleteKeyword(id: string): Promise<void> {
    return apiClient.delete(`/keywords/${id}`)
  },

  /**
   * Get keyword rankings with filters
   */
  async getRankings(params: GetRankingsParams): Promise<RankingWithKeyword[]> {
    const searchParams = new URLSearchParams()
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    return apiClient.get<RankingWithKeyword[]>(`/rankings?${searchParams.toString()}`)
  },

  /**
   * Get latest rankings for keywords
   */
  async getLatestRankings(siteId: string, device?: DeviceType): Promise<RankingWithKeyword[]> {
    const params = new URLSearchParams({ site_id: siteId })
    if (device) params.append('device', device)
    params.append('latest', 'true')

    return apiClient.get<RankingWithKeyword[]>(`/rankings?${params.toString()}`)
  }
}