/**
 * Input sanitizer for user messages sent to Gemini.
 * Strips HTML tags, trims whitespace, limits to 1000 chars.
 */
export function sanitizeUserInput(input: string): string {
  if (!input || typeof input !== 'string') return ''

  // Remove HTML tags
  const noHtml = input.replace(/<[^>]*>/g, '')

  // Collapse multiple spaces/newlines
  const normalized = noHtml.replace(/\s+/g, ' ').trim()

  // Limit length to prevent abuse
  return normalized.slice(0, 1000)
}

/**
 * Sanitizes a sentence for grammar checking.
 * Slightly more lenient — allows up to 500 chars.
 */
export function sanitizeSentence(input: string): string {
  if (!input || typeof input !== 'string') return ''
  return input
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 500)
}
