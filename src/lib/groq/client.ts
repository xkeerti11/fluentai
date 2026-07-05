// groq/client.ts
// The module-level Groq instance is no longer used in production routes
// (all AI calls now go through src/lib/ai/router.ts via the BYOK system).
// This file is kept for the GROQ_MODEL constant which may still be referenced.

export const GROQ_MODEL = 'llama-3.3-70b-versatile'
// Fast, smart, and available on Groq free tier (14,400 req/day)
