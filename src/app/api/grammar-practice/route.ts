import Groq from 'groq-sdk'
import { createServerSupabase } from '@/lib/supabase/server'
import { GROQ_MODEL } from '@/lib/groq/client'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
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

    const { lessonTopic, lessonFormula, userLevel, message, history } = await req.json()

    if (!message) {
      return Response.json({ error: 'Message required' }, { status: 400 })
    }

    const systemPrompt = `You are an English grammar practice teacher for Hindi speakers.
Today's topic: ${lessonTopic || 'Basic Grammar'}
Formula: ${lessonFormula || ''}
Student level: ${userLevel || 'A0'}

Rules:
1. ONLY practice this specific grammar topic
2. Ask simple questions requiring student to use this grammar
3. Correct mistakes by naturally using correct form in your reply
4. Keep responses SHORT (2-3 sentences max)
5. Always ask ONE follow-up question
6. Be encouraging, never say "wrong" or "incorrect"
7. For A0 level: use very simple English only

Return ONLY valid JSON:
{
  "reply": "your response here",
  "correction": {
    "made": false,
    "original_mistake": null,
    "corrected_form": null
  }
}`

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...((history || []).slice(-8).map((msg: any) => ({
        role: (msg.role === 'assistant' ? 'assistant' : 'user') as 'assistant' | 'user',
        content: msg.content,
      }))),
      { role: 'user' as const, content: message },
    ]

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages,
      temperature: 0.6,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    })

    const responseText = completion.choices[0]?.message?.content || ''

    let parsedResponse
    try {
      parsedResponse = JSON.parse(responseText)
    } catch {
      parsedResponse = {
        reply: responseText,
        correction: { made: false, original_mistake: null, corrected_form: null },
      }
    }

    return Response.json({ success: true, data: parsedResponse })

  } catch (error: any) {
    console.error('Grammar practice error:', error?.message || error)
    return Response.json(
      { error: 'AI se connect nahi ho paya. Dobara try karo.' },
      { status: 500 }
    )
  }
}
