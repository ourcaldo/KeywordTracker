import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const positionRange = searchParams.get('range') // '100', '50', '20', '10', '5', '3'
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let query = supabase
    .from('tb_keyword_rankings')
    .select(`
      *,
      keyword:tb_keywords(
        *,
        site:tb_sites(*)
      )
    `)
    .order('recorded_at', { ascending: false })

  // Filter by position range if specified
  if (positionRange) {
    const maxPosition = parseInt(positionRange)
    query = query.lte('position', maxPosition).gte('position', 1)
  }

  const { data: rankings, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(rankings)
}

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { keyword_id, position, device = 'desktop', location = 'US', recorded_at } = await request.json()

  const { data: ranking, error } = await supabase
    .from('tb_keyword_rankings')
    .upsert([
      {
        keyword_id,
        position,
        device,
        location,
        recorded_at: recorded_at || new Date().toISOString(),
      },
    ], {
      onConflict: 'keyword_id,device,location,recorded_at'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(ranking)
}