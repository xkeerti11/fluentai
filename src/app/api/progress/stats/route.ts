import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const userId = session.user.id

    // Parallel queries
    const [sessionsResult, wordsResult, streaksResult] = await Promise.all([
      supabase
        .from('speaking_sessions')
        .select('duration_seconds, grammar_score, created_at')
        .eq('user_id', userId),
      supabase
        .from('learned_words')
        .select('id')
        .eq('user_id', userId),
      supabase
        .from('daily_streaks')
        .select('date, minutes_practiced')
        .eq('user_id', userId)
        .order('date', { ascending: false })
        .limit(60),
    ])

    const sessions = sessionsResult.data ?? []
    const totalMinutes = Math.floor(
      sessions.reduce((sum: number, s: { duration_seconds: number }) => sum + (s.duration_seconds ?? 0), 0) / 60
    )
    const totalSessions = sessions.length
    const totalWords = wordsResult.data?.length ?? 0

    const grammarScores = sessions
      .filter((s: { grammar_score: number | null }) => s.grammar_score != null)
      .map((s: { grammar_score: number | null }) => s.grammar_score!)
    const avgGrammarScore =
      grammarScores.length > 0
        ? Math.round(grammarScores.reduce((a: number, b: number) => a + b, 0) / grammarScores.length)
        : 0

    // Streak calculation — use UTC dates to avoid timezone off-by-one
    const streaks = streaksResult.data ?? []
    let currentStreak = 0
    if (streaks.length > 0) {
      const sortedDates = [...streaks]
        .filter(s => s.minutes_practiced >= 5)
        .map(s => s.date)
        .sort()
        .reverse()

      for (let i = 0; i < sortedDates.length; i++) {
        const expectedDate = new Date()
        expectedDate.setUTCHours(0, 0, 0, 0)
        expectedDate.setUTCDate(expectedDate.getUTCDate() - i)
        const expected = expectedDate.toISOString().split('T')[0]

        if (sortedDates[i] === expected) {
          currentStreak++
        } else {
          break
        }
      }
    }

    // Weekly data (last 14 days for chart)
    const weeklyData = Array.from({ length: 14 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - (13 - i))
      const dateStr = d.toISOString().split('T')[0]
      const streak = streaks.find((s: { date: string }) => s.date === dateStr)
      return { date: dateStr, minutes: streak?.minutes_practiced ?? 0 }
    })

    return NextResponse.json({
      success: true,
      data: {
        totalMinutes,
        totalSessions,
        totalWords,
        currentStreak,
        avgGrammarScore,
        weeklyData,
        streakDates: streaks.map((s: { date: string }) => s.date),
        dailyStreaks: streaks.map((s: { date: string; minutes_practiced: number }) => ({ date: s.date, minutes: s.minutes_practiced })),
      },
    })
  } catch (err) {
    console.error('Stats API error:', err)
    return NextResponse.json({ error: 'Stats load nahi hue.' }, { status: 500 })
  }
}

