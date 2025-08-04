import { createClient } from '@/lib/supabase/client'
import { KeywordWithRanking, Site, Workspace, UserProfile } from '@/lib/database'

export class DashboardService {
  static async getUserProfile(userId: string): Promise<UserProfile | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('Error fetching user profile:', error)
      return null
    }

    return data
  }

  static async getUserWorkspaces(userId: string): Promise<Workspace[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('workspaces')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching workspaces:', error)
      return []
    }

    return data || []
  }

  static async getWorkspaceSites(workspaceId: string, userId: string): Promise<Site[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('sites')
      .select('*')
      .eq('workspace_id', workspaceId)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching sites:', error)
      return []
    }

    return data || []
  }

  static async getSiteKeywords(siteId: string, userId: string): Promise<KeywordWithRanking[]> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('keywords_with_latest_rankings')
      .select('*')
      .eq('site_id', siteId)
      .eq('user_id', userId)
      .order('latest_recorded_at', { ascending: false })

    if (error) {
      console.error('Error fetching keywords:', error)
      return []
    }

    return data || []
  }

  static async getSiteStats(siteId: string, userId: string) {
    // Get keywords with rankings for this site
    const keywords = await this.getSiteKeywords(siteId, userId)
    
    if (keywords.length === 0) {
      return {
        visibility: 0,
        traffic: 0,
        averagePosition: 0,
        serpFeatures: 0,
        rankDistribution: { '1-3': 0, '4-10': 0, '11-20': 0, '20-40': 0 }
      }
    }

    // Calculate visibility (percentage of keywords in top 10)
    const top10Keywords = keywords.filter(k => k.latest_position && k.latest_position <= 10)
    const visibility = Math.round((top10Keywords.length / keywords.length) * 100)

    // Calculate estimated traffic (simplified formula)
    const traffic = keywords.reduce((total, keyword) => {
      if (keyword.latest_position && keyword.volume) {
        // Simplified CTR calculation based on position
        const ctr = keyword.latest_position <= 3 ? 0.3 : 
                   keyword.latest_position <= 10 ? 0.1 : 0.02
        return total + (keyword.volume * ctr)
      }
      return total
    }, 0)

    // Calculate average position
    const rankedKeywords = keywords.filter(k => k.latest_position)
    const averagePosition = rankedKeywords.length > 0 
      ? Math.round(rankedKeywords.reduce((sum, k) => sum + (k.latest_position || 0), 0) / rankedKeywords.length * 100) / 100
      : 0

    // Count SERP features (simplified - count keywords with target URLs)
    const serpFeatures = keywords.filter(k => k.target_url).length

    // Calculate rank distribution
    const rankDistribution = {
      '1-3': keywords.filter(k => k.latest_position && k.latest_position <= 3).length,
      '4-10': keywords.filter(k => k.latest_position && k.latest_position >= 4 && k.latest_position <= 10).length,
      '11-20': keywords.filter(k => k.latest_position && k.latest_position >= 11 && k.latest_position <= 20).length,
      '20-40': keywords.filter(k => k.latest_position && k.latest_position >= 21 && k.latest_position <= 40).length
    }

    return {
      visibility,
      traffic: Math.round(traffic),
      averagePosition,
      serpFeatures,
      rankDistribution
    }
  }

  static async createWorkspace(userId: string, name: string, description?: string): Promise<Workspace | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('workspaces')
      .insert({
        user_id: userId,
        name,
        description
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating workspace:', error)
      return null
    }

    return data
  }

  static async createSite(workspaceId: string, userId: string, domain: string, name: string): Promise<Site | null> {
    const supabase = createClient()
    const { data, error } = await supabase
      .from('sites')
      .insert({
        workspace_id: workspaceId,
        user_id: userId,
        domain,
        name
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating site:', error)
      return null
    }

    return data
  }
}