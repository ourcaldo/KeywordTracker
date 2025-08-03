import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const siteId = searchParams.get('site_id')
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let query = supabase
    .from('keywords')
    .select(`
      *,
      site:sites(*),
      positions:keyword_positions(*)
    `)
    .order('created_at', { ascending: false })

  if (siteId) {
    query = query.eq('site_id', siteId)
  }

  const { data: keywords, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(keywords)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { site_id, keyword, location = 'United States', device = 'desktop' } = await request.json()

  const { data: keywordData, error } = await supabase
    .from('keywords')
    .insert([
      {
        site_id,
        keyword,
        location,
        device,
      },
    ])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(keywordData)
}