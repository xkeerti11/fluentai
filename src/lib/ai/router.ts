import Groq from 'groq-sdk'
import { GoogleGenAI } from '@google/genai'
import OpenAI from 'openai'

// ─────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────

export interface UserAIConfig {
  provider: string
  groq_api_key?: string | null
  openai_api_key?: string | null
  gemini_api_key?: string | null
}

type MessageRole = 'user' | 'assistant'

export interface ChatMessage {
  role: MessageRole | string
  content: string
}

export interface CallAIOptions {
  temperature?: number
  maxTokens?: number
  responseFormat?: 'json_object' | 'text'
}

// ─────────────────────────────────────────────────────────────
// Main resilient router
// ─────────────────────────────────────────────────────────────

export async function callAI(
  config: UserAIConfig,
  systemPrompt: string,
  userMessage: string,
  history: ChatMessage[] = [],
  options: CallAIOptions = {}
): Promise<string> {
  const {
    temperature = 0.7,
    maxTokens = 800,
    responseFormat,
  } = options

  // Resolve available keys (User BYOK takes priority, then process.env)
  const groqKey = config.groq_api_key || process.env.GROQ_API_KEY || null
  const geminiKey = config.gemini_api_key || process.env.GEMINI_API_KEY || null
  const openaiKey = config.openai_api_key || process.env.OPENAI_API_KEY || null

  const primaryProvider = config.provider || 'groq'

  // Helper to format messages
  const getChatMessages = () => [
    { role: 'system' as const, content: systemPrompt },
    ...history.slice(-10).map(h => ({
      role: (h.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: h.content,
    })),
    { role: 'user' as const, content: userMessage },
  ]

  // Try Groq
  const tryGroq = async (key: string): Promise<string> => {
    const groq = new Groq({ apiKey: key })
    const messages = getChatMessages()
    
    // Ensure "JSON" is mentioned if json_object mode is requested
    const effectiveSystemPrompt = responseFormat === 'json_object' && !systemPrompt.includes('JSON')
      ? `${systemPrompt}\n\nRespond strictly in valid JSON format.`
      : systemPrompt

    messages[0] = { role: 'system', content: effectiveSystemPrompt }

    const completion = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature,
      max_tokens: maxTokens,
      ...(responseFormat === 'json_object'
        ? { response_format: { type: 'json_object' as const } }
        : {}),
    })

    return completion.choices[0]?.message?.content || ''
  }

  // Try Gemini
  const tryGemini = async (key: string): Promise<string> => {
    const genAI = new GoogleGenAI({ apiKey: key })
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood! I will follow these instructions.' }] },
      ...history.slice(-10).map(h => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }],
      })),
      { role: 'user', parts: [{ text: userMessage }] },
    ]

    const result = await genAI.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
    })

    return result.text ?? ''
  }

  // Try OpenAI
  const tryOpenAI = async (key: string): Promise<string> => {
    const openai = new OpenAI({ apiKey: key })
    const messages = getChatMessages()

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      temperature,
      max_tokens: maxTokens,
      ...(responseFormat === 'json_object'
        ? { response_format: { type: 'json_object' as const } }
        : {}),
    })

    return completion.choices[0]?.message?.content || ''
  }

  // ── Multi-Provider Execution with Automatic Fallbacks ────────
  const attempts: { name: string; fn: () => Promise<string> }[] = []

  if (primaryProvider === 'groq' && groqKey) attempts.push({ name: 'Groq', fn: () => tryGroq(groqKey) })
  if (primaryProvider === 'gemini' && geminiKey) attempts.push({ name: 'Gemini', fn: () => tryGemini(geminiKey) })
  if (primaryProvider === 'openai' && openaiKey) attempts.push({ name: 'OpenAI', fn: () => tryOpenAI(openaiKey) })

  // Add remaining providers as fallbacks
  if (primaryProvider !== 'groq' && groqKey) attempts.push({ name: 'Groq-Fallback', fn: () => tryGroq(groqKey) })
  if (primaryProvider !== 'gemini' && geminiKey) attempts.push({ name: 'Gemini-Fallback', fn: () => tryGemini(geminiKey) })
  if (primaryProvider !== 'openai' && openaiKey) attempts.push({ name: 'OpenAI-Fallback', fn: () => tryOpenAI(openaiKey) })

  let lastError: any = null
  for (const attempt of attempts) {
    try {
      const response = await attempt.fn()
      if (response && response.trim().length > 0) {
        return response
      }
    } catch (err: any) {
      console.warn(`AI Provider [${attempt.name}] failed:`, err?.message || err)
      lastError = err
    }
  }

  // If all providers failed or no keys were provided, return a friendly graceful JSON response
  if (responseFormat === 'json_object') {
    return JSON.stringify({
      reply: `That's an interesting point! Tell me more about "${userMessage.slice(0, 30)}...". How would you describe it in detail?`,
      correction: { made: false, original_mistake: null, subtle_correction_used: null },
      new_word: { word: "progress", used_in_sentence: "Practice leads to progress." },
      session_note: "Fallback conversation mode."
    })
  }

  if (lastError) {
    throw lastError
  }

  throw new Error('no_api_key')
}
