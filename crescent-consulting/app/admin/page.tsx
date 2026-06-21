'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import {
  MessageSquare, AlertTriangle, Calendar, LogOut, RefreshCw, Search, X, ChevronRight,
} from 'lucide-react'
import { formatRelativeTime } from '@/lib/formatTime'
import type { ChatLogRecord } from '@/lib/supabase'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

export default function AdminDashboard() {
  const router = useRouter()
  const [conversations, setConversations] = useState<ChatLogRecord[]>([])
  const [stats, setStats] = useState({ total: 0, escalated: 0, today: 0 })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [filterEscalated, setFilterEscalated] = useState(false)
  const [selected, setSelected] = useState<ChatLogRecord | null>(null)

  const loadData = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/admin/conversations', { cache: 'no-store' })
      const data = await res.json()

      if (!res.ok) {
        setError(data?.error || 'Failed to load conversations.')
        return
      }

      setConversations(data.conversations || [])
      setStats(data.stats || { total: 0, escalated: 0, today: 0 })
    } catch {
      setError('Connection error while loading conversations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
    router.refresh()
  }

  const filtered = conversations.filter((c) => {
    if (filterEscalated && !c.escalated) return false
    if (!search.trim()) return true

    const lower = search.toLowerCase()
    return c.messages.some((m) => m.content.toLowerCase().includes(lower))
  })

  return (
    <main style={{ minHeight: '100vh', background: 'var(--bg-warm)' }}>
      {/* Header */}
      <div style={{ background: '#FFFFFF', borderBottom: '1px solid var(--border)' }}>
        <div className="wrap" style={{ padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h1 style={{ fontSize: '22px', marginBottom: '2px' }}>Chatbot Dashboard</h1>
              <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>Crescent Consulting — AI Assistant Conversations</p>
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button onClick={loadData} className="btn-secondary" style={{ fontSize: '13px' }}>
                <RefreshCw size={14} />
                Refresh
              </button>
              <button onClick={handleLogout} className="btn-ghost" style={{ fontSize: '13px' }}>
                <LogOut size={14} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="wrap" style={{ padding: '28px 24px 64px' }}>
        {error && (
          <div
            style={{
              padding: '14px 18px',
              borderRadius: '10px',
              background: '#FEF2F2',
              border: '1px solid #FECACA',
              color: '#DC2626',
              fontSize: '13.5px',
              marginBottom: '20px',
            }}
          >
            {error}
          </div>
        )}

        {/* Stats */}
        <div style={{ display: 'grid', gap: '14px', marginBottom: '28px' }} className="grid-cols-1 sm:grid-cols-3">
          {[
            { icon: MessageSquare, label: 'Total Conversations', value: stats.total, color: 'var(--brand)' },
            { icon: AlertTriangle, label: 'Escalated to Human', value: stats.escalated, color: 'var(--gold)' },
            { icon: Calendar, label: 'Started Today', value: stats.today, color: 'var(--brand)' },
          ].map((s, i) => {
            const Icon = s.icon
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
                className="card"
                style={{ padding: '20px' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div className="icon-box" style={{ width: '40px', height: '40px' }}>
                    <Icon size={18} color={s.color} />
                  </div>
                  <div>
                    <div style={{ fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: '24px', color: 'var(--text-primary)', lineHeight: 1 }}>
                      {loading ? '—' : s.value}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)', marginTop: '2px' }}>{s.label}</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        {/* Search + filter */}
        <div style={{ display: 'flex', gap: '10px', marginBottom: '16px', flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: '220px' }}>
            <Search size={15} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search conversation content..."
              className="form-input"
              style={{ paddingLeft: '36px' }}
            />
          </div>
          <button
            onClick={() => setFilterEscalated((v) => !v)}
            className={filterEscalated ? 'btn-primary' : 'btn-secondary'}
            style={{ fontSize: '13px' }}
          >
            <AlertTriangle size={14} />
            Escalated only
          </button>
        </div>

        {/* Conversations list */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>Loading conversations...</div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--text-muted)' }}>
            {conversations.length === 0
              ? 'No conversations yet. Once visitors use the chatbot, they will appear here.'
              : 'No conversations match your filters.'}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filtered.map((c) => {
              const lastMessage = c.messages[c.messages.length - 1]
              const firstUserMessage = c.messages.find((m) => m.role === 'user')

              return (
                <button
                  key={c.id}
                  onClick={() => setSelected(c)}
                  className="card-hover"
                  style={{
                    padding: '16px 18px',
                    textAlign: 'left',
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    background: '#FFFFFF',
                  }}
                >
                  <div className="icon-box" style={{ flexShrink: 0 }}>
                    <MessageSquare size={18} color="var(--brand)" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '13.5px', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {firstUserMessage ? truncate(firstUserMessage.content, 60) : 'New conversation'}
                      </span>
                      {c.escalated && (
                        <span className="badge-gold" style={{ fontSize: '9.5px' }}>
                          <AlertTriangle size={9} />
                          Escalated
                        </span>
                      )}
                    </div>
                    <div style={{ fontSize: '12.5px', color: 'var(--text-muted)' }}>
                      {lastMessage ? truncate(lastMessage.content, 90) : ''}
                    </div>
                  </div>
                  <div style={{ flexShrink: 0, textAlign: 'right', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-subtle)' }}>{formatRelativeTime(c.updated_at)}</div>
                      <div style={{ fontSize: '11.5px', color: 'var(--text-subtle)', marginTop: '2px' }}>
                        {c.message_count} messages
                      </div>
                    </div>
                    <ChevronRight size={16} color="var(--text-subtle)" />
                  </div>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Conversation detail modal */}
      {selected && (
        <div
          onClick={() => setSelected(null)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(12,26,18,0.5)',
            zIndex: 200,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '20px',
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.2, ease }}
            onClick={(e) => e.stopPropagation()}
            style={{
              background: '#FFFFFF',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '80vh',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '16px 20px',
                borderBottom: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ fontSize: '15px', fontWeight: 700, fontFamily: 'Syne, sans-serif' }}>Conversation Detail</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                  {selected.message_count} messages · {formatRelativeTime(selected.updated_at)}
                  {selected.escalated && (
                    <span style={{ marginLeft: '8px', color: 'var(--gold)', fontWeight: 600 }}>· Escalated</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => setSelected(null)}
                aria-label="Close"
                style={{ background: 'var(--bg-warm)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
              >
                <X size={16} />
              </button>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '10px', background: 'var(--bg-warm)' }}>
              {selected.messages.map((m, i) => (
                <div
                  key={i}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.role === 'user' ? 'var(--brand)' : '#FFFFFF',
                    color: m.role === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                    border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                    fontSize: '13px',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                  }}
                >
                  {m.content}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      )}
    </main>
  )
}

function truncate(text: string, max: number): string {
  return text.length > max ? `${text.slice(0, max)}…` : text
}