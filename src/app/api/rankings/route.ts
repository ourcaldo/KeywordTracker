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
    .from('keyword_positions')
    .select(`
      *,
      keyword:keywords(
        *,
        site:sites(*)
      )
    `)
    .order('tracked_date', { ascending: false })

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

  const { keyword_id, position, search_engine = 'google', tracked_date } = await request.json()

  const { data: ranking, error } = await supabase
    .from('keyword_positions')
    .upsert([
      {
        keyword_id,
        position,
        search_engine,
        tracked_date: tracked_date || new Date().toISOString().split('T')[0],
      },
    ], {
      onConflict: 'keyword_id,search_engine,tracked_date'
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(ranking)
}