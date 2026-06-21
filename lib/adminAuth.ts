import { hmacSign, safeCompare } from './crypto'

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000 // 24 hours

/** Creates a signed, expiring session token: "<expiryTimestamp>.<hmacHex>" */
export async function createSessionToken(secret: string): Promise<string> {
  const expiry = Date.now() + SESSION_DURATION_MS
  const signature = await hmacSign(String(expiry), secret)
  return `${expiry}.${signature}`
}

/** Verifies a session token's signature and that it has not expired. */
export async function verifySessionToken(token: string, secret: string): Promise<boolean> {
  const [expiryPart, signature] = token.split('.')
  if (!expiryPart || !signature) return false

  const expiry = Number(expiryPart)
  if (!Number.isFinite(expiry) || Date.now() > expiry) return false

  const expectedSignature = await hmacSign(expiryPart, secret)
  return safeCompare(signature, expectedSignature)
}