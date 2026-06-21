// Small Web Crypto helpers. globalThis.crypto.subtle is available in both
// the Node.js runtime (API routes) and the Edge runtime (middleware) on
// Vercel, so these work everywhere without extra dependencies.

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('')
}

/** SHA-256 hash of a string, returned as a hex string. */
export async function hashString(input: string): Promise<string> {
  const data = new TextEncoder().encode(input)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return toHex(digest)
}

async function getHmacKey(secret: string): Promise<CryptoKey> {
  return crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify']
  )
}

/** HMAC-SHA256 of a string with the given secret, returned as a hex string. */
export async function hmacSign(input: string, secret: string): Promise<string> {
  const key = await getHmacKey(secret)
  const signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(input))
  return toHex(signature)
}

/** Constant-time-ish comparison of two equal-length hex strings. */
export function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  }
  return diff === 0
}