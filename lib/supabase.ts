// Thin REST wrapper around Supabase's PostgREST API for logging and
// retrieving chatbot conversations. Uses fetch directly and the
// service_role key — server-side only, never expose it to the client.

const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

export interface ChatLogMessage {
  role: string
  content: string
}

export interface ChatLogRecord {
  id: string
  conversation_id: string
  messages: ChatLogMessage[]
  message_count: number
  escalated: boolean
  ip_hash: string | null
  created_at: string
  updated_at: string
}

export function isSupabaseConfigured(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_SERVICE_ROLE_KEY)
}

function authHeaders(extra: Record<string, string> = {}): Record<string, string> {
  return {
    apikey: SUPABASE_SERVICE_ROLE_KEY as string,
    Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
    ...extra,
  }
}

/**
 * Inserts or updates a conversation log keyed by conversation_id.
 * IMPORTANT: this REPLACES the entire `messages` column on conflict
 * (PostgREST merge-duplicates does not deep-merge jsonb). Callers must
 * always pass the complete intended message history — use getChatLog()
 * first and append, never call this with a partial/windowed array.
 */
export async function upsertChatLog(payload: {
  conversation_id: string
  messages: ChatLogMessage[]
  escalated: boolean
  ip_hash: string
}): Promise<void> {
  if (!isSupabaseConfigured()) return

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/chat_logs?on_conflict=conversation_id`, {
      method: 'POST',
      headers: authHeaders({
        'Content-Type': 'application/json',
        Prefer: 'resolution=merge-duplicates,return=minimal',
      }),
      body: JSON.stringify([
        {
          conversation_id: payload.conversation_id,
          messages: payload.messages,
          message_count: payload.messages.length,
          escalated: payload.escalated,
          ip_hash: payload.ip_hash,
          updated_at: new Date().toISOString(),
        },
      ]),
    })

    if (!res.ok) {
      console.error('Supabase upsertChatLog failed:', res.status, await res.text())
    }
  } catch (error) {
    console.error('Supabase upsertChatLog error:', error)
  }
}

/** Fetches a single conversation by its conversation_id, or null if not found. */
export async function getChatLog(conversationId: string): Promise<ChatLogRecord | null> {
  if (!isSupabaseConfigured()) return null

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/chat_logs?conversation_id=eq.${encodeURIComponent(conversationId)}&select=*&limit=1`,
      { headers: authHeaders(), cache: 'no-store' }
    )
    if (!res.ok) {
      console.error('Supabase getChatLog failed:', res.status, await res.text())
      return null
    }
    const rows = (await res.json()) as ChatLogRecord[]
    return rows[0] ?? null
  } catch (error) {
    console.error('Supabase getChatLog error:', error)
    return null
  }
}

/** Fetches the most recently updated conversations, newest first. */
export async function fetchChatLogs(limit = 100): Promise<ChatLogRecord[]> {
  if (!isSupabaseConfigured()) return []

  try {
    const res = await fetch(
      `${SUPABASE_URL}/rest/v1/chat_logs?select=*&order=updated_at.desc&limit=${limit}`,
      { headers: authHeaders(), cache: 'no-store' }
    )
    if (!res.ok) {
      console.error('Supabase fetchChatLogs failed:', res.status, await res.text())
      return []
    }
    return (await res.json()) as ChatLogRecord[]
  } catch (error) {
    console.error('Supabase fetchChatLogs error:', error)
    return []
  }
}

async function countLogs(extraFilter: string): Promise<number> {
  if (!isSupabaseConfigured()) return 0

  try {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/chat_logs?select=id${extraFilter}`, {
      method: 'GET',
      headers: authHeaders({ Prefer: 'count=exact', Range: '0-0' }),
      cache: 'no-store',
    })
    const range = res.headers.get('content-range')
    if (!range) return 0
    const total = range.split('/')[1]
    return total ? parseInt(total, 10) || 0 : 0
  } catch (error) {
    console.error('Supabase countLogs error:', error)
    return 0
  }
}

/** Returns total, escalated, and today's conversation counts. */
export async function fetchChatStats(): Promise<{ total: number; escalated: number; today: number }> {
  const startOfToday = new Date()
  startOfToday.setHours(0, 0, 0, 0)

  const [total, escalated, today] = await Promise.all([
    countLogs(''),
    countLogs('&escalated=eq.true'),
    countLogs(`&created_at=gte.${encodeURIComponent(startOfToday.toISOString())}`),
  ])

  return { total, escalated, today }
}