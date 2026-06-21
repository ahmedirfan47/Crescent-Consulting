import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit } from '@/lib/rateLimit'
import { getChatLog, upsertChatLog } from '@/lib/supabase'

const MAX_FIELD_LENGTH = 300
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const LEAD_RATE_LIMIT = 5 // stricter than the chat endpoint — prevents spam submissions

function clean(value: unknown, maxLen = MAX_FIELD_LENGTH): string {
  if (typeof value !== 'string') return ''
  return value
    .slice(0, maxLen)
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
    .trim()
}

// Best-effort logging only — the visitor-facing email notification is sent
// directly from the browser to Formspree (same proven pattern as the main
// consultation form), so a failure here never blocks the success state.
export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin')
    const host = req.headers.get('host') || ''
    if (origin && !origin.includes(host)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(`lead-${ip}`, LEAD_RATE_LIMIT)
    if (!allowed) {
      return NextResponse.json({ error: 'Too many requests. Please wait and try again.' }, { status: 429 })
    }

    const body = await req.json().catch(() => null)

    const name = clean(body?.name, 120)
    const email = clean(body?.email, 200)
    const phone = clean(body?.phone, 60)
    const note = clean(body?.note, 500)
    const conversationId =
      typeof body?.conversationId === 'string' && body.conversationId.length <= 100
        ? body.conversationId
        : undefined

    if (name.length < 2) {
      return NextResponse.json({ error: 'Please enter your name.' }, { status: 400 })
    }
    if (!email && !phone) {
      return NextResponse.json({ error: 'Please provide an email or phone number.' }, { status: 400 })
    }
    if (email && !EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: 'Please enter a valid email address.' }, { status: 400 })
    }

    if (conversationId) {
      try {
        const existing = await getChatLog(conversationId)
        const priorMessages = existing?.messages ?? []
        const summary = `Visitor submitted contact details — Name: ${name}${
          email ? `, Email: ${email}` : ''
        }${phone ? `, Phone: ${phone}` : ''}${note ? `, Note: ${note}` : ''}`

        await upsertChatLog({
          conversation_id: conversationId,
          messages: [...priorMessages, { role: 'user', content: summary }].slice(-200),
          escalated: true,
          ip_hash: existing?.ip_hash ?? '',
        })
      } catch (e) {
        console.error('Lead conversation log failed:', e)
      }
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Lead API unexpected error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}