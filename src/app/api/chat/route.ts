import Groq from 'groq-sdk'
import { createServerSupabase } from '@/lib/supabase/server'
import { buildMainTutorPrompt, buildRoleplaySystemPrompt } from '@/lib/gemini/prompts'
import { sanitizeUserInput } from '@/lib/utils/sanitize'
import { GROQ_MODEL } from '@/lib/groq/client'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    // ── 1. Auth check ──────────────────────────────────────
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's groq_api_key
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('groq_api_key, level, goal, current_day')
      .eq('id', session.user.id)
      .single()

    const groqApiKey = userProfile?.groq_api_key || process.env.GROQ_API_KEY
    const groq = new Groq({ apiKey: groqApiKey })

    // ── 2. Parse & validate body ───────────────────────────
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

    // ── 3. Fetch memory (skip for roleplay) ────────────────
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

    // ── 4. Build system prompt ─────────────────────────────
    let systemPrompt = ''
    if (mode === 'roleplay') {
      systemPrompt = buildRoleplaySystemPrompt(roleplayScene, userLevel)
    } else {
      let basePrompt = buildMainTutorPrompt(userName, userLevel, userGoal, grammarTopic, vocabWords, memoryString)
      if (mode === 'lesson') {
        basePrompt += `\n\nSTRICT DAILY LESSON PLAN INSTRUCTIONS:
You are teaching a structured daily lesson. Follow this lesson plan:
- Phase 1: Introduce and review today's grammar topic (${grammarTopic}). Ask questions to check understanding.
- Phase 2: Guide user to practice today's focus vocabulary words (${vocabWords}) in context.
- Phase 3: Transition to free-flowing conversation using all the concepts practiced.`
      }
      systemPrompt = basePrompt
    }

    // ── 5. Build Groq messages array ───────────────────────
    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.slice(-20).map((msg: { role: string; content: string }) => ({
        role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: msg.content,
      })),
      { role: 'user' as const, content: cleanMessage },
    ]

    // ── 6. Call Groq ───────────────────────────────────────
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      temperature: 0.7,
      max_tokens: 500,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message?.content || ''

    // ── 7. Parse JSON response ─────────────────────────────
    let parsedResponse
    try {
      parsedResponse = JSON.parse(responseText)
    } catch {
      parsedResponse = {
        reply: responseText || 'Something went wrong, please try again.',
        correction: { made: false, original_mistake: null, subtle_correction_used: null },
        new_word: { word: null, used_in_sentence: null },
        session_note: 'Fallback parsing used.',
      }
    }

    // ── 8. Save to DB (fire and forget) ───────────────────
    supabase.from('conversations').insert({
      user_id: session.user.id,
      user_message: cleanMessage,
      ai_response: parsedResponse.reply ?? '',
      grammar_corrected: parsedResponse.correction?.subtle_correction_used ?? null,
      grammar_rule: parsedResponse.correction?.original_mistake ?? null,
      grammar_explanation_hindi: parsedResponse.session_note ?? null,
      session_id: sessionId ?? crypto.randomUUID(),
    }).then(() => {})

    return Response.json({ success: true, data: parsedResponse })

  } catch (error: any) {
    console.error('Groq chat error:', error?.message || error)

    const isRateLimit =
      error?.message?.includes('429') ||
      error?.message?.includes('rate_limit')

    if (isRateLimit) {
      return Response.json(
        { error: 'rate_limit', message: 'Thoda ruko! 10 second baad try karo.' },
        { status: 429 }
      )
    }

    return Response.json(
      { error: 'AI se connect nahi ho paya.' },
      { status: 500 }
    )
  }
}
