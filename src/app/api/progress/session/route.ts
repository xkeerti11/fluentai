import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { GoogleGenAI } from '@google/genai'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const {
      durationSeconds = 0,
      messageCount = 0,
      grammarScore,
      fluencyScore,
      wordsPracticed = 0,
      mode = 'general',
      grammarTopicPracticed,
      vocabularyWordsUsed = [],
      lessonId,
      sessionId
    } = await req.json()

    // Validate and map mode to database check constraint allowed values
    const allowedModes = ['general', 'grammar', 'vocabulary', 'roleplay', 'challenge']
    let mappedMode = 'general'
    if (mode && allowedModes.includes(mode)) {
      mappedMode = mode
    } else if (mode === 'free_talk') {
      mappedMode = 'general'
    } else if (mode === 'lesson') {
      mappedMode = 'grammar'
    } else {
      mappedMode = 'general'
    }

    // Generate session summary & roleplay feedback using Gemini
    let sessionSummary = null
    let roleplayFeedback = null

    if (sessionId) {
      try {
        const { data: conversations } = await supabase
          .from('conversations')
          .select('user_message, ai_response')
          .eq('session_id', sessionId)
          .order('created_at', { ascending: true })

        if (conversations && conversations.length > 0) {
          const chatLog = conversations.map((c: any) => `User: ${c.user_message}\nAria: ${c.ai_response}`).join('\n\n')
          const genAI = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! })

          // Generate 3-sentence memory summary
          try {
            const summaryResult = await genAI.models.generateContent({
              model: 'gemini-2.5-flash',
              contents: `Summarize this conversation in 3 sentences. Note: user's level, common mistakes made, topics discussed, progress shown. Be brief. This is for AI memory.\n\nConversation Log:\n${chatLog}`
            })
            sessionSummary = summaryResult.text || null
          } catch (se) {
            console.error('Error generating summary:', se)
          }

          // Evaluate roleplay feedback if in roleplay mode
          if (mode === 'roleplay') {
            try {
              const feedbackResult = await genAI.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: `You are an English language evaluator. Evaluate this roleplay conversation log. Analyze user response and evaluate their performance. Return ONLY a valid JSON object matching the format below (do NOT include markdown formatting or backticks):
{
  "toneRating": number (1 to 5),
  "grammarRating": number (1 to 5),
  "vocabUsed": ["word1", "word2"],
  "bestMoment": "exact quote from the user's best sentence",
  "improvementTip": "one specific advice in simple Hinglish/English"
}

Conversation Log:
${chatLog}`
              })

              const rawText = feedbackResult.text || ''
              const cleanJSON = rawText.replace(/```json/g, '').replace(/```/g, '').trim()
              roleplayFeedback = JSON.parse(cleanJSON)
            } catch (fe) {
              console.error('Error generating roleplay feedback:', fe)
            }
          }
        }
      } catch (ce) {
        console.error('Error loading conversations for summary:', ce)
      }
    }

    // 1. Save speaking session
    const { error: sessionError } = await supabase.from('speaking_sessions').insert({
      user_id: session.user.id,
      duration_seconds: durationSeconds,
      message_count: messageCount,
      grammar_score: grammarScore ?? null,
      fluency_score: fluencyScore ?? null,
      words_practiced: wordsPracticed,
      mode: mappedMode,
      grammar_topic_practiced: grammarTopicPracticed ?? null,
      vocabulary_words_used: vocabularyWordsUsed && vocabularyWordsUsed.length > 0 ? vocabularyWordsUsed : null,
      session_summary: sessionSummary,
      roleplay_feedback: roleplayFeedback
    })
    if (sessionError) throw sessionError

    // 2. If lessonId is provided, increment grammar progress study time
    if (lessonId) {
      try {
        const mins = Math.ceil(durationSeconds / 60)
        const { data: gp } = await supabase
          .from('grammar_progress')
          .select('practice_minutes')
          .eq('user_id', session.user.id)
          .eq('lesson_id', lessonId)
          .maybeSingle()

        const prevMins = gp?.practice_minutes ?? 0
        await supabase.from('grammar_progress').upsert({
          user_id: session.user.id,
          lesson_id: lessonId,
          practice_minutes: prevMins + mins
        }, { onConflict: 'user_id,lesson_id' })
      } catch (e) {
        console.error('Error updating grammar progress practice_minutes:', e)
      }
    }

    // 3. If vocabulary words were used, mark them as seen in learned_words
    if (vocabularyWordsUsed && vocabularyWordsUsed.length > 0) {
      for (const wordStr of vocabularyWordsUsed) {
        try {
          // Find the word id in the database
          const { data: v } = await supabase
            .from('vocabulary')
            .select('id')
            .eq('word', wordStr)
            .maybeSingle()

          if (v?.id) {
            // Find current seen count
            const { data: lw } = await supabase
              .from('learned_words')
              .select('seen_count')
              .eq('user_id', session.user.id)
              .eq('word_id', v.id)
              .maybeSingle()

            const prevSeen = lw?.seen_count ?? 0
            await supabase.from('learned_words').upsert({
              user_id: session.user.id,
              word_id: v.id,
              seen_count: prevSeen + 1,
              last_seen_at: new Date().toISOString()
            }, { onConflict: 'user_id,word_id' })
          }
        } catch (e) {
          console.error(`Error updating learned_words for vocabulary word "${wordStr}":`, e)
        }
      }
    }

    // 4. Upsert daily streak (increment minutes_practiced)
    const today = new Date().toISOString().split('T')[0]
    const minutesPracticed = Math.floor(durationSeconds / 60)

    try {
      await supabase.rpc('upsert_daily_streak', {
        p_user_id: session.user.id,
        p_date: today,
        p_minutes: minutesPracticed,
      })
    } catch (e) {
      console.warn('RPC upsert_daily_streak failed, updating streak manually')
      try {
        const { data: existingStreak } = await supabase
          .from('daily_streaks')
          .select('minutes_practiced')
          .eq('user_id', session.user.id)
          .eq('date', today)
          .maybeSingle()

        const prevMinutes = existingStreak?.minutes_practiced ?? 0
        await supabase.from('daily_streaks').upsert({
          user_id: session.user.id,
          date: today,
          minutes_practiced: prevMinutes + minutesPracticed
        }, { onConflict: 'user_id,date' })
      } catch (err) {
        console.error('Streak manual upsert failed:', err)
      }
    }

    // 5. Calculate current streak
    let currentStreak = 0
    try {
      const { data: streaks } = await supabase
        .from('daily_streaks')
        .select('date, minutes_practiced')
        .eq('user_id', session.user.id)
        .gte('minutes_practiced', 5)
        .order('date', { ascending: false })
        .limit(30)

      if (streaks) {
        const todayDate = new Date()
        for (let i = 0; i < streaks.length; i++) {
          const streakDate = new Date(streaks[i].date)
          const diff = Math.floor((todayDate.getTime() - streakDate.getTime()) / 86400000)
          if (diff === i) currentStreak++
          else break
        }
      }
    } catch (e) {
      console.error('Error calculating streak:', e)
    }

    // 6. If mode is lesson, increment current_day in profiles
    if (mode === 'lesson') {
      try {
        const { data: prof } = await supabase
          .from('profiles')
          .select('current_day')
          .eq('id', session.user.id)
          .maybeSingle()
        
        const nextDay = (prof?.current_day ?? 1) + 1
        await supabase
          .from('profiles')
          .update({ current_day: nextDay })
          .eq('id', session.user.id)
      } catch (e) {
        console.error('Error incrementing current_day in profiles:', e)
      }
    }

    return NextResponse.json({
      success: true,
      data: { sessionSaved: true, currentStreak, roleplayFeedback },
    })
  } catch (err: any) {
    console.error('Session save error:', err)
    return NextResponse.json({ 
      error: 'Session save nahi hua.',
      message: err instanceof Error ? err.message : String(err),
      details: err && typeof err === 'object' ? JSON.stringify(err) : String(err)
    }, { status: 500 })
  }
}
