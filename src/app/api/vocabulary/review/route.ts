import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { getNextReviewDate } from '@/lib/utils/spacedRepetition'
import { VOCABULARY_WORDS } from '@/data/vocabulary-curriculum'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { word, correct } = await req.json()
    if (!word) return NextResponse.json({ error: 'Word text required' }, { status: 400 })

    const userId = session.user.id

    // 1. Get or insert word in vocabulary table
    let vocabId: string | null = null
    const { data: existingVocab } = await supabase
      .from('vocabulary')
      .select('id')
      .eq('word', word)
      .maybeSingle()

    if (existingVocab?.id) {
      vocabId = existingVocab.id
    } else {
      // Find details from static curriculum
      const vocabDetails = VOCABULARY_WORDS.find(v => v.word.toLowerCase() === word.toLowerCase())
      if (vocabDetails) {
        const { data: newVocab, error: insertErr } = await supabase
          .from('vocabulary')
          .insert({
            word: vocabDetails.word,
            meaning_hindi: vocabDetails.meaning_hindi,
            example_sentence: vocabDetails.example,
            level: vocabDetails.level,
            category: vocabDetails.topic,
            pronunciation: vocabDetails.pronunciation,
            example_hindi: vocabDetails.example_hindi,
            memory_trick: vocabDetails.memory_trick
          })
          .select('id')
          .single()

        if (insertErr) {
          console.error('Insert vocab error:', insertErr)
        } else if (newVocab) {
          vocabId = newVocab.id
        }
      }
      
      // Fallback: If still no vocabId (not in curriculum, or insert failed), create generic row
      if (!vocabId) {
        try {
          const { data: genericVocab } = await supabase
            .from('vocabulary')
            .insert({
              word: word,
              meaning_hindi: 'Word meaning',
              example_sentence: 'Example sentence',
              level: 'A1',
              category: 'general'
            })
            .select('id')
            .single()
          
          if (genericVocab) {
            vocabId = genericVocab.id
          }
        } catch (e) {
          console.error('Generic insert error:', e)
        }
      }
    }

    if (!vocabId) {
      return NextResponse.json({ error: 'Unable to register word in database' }, { status: 500 })
    }

    // 2. Fetch existing progress in learned_words
    const { data: existingProgress } = await supabase
      .from('learned_words')
      .select('*')
      .eq('user_id', userId)
      .eq('word_id', vocabId)
      .maybeSingle()

    let correctCount = existingProgress?.correct_count ?? 0
    let incorrectCount = existingProgress?.incorrect_count ?? 0
    let seenCount = (existingProgress?.seen_count ?? 0) + 1

    if (correct) {
      correctCount += 1
    } else {
      correctCount = 0
      incorrectCount += 1
    }

    // Next review offset
    const nextReviewDateObj = getNextReviewDate(correct, correctCount)
    const mastered = correctCount >= 4

    const { error: upsertErr } = await supabase
      .from('learned_words')
      .upsert({
        user_id: userId,
        word_id: vocabId,
        seen_count: seenCount,
        correct_count: correctCount,
        incorrect_count: incorrectCount,
        next_review_date: nextReviewDateObj.toISOString(),
        last_seen_at: new Date().toISOString(),
        mastered: mastered
      }, { onConflict: 'user_id,word_id' })

    if (upsertErr) {
      throw upsertErr
    }

    return NextResponse.json({
      success: true,
      data: {
        word,
        correctCount,
        nextReviewDate: nextReviewDateObj.toISOString(),
        mastered
      }
    })

  } catch (err) {
    console.error('Review vocabulary error:', err)
    return NextResponse.json({ error: 'Review log failed.' }, { status: 500 })
  }
}
