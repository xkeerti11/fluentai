import { GoogleGenAI } from '@google/genai'

// Singleton Gemini client — server-side only
export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || 'placeholder-key'
})

export default ai

// ─────────────────────────────────────────
// Safe wrapper with retry on rate limit
// ─────────────────────────────────────────
export async function safeGeminiCall<T>(
  fn: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await fn()
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error)

    // Rate limit — wait 60s and retry once
    if (message.includes('429')) {
      console.warn('Gemini rate limit hit, retrying in 60s...')
      await new Promise(r => setTimeout(r, 60000))
      try {
        return await fn()
      } catch {
        return fallback
      }
    }

    console.error('Gemini API error:', message)
    return fallback
  }
}

// ─────────────────────────────────────────
// Strip Gemini markdown code fences from JSON
// ─────────────────────────────────────────
export function extractJSON(text: string): string {
  return text
    .replace(/```json\n?|\n?```/g, '')
    .replace(/```\n?|\n?```/g, '')
    .trim()
}
