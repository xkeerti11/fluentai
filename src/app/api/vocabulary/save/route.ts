import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { VOCABULARY_WORDS } from '@/data/vocabulary-curriculum'

// POST — save a word to learned_words
export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let { wordId, word } = await req.json()

    if (!wordId && word) {
      // Find in DB first
      const { data: dbItem } = await supabase
        .from('vocabulary')
        .select('id')
        .eq('word', word.trim().toLowerCase())
        .maybeSingle()

      if (dbItem) {
        wordId = dbItem.id
      } else {
        // Find in static curriculum
        const match = VOCABULARY_WORDS.find(v => v.word.toLowerCase() === word.trim().toLowerCase())
        if (match) {
          const { data: newDbItem } = await supabase
            .from('vocabulary')
            .insert({
              word: match.word,
              meaning_hindi: match.meaning_hindi,
              example_sentence: match.example,
              level: match.level,
              category: match.topic,
              pronunciation: match.pronunciation,
              example_hindi: match.example_hindi,
              memory_trick: match.memory_trick
            })
            .select('id')
            .single()

          if (newDbItem) {
            wordId = newDbItem.id
          }
        }
      }
    }

    if (!wordId) {
      return NextResponse.json({ error: 'wordId or valid word required' }, { status: 400 })
    }

    const { error } = await supabase.from('learned_words').upsert({
      user_id: session.user.id,
      word_id: wordId,
      mastered: false,
      seen_count: 1,
      last_seen_at: new Date().toISOString(),
    }, { onConflict: 'user_id,word_id' })

    if (error) throw error

    return NextResponse.json({ success: true, data: { saved: true, wordId } })
  } catch (err) {
    console.error('Save word error:', err)
    return NextResponse.json({ error: 'Word save nahi hua.' }, { status: 500 })
  }
}
