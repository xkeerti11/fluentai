import { createServerSupabase } from '@/lib/supabase/server'
import { callAI } from '@/lib/ai/router'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  try {
    const supabase = await createServerSupabase()
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Fetch user's BYOK config
    const { data: userProfile } = await supabase
      .from('profiles')
      .select('ai_provider, groq_api_key, openai_api_key, gemini_api_key, level, goal, current_day')
      .eq('id', session.user.id)
      .single()

    const aiConfig = {
      provider: userProfile?.ai_provider || 'groq',
      groq_api_key: userProfile?.groq_api_key,
      openai_api_key: userProfile?.openai_api_key,
      gemini_api_key: userProfile?.gemini_api_key,
    }

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

    // Call AI via router
    let responseText: string
    try {
      responseText = await callAI(
        aiConfig,
        systemPrompt,
        message,
        (history || []).slice(-8),
        { temperature: 0.6, maxTokens: 300, responseFormat: 'json_object' }
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
      throw err
    }

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
