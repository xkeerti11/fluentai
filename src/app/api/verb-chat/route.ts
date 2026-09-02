import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabase/server'
import { getVerbsByDay } from '@/data/verb-curriculum'
import { callAI, UserAIConfig, ChatMessage } from '@/lib/ai/router'

export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()

    let aiConfig: UserAIConfig = {
      provider: 'groq',
      groq_api_key: process.env.GROQ_API_KEY || null,
      gemini_api_key: process.env.GEMINI_API_KEY || null,
    }

    if (session?.user?.id) {
      const { data: userProfile } = await supabase
        .from('profiles')
        .select('ai_provider, groq_api_key, openai_api_key, gemini_api_key')
        .eq('id', session.user.id)
        .single()

      if (userProfile) {
        aiConfig = {
          provider: userProfile.ai_provider || aiConfig.provider,
          groq_api_key: userProfile.groq_api_key || aiConfig.groq_api_key,
          openai_api_key: userProfile.openai_api_key,
          gemini_api_key: userProfile.gemini_api_key || aiConfig.gemini_api_key,
        }
      }
    }

    const body = await req.json()
    const { messages = [], day = 1, verbs = [] } = body

    // 1. Resolve verbs list for this day
    const dayVerbs = verbs.length > 0 ? verbs : getVerbsByDay(day)
    const verbListString = dayVerbs
      .map((v: any) => `${v.word} (V1: ${v.v1}, V2: ${v.v2}, V3: ${v.v3}, Meaning: ${v.meaning_hindi})`)
      .join('\n- ')

    // 2. Build system prompt
    const systemPrompt = `You are Aria, a friendly English verb practice coach for Hindi speakers.
You are practicing these verbs today:
- ${verbListString}

YOUR JOB:
Ask the student to make sentences using these verbs.
Test all three forms: V1 (present), V2 (past/simple past), V3 (past participle with have/has/had).

CONVERSATION STYLE:
- Like a friendly tutor having a real back-and-forth conversation
- Ask ONE question at a time
- Wait for student answer, then respond to WHAT THEY SAID
- Correct mistakes gently, naturally (don't say "WRONG")
- Celebrate correct answers genuinely
- Give Hindi hint if student is stuck

QUESTION FLOW (rotate through these):
1. "Can you make a sentence using [verb] in present tense (V1)?"
2. "Now use [verb] in past tense (V2) - tell me something that happened yesterday"  
3. "Try using [verb] with 'have/has' (V3 form)"
4. "Make a negative sentence using [verb]"
5. "Ask me a question using [verb]"

CORRECTION STYLE:
User says: "I goed to market"
You say: "Oh nice! Just a small fix — we say 'I went to market' (went is V2 of go). Try again with 'went'!"

User says: "I have ate food"
You say: "Almost! With 'have', we use V3 — so it's 'I have eaten food'. 'Eaten' is the third form of 'eat'. Can you make another sentence with 'have eaten'?"

ENCOURAGEMENT:
- "Perfect! That's exactly right! 🎉"
- "Bahut achha! You're getting it!"
- "Great improvement! See how naturally you used [verb]?"

Return ONLY a valid JSON object matching this schema without markdown fences:
{
  "reply": "your conversational response",
  "correction": {
    "made": false,
    "wrong_form": "",
    "correct_form": "",
    "verb_form_used": "V1/V2/V3",
    "hindi_hint": ""
  },
  "next_verb_to_practice": "word",
  "session_note": "progress note"
}`

    // 3. Format history and last user message
    const formattedHistory: ChatMessage[] = []
    let userMessage = "Hello Aria! Let's practice verbs today."

    if (messages.length > 0) {
      const recent = messages.slice(-10)
      for (let i = 0; i < recent.length - 1; i++) {
        formattedHistory.push({
          role: recent[i].sender === 'user' ? 'user' : 'assistant',
          content: recent[i].text || recent[i].content || ''
        })
      }
      const last = recent[recent.length - 1]
      userMessage = last.text || last.content || userMessage
    }

    const rawResponse = await callAI(
      aiConfig,
      systemPrompt,
      userMessage,
      formattedHistory,
      { maxTokens: 600, temperature: 0.7 }
    )

    // 4. Parse JSON
    let parsed
    try {
      const cleanJson = rawResponse
        .replace(/```json\n?|\n?```/g, '')
        .replace(/```\n?|\n?```/g, '')
        .trim()
      parsed = JSON.parse(cleanJson)
    } catch {
      parsed = {
        reply: rawResponse.replace(/[*#_`~]/g, '').trim(),
        correction: { made: false },
        next_verb_to_practice: dayVerbs[0]?.word || 'go',
        session_note: 'Conversational response'
      }
    }

    return NextResponse.json({
      success: true,
      data: parsed
    })
  } catch (err: any) {
    console.error('Verb Chat API Error:', err)
    return NextResponse.json({
      success: false,
      error: err.message || 'Failed to generate coach reply',
      data: {
        reply: "Bahut achha attempt! Keep practicing with today's verbs. Try making another sentence!",
        correction: { made: false }
      }
    }, { status: 200 })
  }
}
