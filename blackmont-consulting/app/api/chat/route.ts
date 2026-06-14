import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/knowledgeBase'
import { checkRateLimit } from '@/lib/rateLimit'

const MAX_MESSAGE_LENGTH = 1000
const MAX_MESSAGES = 20

interface IncomingMessage {
  role?: string
  content?: string
}

export async function POST(req: NextRequest) {
  try {
    // ── Basic CSRF mitigation: reject cross-origin requests when an Origin header is present ──
    const origin = req.headers.get('origin')
    const host = req.headers.get('host') || ''
    if (origin && !origin.includes(host)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
    }

    // ── Rate limiting by IP ──
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a few minutes or contact us on WhatsApp.' },
        { status: 429 }
      )
    }

    // ── Parse and validate body ──
    const body = await req.json().catch(() => null)
    const incoming = body?.messages as IncomingMessage[] | undefined

    if (!Array.isArray(incoming) || incoming.length === 0) {
      return NextResponse.json({ error: 'Invalid request format.' }, { status: 400 })
    }

    if (incoming.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: 'This conversation has gotten long. Please start a new chat or contact us on WhatsApp.' },
        { status: 400 }
      )
    }

    // ── Sanitize: strict allow-list of roles, strip control characters, cap length ──
    const sanitized = incoming
      .filter(
        (m): m is { role: 'user' | 'assistant'; content: string } =>
          !!m &&
          (m.role === 'user' || m.role === 'assistant') &&
          typeof m.content === 'string' &&
          m.content.trim().length > 0
      )
      .map((m) => ({
        role: m.role,
        content: m.content
          .slice(0, MAX_MESSAGE_LENGTH)
          // eslint-disable-next-line no-control-regex
          .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, '')
          .trim(),
      }))

    if (sanitized.length === 0) {
      return NextResponse.json({ error: 'Invalid message content.' }, { status: 400 })
    }

    // ── Ensure the API key is configured ──
    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set.')
      return NextResponse.json(
        { error: 'Chat is temporarily unavailable. Please reach us on WhatsApp.' },
        { status: 500 }
      )
    }

    // ── Call the LLM ──
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...sanitized],
        temperature: 0.4,
        max_tokens: 400,
      }),
    })

    if (!response.ok) {
      const errText = await response.text()
      console.error('OpenAI API error:', response.status, errText)
      return NextResponse.json(
        { error: 'Our AI assistant is having trouble responding. Please try again or contact us on WhatsApp.' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const reply: string | undefined = data?.choices?.[0]?.message?.content?.trim()

    if (!reply) {
      return NextResponse.json(
        { error: 'No response generated. Please try again.' },
        { status: 502 }
      )
    }

    return NextResponse.json({ reply })
  } catch (error) {
    console.error('Chat API unexpected error:', error)
    return NextResponse.json(
      { error: 'Something went wrong. Please try again or contact us on WhatsApp.' },
      { status: 500 }
    )
  }
}