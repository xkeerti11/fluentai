import Groq from 'groq-sdk'
import { createServerSupabase } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'
import { sanitizeSentence } from '@/lib/utils/sanitize'
import { isRateLimited } from '@/lib/utils/rateLimit'
import { GROQ_MODEL } from '@/lib/groq/client'

export const runtime = 'nodejs'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY! })

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

    const { sentence } = await req.json()
    const clean = sanitizeSentence(sentence)
    if (!clean) return NextResponse.json({ error: 'Empty sentence' }, { status: 400 })

    // ── Primary: Groq (fast, always available) ──────────────
    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: GRAMMAR_CORRECTION_SYSTEM },
        { role: 'user', content: `Input sentence: ${clean}` }
      ],
      temperature: 0.3,
      max_tokens: 400,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message?.content || ''

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
