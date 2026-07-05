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

// ─────────────────────────────────────────────────────────────
// Options (per-provider overrides)
// ─────────────────────────────────────────────────────────────

export interface CallAIOptions {
  temperature?: number
  maxTokens?: number
  /** Pass 'json_object' to force JSON output (Groq / OpenAI only) */
  responseFormat?: 'json_object' | 'text'
}

// ─────────────────────────────────────────────────────────────
// Main router
// ─────────────────────────────────────────────────────────────

/**
 * Unified AI call that routes to the provider stored in the user's profile.
 * Throws Error('no_api_key') when no key is configured so callers can
 * return a friendly 403.
 */
export async function callAI(
  config: UserAIConfig,
  systemPrompt: string,
  userMessage: string,
  history: ChatMessage[] = [],
  options: CallAIOptions = {}
): Promise<string> {
  const {
    temperature = 0.7,
    maxTokens = 1000,
    responseFormat,
  } = options

  const { provider } = config

  // ── GROQ ────────────────────────────────────────────────────
  if (provider === 'groq' && config.groq_api_key) {
    const groq = new Groq({ apiKey: config.groq_api_key })

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.map(h => ({
        role: (h.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: h.content,
      })),
      { role: 'user' as const, content: userMessage },
    ]

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

  // ── GEMINI ──────────────────────────────────────────────────
  if (provider === 'gemini' && config.gemini_api_key) {
    const genAI = new GoogleGenAI({ apiKey: config.gemini_api_key })

    // Build contents array — system prompt as first user/model exchange,
    // then history, then the current user message.
    const contents = [
      { role: 'user', parts: [{ text: systemPrompt }] },
      { role: 'model', parts: [{ text: 'Understood! I will follow these instructions.' }] },
      ...history.map(h => ({
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

  // ── OPENAI ──────────────────────────────────────────────────
  if (provider === 'openai' && config.openai_api_key) {
    const openai = new OpenAI({ apiKey: config.openai_api_key })

    const messages = [
      { role: 'system' as const, content: systemPrompt },
      ...history.map(h => ({
        role: (h.role === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
        content: h.content,
      })),
      { role: 'user' as const, content: userMessage },
    ]

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

  // ── NO KEY ──────────────────────────────────────────────────
  throw new Error('no_api_key')
}
