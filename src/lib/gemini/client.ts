import { GoogleGenAI } from '@google/genai'

// NOTE: The global singleton has been removed as part of the BYOK migration.
// All AI calls now go through src/lib/ai/router.ts using per-user API keys.
// This file is kept for utility functions used elsewhere.

/** @deprecated Use callAI() from @/lib/ai/router instead */
export function createGeminiClient(apiKey: string) {
  return new GoogleGenAI({ apiKey })
}

export default createGeminiClient

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
