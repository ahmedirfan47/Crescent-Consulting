// Lightweight in-memory rate limiter. Suitable for current traffic on a
// single Vercel deployment.
//
// LIMITATION: in-memory state resets on cold starts and is not shared
// across serverless instances. If traffic grows significantly, swap this
// for Upstash Redis (@upstash/ratelimit) — same function signature.

interface RateRecord {
  count: number
  resetAt: number
}

const requests = new Map<string, RateRecord>()

const WINDOW_MS = 10 * 60 * 1000 // 10 minutes
const DEFAULT_MAX_REQUESTS = 30

export function checkRateLimit(
  identifier: string,
  maxRequests: number = DEFAULT_MAX_REQUESTS
): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = requests.get(identifier)

  if (!record || now > record.resetAt) {
    requests.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: maxRequests - 1 }
  }

  if (record.count >= maxRequests) {
    return { allowed: false, remaining: 0 }
  }

  record.count += 1
  return { allowed: true, remaining: maxRequests - record.count }
}