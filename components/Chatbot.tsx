'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  MessageCircle, X, Send, Sparkles, RotateCcw,
  User, Mail, Phone, MessageSquare, ChevronRight,
} from 'lucide-react'
import { containsEscalationIntent } from '@/lib/escalation'

type SuggestedSection = 'services' | 'industries' | 'about' | 'insights' | 'contact'

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  suggestions?: SuggestedSection[]
}

const STORAGE_KEY = 'crescent_chat_history_v2'
const CONVERSATION_ID_KEY = 'crescent_chat_conversation_id_v1'
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/xdajvbrl'

const GREETING: ChatMessage = {
  role: 'assistant',
  content:
    "Hi! I'm the Crescent Consulting AI Assistant. I can answer questions about our services, industries, process, and how to get started. How can I help today?",
}

const QUICK_REPLIES = [
  'What services do you offer?',
  'Which industries do you work with?',
  'How does your process work?',
  'Talk to our team',
]

const SECTION_LABELS: Record<SuggestedSection, string> = {
  services: 'View Services',
  industries: 'Industries We Serve',
  about: 'About Crescent',
  insights: 'Read Insights',
  contact: 'Book a Consultation',
}

const ease: [number, number, number, number] = [0.22, 1, 0.36, 1]

function getOrCreateConversationId(): string {
  try {
    const existing = localStorage.getItem(CONVERSATION_ID_KEY)
    if (existing) return existing
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `conv_${Date.now()}_${Math.random().toString(36).slice(2)}`
    localStorage.setItem(CONVERSATION_ID_KEY, id)
    return id
  } catch {
    return `conv_${Date.now()}_${Math.random().toString(36).slice(2)}`
  }
}

