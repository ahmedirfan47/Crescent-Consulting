'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Sparkles, ExternalLink, RotateCcw } from 'lucide-react'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

const STORAGE_KEY = 'crescent_chat_history_v1'

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm the Crescent Consulting AI Assistant. I can answer questions about our services, industries, process, and how to get started — or connect you with our team. How can I help today?",
}

const QUICK_REPLIES = [
  'What services do you offer?',
  'Which industries do you work with?',
  'How does your process work?',
  'I want to book a consultation',
]

const ESCALATION_KEYWORDS = [
  'human', 'agent', 'representative', 'real person',
  'talk to someone', 'speak to someone', 'speak with someone',
]

const WHATSAPP_LINK = 'https://wa.me/923235663592'

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

function containsEscalationIntent(text: string): boolean {
  const lower = text.toLowerCase()
  return ESCALATION_KEYWORDS.some((k) => lower.includes(k))
}

function TypingIndicator() {
  return (
    <div style={{ display: 'flex', gap: '4px', padding: '4px 2px' }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2, ease: 'easeInOut' }}
          style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--text-subtle)' }}
        />
      ))}
    </div>
  )
}

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([GREETING])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [showEscalation, setShowEscalation] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Load saved conversation on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: ChatMessage[] = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setMessages(parsed)
          if (parsed.some((m) => m.role === 'user' && containsEscalationIntent(m.content))) {
            setShowEscalation(true)
          }
        }
      }
    } catch {
      // Corrupted or unavailable storage — start fresh, non-critical.
    }
  }, [])

  // Persist conversation (last 30 messages)
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)))
    } catch {
      // Storage unavailable — non-critical, chat still works for this session.
    }
  }, [messages])

  // Auto-scroll to latest message
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading, open])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    if (containsEscalationIntent(trimmed)) {
      setShowEscalation(true)
    }

    const nextMessages: ChatMessage[] = [...messages, { role: 'user', content: trimmed }]
    setMessages(nextMessages)
    setInput('')
    setError(null)
    setLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextMessages.slice(-20) }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.error || 'Something went wrong. Please try again or contact us on WhatsApp.')
        setShowEscalation(true)
        return
      }

      setMessages((prev) => [...prev, { role: 'assistant', content: data.reply }])

      if (containsEscalationIntent(data.reply)) {
        setShowEscalation(true)
      }
    } catch {
      setError('Connection issue. Please try again or contact us on WhatsApp.')
      setShowEscalation(true)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const resetChat = () => {
    setMessages([GREETING])
    setShowEscalation(false)
    setError(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch {
      // non-critical
    }
  }

  return (
    <>
      {/* Floating button */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.2, duration: 0.4, ease: 'easeOut' }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        aria-label={open ? 'Close chat' : 'Open chat'}
        style={{
          position: 'fixed',
          bottom: '28px',
          right: '28px',
          zIndex: 100,
          width: '58px',
          height: '58px',
          borderRadius: '50%',
          background: 'linear-gradient(145deg, #0A5C38, #073D27)',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 6px 24px rgba(10,92,56,0.35)',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex' }}
            >
              <X size={24} color="#FFFFFF" />
            </motion.span>
          ) : (
            <motion.span
              key="open"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.18 }}
              style={{ display: 'flex' }}
            >
              <MessageCircle size={24} color="#FFFFFF" />
            </motion.span>
          )}
        </AnimatePresence>

        {!open && (
          <span
            style={{
              position: 'absolute',
              top: '-2px',
              right: '-2px',
              width: '14px',
              height: '14px',
              borderRadius: '50%',
              background: '#22C55E',
              border: '2px solid #FFFFFF',
            }}
          />
        )}
      </motion.button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.22, ease }}
            style={{
              position: 'fixed',
              bottom: '98px',
              right: '20px',
              left: '20px',
              zIndex: 99,
              maxWidth: '380px',
              width: 'calc(100% - 40px)',
              height: 'min(600px, calc(100vh - 150px))',
              marginLeft: 'auto',
              background: '#FFFFFF',
              borderRadius: '18px',
              boxShadow: '0 24px 64px rgba(10,26,18,0.22)',
              border: '1px solid var(--border)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div
              style={{
                padding: '16px 18px',
                background: 'linear-gradient(135deg, #0A5C38, #073D27)',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                flexShrink: 0,
              }}
            >
              <div
                style={{
                  width: '38px',
                  height: '38px',
                  borderRadius: '10px',
                  background: 'rgba(255,255,255,0.12)',
                  border: '1px solid rgba(255,255,255,0.2)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}
              >
                <Sparkles size={18} color="#FFFFFF" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    color: '#FFFFFF',
                    fontFamily: 'Syne, sans-serif',
                    fontWeight: 700,
                    fontSize: '14.5px',
                    letterSpacing: '-0.01em',
                  }}
                >
                  Crescent AI Assistant
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <span
                    style={{
                      width: '7px',
                      height: '7px',
                      borderRadius: '50%',
                      background: '#4ADE80',
                      display: 'inline-block',
                    }}
                  />
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11.5px' }}>
                    Online · Replies instantly
                  </span>
                </div>
              </div>
              <button
                onClick={resetChat}
                aria-label="Reset conversation"
                style={{
                  background: 'rgba(255,255,255,0.1)',
                  border: 'none',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  flexShrink: 0,
                }}
              >
                <RotateCcw size={14} color="#FFFFFF" />
              </button>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '18px',
                display: 'flex',
                flexDirection: 'column',
                gap: '12px',
                background: 'var(--bg-warm)',
              }}
            >
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  style={{
                    alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start',
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background: m.role === 'user' ? 'var(--brand)' : '#FFFFFF',
                    color: m.role === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                    border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                    fontSize: '13.5px',
                    lineHeight: 1.6,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {/* Rendered as plain text — never use dangerouslySetInnerHTML with AI output */}
                  {m.content}
                </motion.div>
              ))}

              {loading && (
                <div
                  style={{
                    alignSelf: 'flex-start',
                    padding: '10px 14px',
                    borderRadius: '14px 14px 14px 4px',
                    background: '#FFFFFF',
                    border: '1px solid var(--border)',
                  }}
                >
                  <TypingIndicator />
                </div>
              )}

              {error && (
                <div style={{ fontSize: '12.5px', color: '#DC2626', padding: '4px 2px' }}>{error}</div>
              )}

              {/* Quick replies — only at conversation start */}
              {messages.length === 1 && !loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      style={{
                        textAlign: 'left',
                        padding: '9px 13px',
                        borderRadius: '10px',
                        border: '1px solid var(--border)',
                        background: '#FFFFFF',
                        color: 'var(--brand)',
                        fontSize: '12.5px',
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = 'var(--brand-light)'
                      }}
                      onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF'
                      }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Human handoff banner */}
              {showEscalation && (
                <motion.a
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  href={WHATSAPP_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '8px',
                    padding: '12px 14px',
                    borderRadius: '12px',
                    background: 'var(--gold-pale)',
                    border: '1px solid rgba(184,150,46,0.3)',
                    textDecoration: 'none',
                    marginTop: '4px',
                  }}
                >
                  <div>
                    <div style={{ fontSize: '12.5px', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '2px' }}>
                      Want to talk to our team directly?
                    </div>
                    <div style={{ fontSize: '11.5px', color: 'var(--text-muted)' }}>
                      Continue this conversation on WhatsApp
                    </div>
                  </div>
                  <ExternalLink size={15} color="var(--gold)" style={{ flexShrink: 0 }} />
                </motion.a>
              )}
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              style={{
                display: 'flex',
                gap: '8px',
                padding: '12px',
                borderTop: '1px solid var(--border)',
                background: '#FFFFFF',
                flexShrink: 0,
              }}
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our services, process, pricing..."
                maxLength={1000}
                disabled={loading}
                style={{
                  flex: 1,
                  padding: '11px 14px',
                  borderRadius: '10px',
                  border: '1px solid var(--border)',
                  background: 'var(--bg-warm)',
                  fontSize: '13.5px',
                  outline: 'none',
                  color: 'var(--text-primary)',
                }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '10px',
                  flexShrink: 0,
                  background: 'var(--brand)',
                  border: 'none',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: loading || !input.trim() ? 0.5 : 1,
                }}
              >
                <Send size={16} color="#FFFFFF" />
              </button>
            </form>

            {/* Footer note */}
            <div
              style={{
                padding: '8px 14px 12px',
                fontSize: '10.5px',
                color: 'var(--text-subtle)',
                textAlign: 'center',
                background: '#FFFFFF',
              }}
            >
              AI assistant · For complex requests, our team will follow up personally
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}