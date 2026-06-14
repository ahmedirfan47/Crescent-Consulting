// Lightweight in-memory rate limiter for the chat API.
// Suitable for current traffic levels on a single Vercel deployment.
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
const MAX_REQUESTS = 30 // 30 messages per IP per 10 minutes

export function checkRateLimit(identifier: string): { allowed: boolean; remaining: number } {
  const now = Date.now()
  const record = requests.get(identifier)

  if (!record || now > record.resetAt) {
    requests.set(identifier, { count: 1, resetAt: now + WINDOW_MS })
    return { allowed: true, remaining: MAX_REQUESTS - 1 }
  }

  if (record.count >= MAX_REQUESTS) {
    return { allowed: false, remaining: 0 }
  }

  record.count += 1
  return { allowed: true, remaining: MAX_REQUESTS - record.count }
}