function scrollToSection(id: SuggestedSection) {
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
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

  const [showLeadForm, setShowLeadForm] = useState(false)
  const [leadName, setLeadName] = useState('')
  const [leadEmail, setLeadEmail] = useState('')
  const [leadPhone, setLeadPhone] = useState('')
  const [leadNote, setLeadNote] = useState('')
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadError, setLeadError] = useState<string | null>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const conversationIdRef = useRef<string>('')

  useEffect(() => {
    conversationIdRef.current = getOrCreateConversationId()
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed: ChatMessage[] = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed)
      }
    } catch {
      // Corrupted or unavailable storage — start fresh, non-critical.
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)))
    } catch {
      // non-critical
    }
  }, [messages])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, loading, open, showLeadForm])

  const sendMessage = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed || loading) return

    if (containsEscalationIntent(trimmed)) {
      setShowLeadForm(true)
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
        body: JSON.stringify({
          messages: nextMessages.slice(-20).map(({ role, content }) => ({ role, content })),
          conversationId: conversationIdRef.current,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data?.error || 'Something went wrong. Please try again.')
        return
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.reply, suggestions: data.suggestedSections || [] },
      ])

      if (data.offerLeadForm) setShowLeadForm(true)
    } catch {
      setError('Connection issue. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(input)
  }

  const openLeadFormDirectly = () => {
    setMessages((prev) => [
      ...prev,
      {
        role: 'assistant',
        content: "Of course — please share your details below and our team will follow up directly.",
      },
    ])
    setShowLeadForm(true)
  }

  const handleQuickReply = (q: string) => {
    if (q === 'Talk to our team') {
      openLeadFormDirectly()
      return
    }
    sendMessage(q)
  }

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (leadName.trim().length < 2) {
      setLeadError('Please enter your name.')
      return
    }
    if (!leadEmail.trim() && !leadPhone.trim()) {
      setLeadError('Please provide an email or phone number.')
      return
    }

    setLeadSubmitting(true)
    setLeadError(null)

    try {
      const formspreeRes = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          Source: 'Crescent AI Chatbot',
          'Full Name': leadName.trim(),
          Email: leadEmail.trim() || 'Not provided',
          'Phone / WhatsApp': leadPhone.trim() || 'Not provided',
          Message: leadNote.trim() || 'No additional message',
        }),
      })

      if (!formspreeRes.ok) {
        setLeadError('Could not submit your details. Please try again.')
        setLeadSubmitting(false)
        return
      }

      // Best-effort, non-blocking — failure here doesn't affect the success state.
      fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversationIdRef.current,
          name: leadName.trim(),
          email: leadEmail.trim(),
          phone: leadPhone.trim(),
          note: leadNote.trim(),
        }),
      }).catch(() => {})

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Thanks, ${leadName.trim()}! We've received your details and our team will follow up within 24 hours.`,
        },
      ])
      setShowLeadForm(false)
      setLeadName('')
      setLeadEmail('')
      setLeadPhone('')
      setLeadNote('')
    } catch {
      setLeadError('Connection issue. Please try again.')
    } finally {
      setLeadSubmitting(false)
    }
  }

  const resetChat = () => {
    setMessages([GREETING])
    setShowLeadForm(false)
    setError(null)
    setLeadError(null)
    try {
      localStorage.removeItem(STORAGE_KEY)
      localStorage.removeItem(CONVERSATION_ID_KEY)
      conversationIdRef.current = getOrCreateConversationId()
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
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 100,
          width: '58px', height: '58px', borderRadius: '50%',
          background: 'linear-gradient(145deg, #0A5C38, #073D27)',
          border: 'none', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 6px 24px rgba(10,92,56,0.35)',
        }}
      >
        <AnimatePresence mode="wait" initial={false}>
          {open ? (
            <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }} style={{ display: 'flex' }}>
              <X size={24} color="#FFFFFF" />
            </motion.span>
          ) : (
            <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }} style={{ display: 'flex' }}>
              <MessageCircle size={24} color="#FFFFFF" />
            </motion.span>
          )}
        </AnimatePresence>
        {!open && (
          <span style={{ position: 'absolute', top: '-2px', right: '-2px', width: '14px', height: '14px', borderRadius: '50%', background: '#22C55E', border: '2px solid #FFFFFF' }} />
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
              position: 'fixed', bottom: '98px', right: '20px', left: '20px', zIndex: 99,
              maxWidth: '380px', width: 'calc(100% - 40px)', height: 'min(620px, calc(100vh - 150px))',
              marginLeft: 'auto', background: '#FFFFFF', borderRadius: '18px',
              boxShadow: '0 24px 64px rgba(10,26,18,0.22)', border: '1px solid var(--border)',
              display: 'flex', flexDirection: 'column', overflow: 'hidden',
            }}
          >
            {/* Header */}
            <div style={{ padding: '16px 18px', background: 'linear-gradient(135deg, #0A5C38, #073D27)', display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: 'rgba(255,255,255,0.12)', border: '1px solid rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Sparkles size={18} color="#FFFFFF" />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: '#FFFFFF', fontFamily: 'Syne, sans-serif', fontWeight: 700, fontSize: '14.5px', letterSpacing: '-0.01em' }}>
                  Crescent AI Assistant
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#4ADE80', display: 'inline-block' }} />
                  <span style={{ color: 'rgba(255,255,255,0.65)', fontSize: '11.5px' }}>Online · Replies instantly</span>
                </div>
              </div>
              <button onClick={resetChat} aria-label="Reset conversation" style={{ background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '8px', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', flexShrink: 0 }}>
                <RotateCcw size={14} color="#FFFFFF" />
              </button>
            </div>

            {/* Messages */}
            <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px', background: 'var(--bg-warm)' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start', gap: '8px' }}>
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25 }}
                    style={{
                      maxWidth: '85%', padding: '10px 14px',
                      borderRadius: m.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                      background: m.role === 'user' ? 'var(--brand)' : '#FFFFFF',
                      color: m.role === 'user' ? '#FFFFFF' : 'var(--text-primary)',
                      border: m.role === 'user' ? 'none' : '1px solid var(--border)',
                      fontSize: '13.5px', lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                    }}
                  >
                    {m.content}
                  </motion.div>

                  {m.role === 'assistant' && m.suggestions && m.suggestions.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', maxWidth: '85%' }}>
                      {m.suggestions.map((s) => (
                        <button
                          key={s}
                          onClick={() => scrollToSection(s)}
                          style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            padding: '6px 12px', borderRadius: '999px',
                            border: '1px solid rgba(10,92,56,0.25)', background: 'var(--brand-light)',
                            color: 'var(--brand)', fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                          }}
                        >
                          {SECTION_LABELS[s]}
                          <ChevronRight size={12} />
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {loading && (
                <div style={{ alignSelf: 'flex-start', padding: '10px 14px', borderRadius: '14px 14px 14px 4px', background: '#FFFFFF', border: '1px solid var(--border)' }}>
                  <TypingIndicator />
                </div>
              )}

              {error && <div style={{ fontSize: '12.5px', color: '#DC2626', padding: '4px 2px' }}>{error}</div>}

              {messages.length === 1 && !loading && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '4px' }}>
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => handleQuickReply(q)}
                      style={{
                        textAlign: 'left', padding: '9px 13px', borderRadius: '10px',
                        border: '1px solid var(--border)', background: '#FFFFFF', color: 'var(--brand)',
                        fontSize: '12.5px', fontWeight: 500, cursor: 'pointer', transition: 'background 0.2s',
                      }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = 'var(--brand-light)' }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = '#FFFFFF' }}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}

              {/* Inline lead capture — stays entirely on the website */}
              {showLeadForm && (
                <motion.form
                  onSubmit={handleLeadSubmit}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  style={{
                    background: '#FFFFFF', border: '1px solid var(--border)', borderRadius: '14px',
                    padding: '16px', display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--text-primary)' }}>
                      Let's connect you with our team
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowLeadForm(false)}
                      aria-label="Dismiss"
                      style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-subtle)', padding: '2px' }}
                    >
                      <X size={14} />
                    </button>
                  </div>

                  <div style={{ position: 'relative' }}>
                    <User size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                    <input
                      value={leadName}
                      onChange={(e) => setLeadName(e.target.value)}
                      placeholder="Your name"
                      maxLength={120}
                      style={{ width: '100%', padding: '9px 10px 9px 30px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Mail size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                    <input
                      type="email"
                      value={leadEmail}
                      onChange={(e) => setLeadEmail(e.target.value)}
                      placeholder="Email address"
                      maxLength={200}
                      style={{ width: '100%', padding: '9px 10px 9px 30px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <Phone size={13} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-subtle)' }} />
                    <input
                      value={leadPhone}
                      onChange={(e) => setLeadPhone(e.target.value)}
                      placeholder="Phone number (optional if email given)"
                      maxLength={60}
                      style={{ width: '100%', padding: '9px 10px 9px 30px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none' }}
                    />
                  </div>

                  <div style={{ position: 'relative' }}>
                    <MessageSquare size={13} style={{ position: 'absolute', left: '10px', top: '12px', color: 'var(--text-subtle)' }} />
                    <textarea
                      value={leadNote}
                      onChange={(e) => setLeadNote(e.target.value)}
                      placeholder="Anything specific we should know? (optional)"
                      maxLength={500}
                      rows={2}
                      style={{ width: '100%', padding: '9px 10px 9px 30px', borderRadius: '8px', border: '1px solid var(--border)', fontSize: '13px', outline: 'none', resize: 'none' }}
                    />
                  </div>

                  {leadError && <div style={{ fontSize: '12px', color: '#DC2626' }}>{leadError}</div>}

                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    style={{
                      width: '100%', padding: '10px', borderRadius: '8px', border: 'none',
                      background: 'var(--brand)', color: '#FFFFFF', fontSize: '13px', fontWeight: 600,
                      cursor: leadSubmitting ? 'not-allowed' : 'pointer', opacity: leadSubmitting ? 0.7 : 1,
                    }}
                  >
                    {leadSubmitting ? 'Sending...' : 'Send My Details'}
                  </button>
                </motion.form>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '8px', padding: '12px', borderTop: '1px solid var(--border)', background: '#FFFFFF', flexShrink: 0 }}>
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about our services, process, pricing..."
                maxLength={1000}
                disabled={loading}
                style={{ flex: 1, padding: '11px 14px', borderRadius: '10px', border: '1px solid var(--border)', background: 'var(--bg-warm)', fontSize: '13.5px', outline: 'none', color: 'var(--text-primary)' }}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                aria-label="Send message"
                style={{
                  width: '42px', height: '42px', borderRadius: '10px', flexShrink: 0,
                  background: 'var(--brand)', border: 'none',
                  cursor: loading || !input.trim() ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: loading || !input.trim() ? 0.5 : 1,
                }}
              >
                <Send size={16} color="#FFFFFF" />
              </button>
            </form>

            <div style={{ padding: '8px 14px 12px', fontSize: '10.5px', color: 'var(--text-subtle)', textAlign: 'center', background: '#FFFFFF' }}>
              AI assistant · For complex requests, our team will follow up directly
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}