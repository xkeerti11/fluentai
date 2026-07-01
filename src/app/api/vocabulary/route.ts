import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { VOCABULARY_WORDS } from '@/data/vocabulary-curriculum'
import type { Level } from '@/types/database'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { searchParams } = new URL(req.url)
    const level = (searchParams.get('level') ?? 'A1') as Level

    // 1. Fetch user's learned words
    const { data: learnedList } = await supabase
      .from('learned_words')
      .select('word_id, mastered, vocabulary(word)')
      .eq('user_id', session.user.id)

    // Collect strings of already seen/learned words
    const seenWords = new Set<string>()
    if (learnedList) {
      learnedList.forEach((lw: any) => {
        if (lw.vocabulary?.word) {
          seenWords.add(lw.vocabulary.word.toLowerCase())
        }
      })
    }

    // 2. Filter static curriculum for level-matched words
    const levelMatched = VOCABULARY_WORDS.filter(v => v.level === level)
    
    // 3. Filter out seen words
    let dailyWords = levelMatched.filter(v => !seenWords.has(v.word.toLowerCase()))

    // Fallback 1: If less than 5 words are left, add other unmastered level-matched words
    if (dailyWords.length < 5) {
      const repeats = levelMatched.filter(v => {
        const lw = learnedList?.find((item: any) => item.vocabulary?.word?.toLowerCase() === v.word.toLowerCase())
        return lw && !lw.mastered
      })
      dailyWords = Array.from(new Set([...dailyWords, ...repeats]))
    }

    // Fallback 2: If still less than 5 words, add unseen words from other levels
    if (dailyWords.length < 5) {
      const extraWords = VOCABULARY_WORDS.filter(v => !seenWords.has(v.word.toLowerCase()))
      dailyWords = Array.from(new Set([...dailyWords, ...extraWords]))
    }

    // Fallback 3: If still less than 5, just slice from the static curriculum
    if (dailyWords.length < 5) {
      dailyWords = VOCABULARY_WORDS
    }

    // Slice to exactly 5 words
    const finalWords = dailyWords.slice(0, 5)

    return NextResponse.json({
      success: true,
      data: {
        words: finalWords
      }
    })
  } catch (err) {
    console.error('Vocabulary API error:', err)
    return NextResponse.json({ error: 'Words load nahi hue.' }, { status: 500 })
  }
}
