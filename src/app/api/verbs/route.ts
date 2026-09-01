import { NextRequest, NextResponse } from 'next/server'
import { ALL_500_VERBS, getVerbsByDay, getVerbsByCategory, getVerbsByLevel, VerbEntry } from '@/data/verb-curriculum'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const day = searchParams.get('day')
    const level = searchParams.get('level')
    const category = searchParams.get('category')

    if (day) {
      const dayNum = parseInt(day, 10)
      const dayVerbs = getVerbsByDay(dayNum)
      return NextResponse.json({ success: true, data: dayVerbs, total: dayVerbs.length })
    }

    let filtered = [...ALL_500_VERBS]

    if (category && category !== 'all') {
      filtered = filtered.filter(v => v.category === category)
    }

    if (level && level !== 'all' && level !== 'All') {
      filtered = filtered.filter(v => v.level === level)
    }

    return NextResponse.json({
      success: true,
      data: filtered,
      total: filtered.length
    })
  } catch (error: any) {
    console.error('Verbs API Error:', error)
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch verbs' },
      { status: 500 }
    )
  }
}
