import { NextResponse } from 'next/server'
import { fetchChatLogs, fetchChatStats, isSupabaseConfigured } from '@/lib/supabase'

// Protected by middleware.ts — only reached with a valid admin session.
export async function GET() {
  if (!isSupabaseConfigured()) {
    return NextResponse.json(
      { error: 'Database is not configured. Add SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.' },
      { status: 500 }
    )
  }

  const [conversations, stats] = await Promise.all([fetchChatLogs(100), fetchChatStats()])

  return NextResponse.json({ conversations, stats })
}