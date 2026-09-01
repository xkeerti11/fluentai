import { NextRequest, NextResponse } from 'next/server'
import { VERBS, getVerbsByCategory, getVerbsByLevel, getDailyVerbs, VerbEntry } from '@/data/verb-curriculum'
import { createServerSupabase } from '@/lib/supabase/server'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const level = searchParams.get('level') || 'A1'
    const category = searchParams.get('category')
    const mode = searchParams.get('mode') || 'all' // 'all' | 'daily'
    const count = parseInt(searchParams.get('count') || '10', 10)

    if (mode === 'daily') {
      let seenWords = new Set<string>()
      try {
        const supabase = await createServerSupabase()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: learned } = await supabase
            .from('learned_words')
            .select('vocabulary(word)')
            .eq('user_id', user.id)
          
          if (learned) {
            learned.forEach((item: any) => {
              if (item.vocabulary?.word) {
                seenWords.add(item.vocabulary.word.toLowerCase())
              }
            })
          }
        }
      } catch (err) {
        // Fallback gracefully without auth error
      }

      const daily = getDailyVerbs(seenWords, level, count)
      return NextResponse.json({ success: true, data: daily, total: daily.length })
    }

    let filtered = [...VERBS]

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
