import { createServerSupabase } from '@/lib/supabase/server'
import { buildMainTutorPrompt, buildRoleplaySystemPrompt } from '@/lib/gemini/prompts'
import { sanitizeUserInput } from '@/lib/utils/sanitize'
import { callAI } from '@/lib/ai/router'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    // ── 1. Auth check ──────────────────────────────────────
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // ── 2. Fetch user profile (including BYOK keys & env fallbacks) ────────
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('ai_provider, groq_api_key, openai_api_key, gemini_api_key, level, goal, current_day')
      .eq('id', session.user.id)
      .single()

    const aiConfig = {
      provider: userProfile?.ai_provider || 'groq',
      groq_api_key: userProfile?.groq_api_key || process.env.GROQ_API_KEY,
      openai_api_key: userProfile?.openai_api_key || process.env.OPENAI_API_KEY,
      gemini_api_key: userProfile?.gemini_api_key || process.env.GEMINI_API_KEY,
    }

    // ── 3. Parse & validate body ───────────────────────────
    const body = await req.json()
    const {
      message,
      history = [],
      userLevel = 'A1',
      userName = 'User',
      userGoal = 'general',
      grammarTopic = 'General Conversation',
      vocabWords = 'None',
      sessionId,
      mode = 'general',
      roleplayScene = ''
    } = body

    const cleanMessage = sanitizeUserInput(message)
    if (!cleanMessage) {
      return Response.json({ error: 'Empty message' }, { status: 400 })
    }

    // ── 4. Fetch memory (skip for roleplay) ────────────────
    let memoryString = 'None'
    if (mode !== 'roleplay') {
      let summariesStr = 'No previous session summaries.'
      try {
        const { data: recentSessions } = await supabase
          .from('speaking_sessions')
          .select('session_summary')
          .eq('user_id', session.user.id)
          .is('session_summary', 'not.null')
          .order('created_at', { ascending: false })
          .limit(3)
        if (recentSessions && recentSessions.length > 0) {
          summariesStr = recentSessions.map((s: any) => `- ${s.session_summary}`).join('\n')
        }
      } catch (e) {
        console.error('Error fetching summaries:', e)
      }

      let commonMistakesStr = 'No recorded grammar mistakes.'
      try {
        const { data: recentConvs } = await supabase
          .from('conversations')
          .select('grammar_corrected, grammar_rule')
          .eq('user_id', session.user.id)
          .is('grammar_corrected', 'not.null')
          .order('created_at', { ascending: false })
          .limit(10)
        if (recentConvs && recentConvs.length > 0) {
          commonMistakesStr = recentConvs
            .map((c: any) => `- Mistake: "${c.grammar_corrected}" (Rule: ${c.grammar_rule})`)
            .join('\n')
        }
      } catch (e) {
        console.error('Error fetching mistakes:', e)
      }

      memoryString = `SUMMARY OF PREVIOUS SESSIONS:\n${summariesStr}\n\nRECURRING MISTAKES TO WATCH OUT FOR:\n${commonMistakesStr}`
    }

    // ── 5. Build system prompt ─────────────────────────────
    let systemPrompt = ''
    if (mode === 'roleplay') {
      systemPrompt = buildRoleplaySystemPrompt(roleplayScene, userLevel)
    } else {
      let basePrompt = buildMainTutorPrompt(userName, userLevel, userGoal, grammarTopic, vocabWords, memoryString)
      if (mode === 'lesson') {
        const commonIrregularVerbs = ['go','come','see','eat','drink','sleep','speak','take','give','find','tell','buy','write','run','meet','know','think','make','get','feel','fall','leave','forget','hear','lose','pay','sell','send','teach','wear','win','bring','catch','keep','hold','break','build','grow','drive','fly','throw','understand','stand','sit']
        const vocabList = (vocabWords || '').toLowerCase()
        const hasVerb = commonIrregularVerbs.some(v => vocabList.includes(v))
        basePrompt += `\n\nSTRICT DAILY LESSON PLAN INSTRUCTIONS:
You are teaching a structured daily lesson. Follow this lesson plan:
- Phase 1: Introduce and review today's grammar topic (${grammarTopic}). Ask questions to check understanding.
- Phase 2: Guide user to practice today's focus vocabulary words (${vocabWords}) in context.${hasVerb ? `
  VERB PRACTICE NOTE: Some of today's words are irregular verbs. When practicing them:
  • Ask user to make a V2 sentence (simple past): "Yesterday, I ____"
  • Ask user to make a V3 sentence (present perfect): "I have ____"
  • If user uses wrong verb form, correct gently by using the right form naturally in your reply.` : ''}
- Phase 3: Transition to free-flowing conversation using all the concepts practiced.`
      }
      systemPrompt = basePrompt
    }

    // ── 6. Call AI via router ──────────────────────────────
    let responseText: string
    try {
      responseText = await callAI(
        aiConfig,
        systemPrompt,
        cleanMessage,
        history.slice(-20),
        { temperature: 0.7, maxTokens: 500, responseFormat: 'json_object' }
      )
    } catch (err: any) {
      if (err.message === 'no_api_key') {
        return Response.json(
          {
            error: 'no_api_key',
            message: 'Settings mein apni AI API key add karo. Bina key ke AI se baat nahi ho sakti! 🔑',
          },
          { status: 403 }
        )
      }
      
      console.warn('AI call fallback triggered:', err?.message || err)
      responseText = JSON.stringify({
        reply: `That's great! Tell me more about "${cleanMessage.slice(0, 30)}...". How would you describe it in detail?`,
        grammar_note: { has_error: false, original: null, corrected: null, rule: null, explanation_hindi: null },
        vocabulary: [],
        level_assessment: userLevel
      })
    }

    // ── 7. Parse JSON response ─────────────────────────────
    let parsedResponse
    try {
      const cleanJson = responseText
        .replace(/```json\n?|\n?```/g, '')
        .replace(/```\n?|\n?```/g, '')
        .trim()
      parsedResponse = JSON.parse(cleanJson)
    } catch {
      parsedResponse = {
        reply: responseText || 'That sounds great! Keep speaking.',
        correction: { made: false, original_mistake: null, subtle_correction_used: null },
        new_word: { word: null, used_in_sentence: null },
        session_note: 'Conversational response',
      }
    }

    // ── 8. Save to DB (fire and forget) ───────────────────
    supabase.from('conversations').insert({
      user_id: session.user.id,
      user_message: cleanMessage,
      ai_response: parsedResponse.reply ?? '',
      grammar_corrected: parsedResponse.correction?.subtle_correction_used ?? parsedResponse.grammar_note?.corrected ?? null,
      grammar_rule: parsedResponse.correction?.original_mistake ?? parsedResponse.grammar_note?.rule ?? null,
      grammar_explanation_hindi: parsedResponse.session_note ?? parsedResponse.grammar_note?.explanation_hindi ?? null,
      session_id: sessionId ?? crypto.randomUUID(),
    }).then(() => {})

    return Response.json({ success: true, data: parsedResponse })

  } catch (error: any) {
    console.error('AI chat error handled gracefully:', error?.message || error)

    return Response.json({
      success: true,
      data: {
        reply: "Great point! Let's continue. What else would you like to share about this topic?",
        correction: { made: false, original_mistake: null, subtle_correction_used: null },
        session_note: "Session continued."
      }
    })
  }
}
