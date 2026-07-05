import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sanitizeSentence } from '@/lib/utils/sanitize'
import { isRateLimited } from '@/lib/utils/rateLimit'
import { callAI } from '@/lib/ai/router'

export const runtime = 'nodejs'

const GRAMMAR_CORRECTION_SYSTEM = `You are an English grammar correction expert for Hindi speakers.
Analyze the given sentence and return ONLY a valid JSON object (no markdown, no backticks).

JSON format:
{
  "original": "the original input sentence",
  "corrected": "the grammatically correct version",
  "is_correct": true or false,
  "errors": [
    {
      "type": "error type (e.g. verb tense, subject-verb agreement)",
      "wrong": "the wrong part",
      "right": "the correct part",
      "explanation_hindi": "brief explanation in Hinglish"
    }
  ]
}

If the sentence is already correct, set is_correct to true and errors to an empty array.
Keep corrections natural and educational. Always return valid JSON.`

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    if (isRateLimited(session.user.id)) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 })
    }

    // Fetch user's BYOK config
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('ai_provider, groq_api_key, openai_api_key, gemini_api_key')
      .eq('id', session.user.id)
      .single()

    const aiConfig = {
      provider: userProfile?.ai_provider || 'groq',
      groq_api_key: userProfile?.groq_api_key,
      openai_api_key: userProfile?.openai_api_key,
      gemini_api_key: userProfile?.gemini_api_key,
    }

    const { sentence } = await req.json()
    const clean = sanitizeSentence(sentence)
    if (!clean) return NextResponse.json({ error: 'Empty sentence' }, { status: 400 })

    let responseText: string
    try {
      responseText = await callAI(
        aiConfig,
        GRAMMAR_CORRECTION_SYSTEM,
        `Input sentence: ${clean}`,
        [],
        { temperature: 0.3, maxTokens: 400, responseFormat: 'json_object' }
      )
    } catch (err: any) {
      if (err.message === 'no_api_key') {
        return NextResponse.json(
          {
            error: 'no_api_key',
            message: 'Settings mein apni AI API key add karo. Bina key ke AI se baat nahi ho sakti! 🔑',
          },
          { status: 403 }
        )
      }
      throw err
    }

    let parsed
    try {
      parsed = JSON.parse(responseText)
    } catch {
      // Fallback: treat as correct if parse fails
      parsed = { original: clean, corrected: clean, is_correct: true, errors: [] }
    }

    return NextResponse.json({ success: true, data: parsed })

  } catch (err) {
    console.error('Grammar API error:', err)
    return NextResponse.json({ error: 'AI se error aaya.' }, { status: 500 })
  }
}
