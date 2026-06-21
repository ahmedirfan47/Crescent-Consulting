import { NextRequest, NextResponse } from 'next/server'
import { createSessionToken } from '@/lib/adminAuth'
import { checkRateLimit } from '@/lib/rateLimit'

export async function POST(req: NextRequest) {
  try {
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'

    // Stricter limiter for login attempts to slow down brute-forcing.
    const { allowed } = checkRateLimit(`admin-login-${ip}`)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many attempts. Please wait and try again.' }, { status: 429 })
    }

    const body = await req.json().catch(() => null)
    const password = body?.password

    const adminPassword = process.env.ADMIN_PASSWORD
    const sessionSecret = process.env.ADMIN_SESSION_SECRET

    if (!adminPassword || !sessionSecret) {
      console.error('ADMIN_PASSWORD or ADMIN_SESSION_SECRET not configured.')
      return NextResponse.json({ error: 'Admin login is not configured.' }, { status: 500 })
    }

    if (typeof password !== 'string' || password !== adminPassword) {
      return NextResponse.json({ error: 'Incorrect password.' }, { status: 401 })
    }

    const token = await createSessionToken(sessionSecret)

    const response = NextResponse.json({ success: true })
    response.cookies.set('crescent_admin_session', token, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    })

    return response
  } catch (error) {
    console.error('Admin login error:', error)
    return NextResponse.json({ error: 'Something went wrong.' }, { status: 500 })
  }
}