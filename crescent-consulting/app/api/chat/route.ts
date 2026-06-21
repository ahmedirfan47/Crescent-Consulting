import { NextRequest, NextResponse } from 'next/server'
import { SYSTEM_PROMPT } from '@/lib/knowledgeBase'
import { checkRateLimit } from '@/lib/rateLimit'
import { containsEscalationIntent } from '@/lib/escalation'
import { parseDirectives } from '@/lib/chatDirectives'
import { hashString } from '@/lib/crypto'
import { getChatLog, upsertChatLog } from '@/lib/supabase'

const MAX_MESSAGE_LENGTH = 1000
const MAX_MESSAGES = 20
const MAX_STORED_MESSAGES = 200

interface IncomingMessage {
  role?: string
  content?: string
}

export async function POST(req: NextRequest) {
  try {
    const origin = req.headers.get('origin')
    const host = req.headers.get('host') || ''
    if (origin && !origin.includes(host)) {
      return NextResponse.json({ error: 'Invalid request origin.' }, { status: 403 })
    }

    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown'
    const { allowed } = checkRateLimit(ip)
    if (!allowed) {
      return NextResponse.json(
        { error: 'Too many messages. Please wait a few minutes and try again.' },
        { status: 429 }
      )
    }

    const body = await req.json().catch(() => null)
    const incoming = body?.messages as IncomingMessage[] | undefined
    const conversationId: string | undefined =
      typeof body?.conversationId === 'string' && body.conversationId.length <= 100
        ? body.conversationId
        : undefined

    if (!Array.isArray(incoming) || incoming.length === 0) {
      return NextResponse.json({ error: 'Invalid request format.' }, { status: 400 })
    }

    if (incoming.length > MAX_MESSAGES) {
      return NextResponse.json(
        { error: 'This conversation has gotten long. Please start a new chat.' },
        { status: 400 }
      )
    }

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

    if (!process.env.OPENAI_API_KEY) {
      console.error('OPENAI_API_KEY is not set.')
      return NextResponse.json(
        { error: 'Chat is temporarily unavailable. Please try again shortly.' },
        { status: 500 }
      )
    }

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
        { error: 'Our assistant is having trouble responding. Please try again.' },
        { status: 502 }
      )
    }

    const data = await response.json()
    const rawReply: string | undefined = data?.choices?.[0]?.message?.content?.trim()

    if (!rawReply) {
      return NextResponse.json({ error: 'No response generated. Please try again.' }, { status: 502 })
    }

    const { cleanText, offerLeadForm, suggestedSections } = parseDirectives(rawReply)

    if (conversationId) {
      logConversationTurn({
        conversationId,
        latestUserMessage: sanitized[sanitized.length - 1],
        assistantReply: cleanText,
        offerLeadForm,
        ip,
      }).catch((e) => console.error('Chat log turn failed:', e))
    }

    return NextResponse.json({ reply: cleanText, offerLeadForm, suggestedSections })
  } catch (error) {
    console.error('Chat API unexpected error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}

/**
 * Appends exactly one new user/assistant turn to the conversation's stored
 * history. Always fetches the existing record first and appends — never
 * overwrites — because Supabase's upsert (merge-duplicates) replaces the
 * entire `messages` column on conflict rather than deep-merging it.
 */
async function logConversationTurn(params: {
  conversationId: string
  latestUserMessage: { role: 'user' | 'assistant'; content: string }
  assistantReply: string
  offerLeadForm: boolean
  ip: string
}) {
  const { conversationId, latestUserMessage, assistantReply, offerLeadForm, ip } = params

  const existing = await getChatLog(conversationId)
  const priorMessages = existing?.messages ?? []

  const mergedMessages = [
    ...priorMessages,
    latestUserMessage,
    { role: 'assistant' as const, content: assistantReply },
  ].slice(-MAX_STORED_MESSAGES)

  const escalated =
    Boolean(existing?.escalated) || offerLeadForm || containsEscalationIntent(latestUserMessage.content)

  const ipHash = await hashString(ip)

  await upsertChatLog({
    conversation_id: conversationId,
    messages: mergedMessages,
    escalated,
    ip_hash: ipHash,
  })
}