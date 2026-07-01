/**
 * Simple in-memory rate limiter.
 * Works per Vercel serverless function invocation.
 * For production at scale, replace with Upstash Redis.
 */

const requestMap = new Map<string, number[]>()

/**
 * @param userId  - Unique identifier (Supabase user ID)
 * @param limit   - Max requests per window (default: 10)
 * @param windowMs - Time window in ms (default: 60000 = 1 minute)
 * @returns true if the user is rate limited
 */
export function isRateLimited(
  userId: string,
  limit = 10,
  windowMs = 60_000
): boolean {
  const now = Date.now()
  const userRequests = requestMap.get(userId) ?? []

  // Remove requests outside the time window
  const recent = userRequests.filter(t => now - t < windowMs)

  if (recent.length >= limit) {
    requestMap.set(userId, recent)
    return true // Rate limited
  }

  recent.push(now)
  requestMap.set(userId, recent)
  return false
}

/**
 * Clear a user's rate limit history (useful for testing).
 */
export function clearRateLimit(userId: string): void {
  requestMap.delete(userId)
}
