'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MessageCircle, X, Send, Loader2, Sparkles, RotateCcw } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content:
    "Hello! I'm Crescent's AI assistant. I can answer questions about our consulting services, industries we serve, our methodology, and help you determine if we're the right fit for your business. How can I help you today?",
  timestamp: new Date(),
};

const QUICK_SUGGESTIONS = [
  'What services do you offer?',
  'Which industries do you serve?',
  'How long does an engagement?',
  'Book a consultation',
];

// ─── Predefined Q&A ───────────────────────────────────────────────────────────

interface QAItem {
  keywords: string[];
  minScore: number;
  answer: string;
}

const PREDEFINED_QA: QAItem[] = [
  {
    keywords: ['service', 'offer', 'provide', 'capabilities', 'what you do', 'help with'],
    minScore: 1,
    answer: `Crescent Consulting offers 15+ specialized services across three practice areas:

Business Consulting:
- Business Strategy Consulting (6–12 weeks)
- Growth Strategy Development (4–8 weeks)
- Business Process Optimization (4–8 weeks)
- Operational Excellence Consulting (8–16 weeks)
- Organizational Development (6–12 weeks)
- Performance Improvement Consulting (4–10 weeks)

Technology & AI:
- AI Integration Consulting
- AI Workflow Design
- Business Process Automation
- Corporate Website Development
- Website Performance Optimization
- Website Analytics & Reporting

Operations:
- Logistics Process Improvement
- Systems Integration Consulting
- Technology Consulting

All engagements include hands-on implementation — not just reports. Minimum 4-week commitment.`,
  },
  {
    keywords: ['hour', 'open', 'available', 'working hours', 'office hours', 'time', 'schedule'],
    minScore: 1,
    answer: `Our team is available Monday to Friday, 9:00 AM – 6:00 PM (PKT, UTC+5).

For urgent matters, you can reach us via WhatsApp at +92 323 5663592 — we typically respond within a few hours even outside office hours.

You can also email us at contactahmadirfan66@gmail.com and we will get back to you within 24 hours on business days.`,
  },
  {
    keywords: ['contact', 'reach', 'email', 'phone', 'whatsapp', 'get in touch', 'talk', 'speak'],
    minScore: 1,
    answer: `You can reach Crescent Consulting through any of the following:

📧 Email: contactahmadirfan66@gmail.com
💬 WhatsApp: +92 323 5663592
📍 Location: Lahore, Pakistan

We respond to all inquiries within 24 hours on business days. For the fastest response, WhatsApp is recommended.`,
  },
  {
    keywords: ['location', 'where', 'based', 'office', 'lahore', 'pakistan', 'address', 'city'],
    minScore: 1,
    answer: `Crescent Consulting is headquartered in Lahore, Pakistan.

We currently serve clients across Pakistan and are actively expanding into GCC markets including Saudi Arabia, UAE, Qatar, Bahrain, Kuwait, and Oman.

All engagements can be conducted remotely or on-site depending on your preference and project requirements.`,
  },
  {
    keywords: ['what is crescent', 'who are you', 'about', 'company', 'firm', 'tell me about', 'crescent consulting'],
    minScore: 1,
    answer: `Crescent Consulting is a premium business consulting firm headquartered in Lahore, Pakistan, founded in 2024 by Ahmed Irfan.

We partner with ambitious organizations across Pakistan and the GCC to build stronger businesses through strategic consulting, AI integration, and operational transformation.

What makes us different:
- We implement strategies, not just recommend them
- AI and automation are embedded into every engagement
- Boutique approach — fewer clients, deeper attention
- Deep GCC market expertise
- World-class quality at competitive rates

Our mission is simple: deliver real results, not just reports.`,
  },
  {
    keywords: ['book', 'consultation', 'appointment', 'schedule', 'meeting', 'start', 'get started', 'free'],
    minScore: 1,
    answer: `Booking a free consultation with Crescent Consulting is simple:

Option 1 — Fill out the consultation form on our website (scroll to the Contact section) with your business details and goals.

Option 2 — WhatsApp us directly at +92 323 5663592

Option 3 — Email us at contactahmadirfan66@gmail.com

After submitting:
1. We review your request within 24 hours
2. A senior consultant contacts you to discuss
3. We schedule a focused discovery call
4. You receive a tailored proposal

The initial consultation is completely free with no obligation.`,
  },
  {
    keywords: ['technology', 'tech', 'tools', 'stack', 'platform', 'software', 'technologies'],
    minScore: 1,
    answer: `Crescent Consulting works with a wide range of technologies depending on your business needs:

Business Tools: ERP systems, CRM platforms, workflow automation tools, analytics dashboards, project management systems

AI & Automation: Custom AI integrations, process automation, intelligent workflow design, business intelligence systems

Web Technologies: Next.js, React, TypeScript, Tailwind CSS — for corporate website development projects

We are technology-agnostic — we recommend and implement the best tools for your specific industry and goals, not a one-size-fits-all solution.`,
  },
  {
    keywords: ['website', 'web', 'development', 'design', 'build', 'site', 'web dev'],
    minScore: 1,
    answer: `Yes, Crescent Consulting offers corporate website development as part of our Technology & AI practice.

Our web development services include:
- Corporate Website Development — professional, high-performance business websites
- Website Performance Optimization — speed, SEO, and conversion improvements
- Website Analytics & Reporting — data-driven insights and tracking

We build with modern technologies (Next.js, React, TypeScript, Tailwind CSS) and focus on creating websites that drive business results — not just look good.

To discuss your website project, book a free consultation or WhatsApp us at +92 323 5663592.`,
  },
  {
    keywords: ['price', 'cost', 'fee', 'charge', 'rate', 'how much', 'pricing', 'expensive', 'affordable', 'budget'],
    minScore: 1,
    answer: `Pricing at Crescent Consulting varies depending on the scope, complexity, and duration of your engagement.

We offer cost-competitive rates compared to global consulting firms — delivering world-class quality from Pakistan at a fraction of what large international firms charge.

All engagements require a minimum 4-week commitment to ensure proper discovery, implementation, and results validation.

To get a tailored proposal for your specific needs, book a free consultation:
- WhatsApp: +92 323 5663592
- Email: contactahmadirfan66@gmail.com

There is no cost for the initial consultation.`,
  },
  {
    keywords: ['industry', 'industries', 'sector', 'specialize', 'serve', 'work with', 'clients'],
    minScore: 1,
    answer: `Crescent Consulting serves clients across eight key industries in Pakistan and the GCC:

1. Logistics & Transportation — route optimization, fleet management, delivery transformation
2. Supply Chain & Distribution — end-to-end visibility, demand planning, distribution efficiency
3. Restaurants & Cafés — kitchen operations, inventory, multi-location expansion
4. Wholesale & Retail — inventory optimization, demand forecasting, omnichannel distribution
5. Manufacturing — production optimization, quality systems, technology integration
6. Warehousing & 3PL — warehouse automation, throughput optimization
7. Family-Owned Businesses — governance, modernization, growth planning
8. Growth-Stage Companies — scaling infrastructure, market expansion

If your industry is not listed, reach out — we assess every business individually.`,
  },
  {
    keywords: ['founder', 'team', 'ahmed', 'irfan', 'who runs', 'leadership', 'ceo', 'who founded', 'owner'],
    minScore: 1,
    answer: `Crescent Consulting was founded by Ahmed Irfan, who serves as Founder & Chief Executive Officer.

Ahmed has a background in Artificial Intelligence and Business Operations, combining technical expertise with practical business understanding to bridge strategy and execution.

Areas of expertise:
- Business Strategy & Growth Planning
- Operational Excellence
- Artificial Intelligence & Automation
- Digital Transformation & Systems Integration
- Technology Consulting

His vision: to help businesses across Pakistan and the GCC achieve sustainable growth through consulting that actually delivers — strategies that get implemented and results that get measured.`,
  },
  {
    keywords: ['long', 'duration', 'timeline', 'weeks', 'how long', 'engagement last'],
    minScore: 2,
    answer: `Engagement timelines at Crescent Consulting vary by service:

- Business Strategy Consulting: 6–12 weeks
- Growth Strategy Development: 4–8 weeks
- Business Process Optimization: 4–8 weeks
- Operational Excellence: 8–16 weeks
- Organizational Development: 6–12 weeks
- Performance Improvement: 4–10 weeks
- AI & Technology projects: varies by scope

All engagements follow our 4-phase Crescent Growth Framework:
1. Discovery & Assessment (1–2 weeks)
2. Strategy & Planning (1–3 weeks)
3. Implementation & Transformation (4–12 weeks)
4. Optimization & Results (ongoing)

Minimum commitment is 4 weeks across all engagements.`,
  },
  {
    keywords: ['gcc', 'saudi', 'uae', 'dubai', 'qatar', 'gulf', 'bahrain', 'kuwait', 'oman', 'international'],
    minScore: 1,
    answer: `Yes, Crescent Consulting actively serves and is expanding across GCC markets.

Current GCC expansion includes:
- Saudi Arabia
- United Arab Emirates (UAE)
- Qatar
- Bahrain
- Kuwait
- Oman

We have deep understanding of GCC business culture, regulatory environments, and market opportunities. Engagements can be conducted remotely or with on-site presence depending on your requirements.

To discuss a GCC engagement, contact us:
- WhatsApp: +92 323 5663592
- Email: contactahmadirfan66@gmail.com`,
  },
  {
    keywords: ['ai', 'artificial intelligence', 'automation', 'machine learning', 'automate'],
    minScore: 1,
    answer: `AI and automation are core to what Crescent Consulting does — embedded into every engagement, not just offered as a standalone service.

Our dedicated AI services include:
- AI Integration Consulting — identifying and implementing AI applications with measurable ROI
- AI Workflow Design — custom workflow automation using AI tools
- Business Process Automation — replacing repetitive tasks with intelligent systems

AI improves businesses in three primary ways:
1. Automation — replacing repetitive tasks with intelligent systems
2. Analytics — uncovering patterns and insights from operational data
3. Optimization — enabling faster, more accurate business decisions

We implement practical, real-world AI solutions — not theoretical concepts.`,
  },
  {
    keywords: ['methodology', 'process', 'framework', 'approach', 'how work', 'method', 'work together'],
    minScore: 1,
    answer: `Crescent Consulting uses the Crescent Growth Framework™ — a structured 4-phase methodology:

Phase 1 — Discovery & Assessment (1–2 weeks)
Stakeholder interviews, business assessment, process evaluation, and opportunity identification.

Phase 2 — Strategy & Planning (1–3 weeks)
Root cause analysis, strategic recommendations, KPI development, and roadmap creation.

Phase 3 — Implementation & Transformation (4–12 weeks)
Solution design, process optimization, technology implementation, and change management.

Phase 4 — Optimization & Results (ongoing)
KPI monitoring, performance measurement, continuous optimization, and executive reporting.

Every engagement ends with verified, measurable outcomes visible on your balance sheet.`,
  },
];

function findPredefinedAnswer(userInput: string): string | null {
  const normalized = userInput
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .trim();

  let bestAnswer: string | null = null;
  let bestScore = 0;

  for (const qa of PREDEFINED_QA) {
    const score = qa.keywords.filter((kw) => normalized.includes(kw)).length;
    if (score >= qa.minScore && score > bestScore) {
      bestScore = score;
      bestAnswer = qa.answer;
    }
  }

  return bestAnswer;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function TypingDots() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '2px 0' }}>
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          style={{
            width: 7,
            height: 7,
            borderRadius: '50%',
            background: '#C9A84C',
            display: 'block',
          }}
          animate={{ y: [0, -5, 0], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.16, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}

function MessageBubble({
  message,
  isStreaming,
}: {
  message: Message;
  isStreaming: boolean;
}) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      style={{
        display: 'flex',
        flexDirection: isUser ? 'row-reverse' : 'row',
        alignItems: 'flex-end',
        gap: 10,
        marginBottom: 4,
      }}
    >
      {/* Avatar */}
      <div
        style={{
          flexShrink: 0,
          width: 30,
          height: 30,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: isUser
            ? '#F0EBE0'
            : 'linear-gradient(135deg, #C9A84C 0%, #E8C56A 100%)',
          boxShadow: isUser ? 'none' : '0 3px 12px rgba(201,168,76,0.35)',
        }}
      >
        {isUser ? (
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#A08050" strokeWidth="2" strokeLinecap="round" />
            <circle cx="12" cy="7" r="4" stroke="#A08050" strokeWidth="2" />
          </svg>
        ) : (
          <Sparkles size={13} color="#fff" />
        )}
      </div>

      {/* Bubble */}
      <div
        style={{
          maxWidth: '76%',
          padding: isUser ? '10px 15px' : '12px 16px',
          borderRadius: isUser ? '18px 4px 18px 18px' : '4px 18px 18px 18px',
          fontSize: 14,
          lineHeight: 1.6,
          background: isUser
            ? 'linear-gradient(135deg, #C9A84C 0%, #D4A543 100%)'
            : '#FFFFFF',
          color: isUser ? '#FFFFFF' : '#1A1A1A',
          boxShadow: isUser
            ? '0 4px 16px rgba(201,168,76,0.3)'
            : '0 2px 12px rgba(0,0,0,0.07)',
          border: isUser ? 'none' : '1px solid #F0EDE6',
        }}
      >
        {!message.content ? (
          <TypingDots />
        ) : (
          <>
            <span style={{ whiteSpace: 'pre-wrap' }}>{message.content}</span>
            {isStreaming && (
              <motion.span
                style={{
                  display: 'inline-block',
                  width: 2,
                  height: 14,
                  background: '#C9A84C',
                  borderRadius: 2,
                  marginLeft: 2,
                  verticalAlign: 'middle',
                }}
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 0.7, repeat: Infinity }}
              />
            )}
          </>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);
  const [inputFocused, setInputFocused] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => { scrollToBottom(); }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 380);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 110)}px`;
  };

  const sendMessage = useCallback(
    async (overrideText?: string) => {
      const text = (overrideText ?? input).trim();
      if (!text || isLoading || streamingId) return;

      const userMessage: Message = {
        id: generateId(),
        role: 'user',
        content: text,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, userMessage]);
      setInput('');
      if (inputRef.current) inputRef.current.style.height = 'auto';
      setIsLoading(true);
      setError(null);

      const assistantId = generateId();

      // ── Check predefined answers first ──────────────────────────────
      const predefinedAnswer = findPredefinedAnswer(text);

      if (predefinedAnswer) {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: assistantId,
            role: 'assistant',
            content: predefinedAnswer,
            timestamp: new Date(),
          },
        ]);
        if (!isOpen) setHasUnread(true);
        return;
      }

      // ── No predefined match — send to OpenAI ────────────────────────
      try {
        const history = [...messages, userMessage]
          .filter((m) => m.id !== 'welcome')
          .map((m) => ({ role: m.role, content: m.content }));

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ messages: history }),
        });

        if (!response.ok) {
          const data = await response.json().catch(() => ({}));
          throw new Error(data.error || `Request failed (${response.status})`);
        }

        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: 'assistant', content: '', timestamp: new Date() },
        ]);
        setIsLoading(false);
        setStreamingId(assistantId);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error('No readable stream');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: m.content + chunk } : m
            )
          );
        }

        if (!isOpen) setHasUnread(true);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Something went wrong. Please try again.';
        setError(msg);
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      } finally {
        setIsLoading(false);
        setStreamingId(null);
      }
    },
    [input, isLoading, streamingId, messages, isOpen]
  );

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const clearChat = () => {
    if (isLoading || streamingId) return;
    setMessages([WELCOME_MESSAGE]);
    setError(null);
  };

  const isBusy = isLoading || !!streamingId;
  const canSend = input.trim().length > 0 && !isBusy;
  const showSuggestions = messages.length === 1 && !isBusy;

  return (
    <>
      {/* ── Panel ─────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="panel"
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            style={{
              position: 'fixed',
              bottom: 90,
              right: 20,
              width: 400,
              maxWidth: 'calc(100vw - 24px)',
              height: 600,
              maxHeight: 'calc(100dvh - 110px)',
              borderRadius: 24,
              background: '#FAFAF8',
              boxShadow: '0 24px 80px rgba(0,0,0,0.18), 0 0 0 1px rgba(0,0,0,0.06)',
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden',
              zIndex: 9999,
            }}
            role="dialog"
            aria-label="Crescent AI Chat"
          >
            {/* Gold top strip */}
            <div
              style={{
                height: 3,
                background: 'linear-gradient(90deg, #C9A84C 0%, #F5D78E 50%, #C9A84C 100%)',
                flexShrink: 0,
              }}
            />

            {/* Header */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px 20px',
                background: '#FFFFFF',
                borderBottom: '1px solid #F0EDE6',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ position: 'relative' }}>
                  <div
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 13,
                      background: 'linear-gradient(135deg, #C9A84C 0%, #E8C56A 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 4px 14px rgba(201,168,76,0.35)',
                    }}
                  >
                    <Sparkles size={18} color="#fff" />
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.3, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                    style={{
                      position: 'absolute',
                      bottom: -1,
                      right: -1,
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      background: '#22C55E',
                      border: '2px solid #fff',
                    }}
                  />
                </div>
                <div>
                  <p style={{ margin: 0, fontSize: 14, fontWeight: 600, color: '#0F0F0F', letterSpacing: '-0.01em' }}>
                    Crescent AI
                  </p>
                  <p style={{ margin: '2px 0 0', fontSize: 11, color: '#22C55E', fontWeight: 500, letterSpacing: '0.01em' }}>
                    ● Online · Typically replies instantly
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <motion.button
                  onClick={clearChat}
                  disabled={isBusy || messages.length <= 1}
                  whileHover={{ scale: 1.05, background: '#F5F0E8' }}
                  whileTap={{ scale: 0.95 }}
                  title="Clear chat"
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    opacity: messages.length <= 1 ? 0.3 : 0.5,
                    transition: 'opacity 0.2s',
                  }}
                >
                  <RotateCcw size={13} color="#6B6B6B" />
                </motion.button>

                <motion.button
                  onClick={() => setIsOpen(false)}
                  whileHover={{ scale: 1.05, background: '#F5F0E8' }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 8,
                    border: 'none',
                    background: 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                  }}
                >
                  <X size={15} color="#6B6B6B" />
                </motion.button>
              </div>
            </div>

            {/* Messages */}
            <div
              style={{
                flex: 1,
                overflowY: 'auto',
                padding: '20px 18px 8px',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
                background: '#FAFAF8',
              }}
              className="crescent-chat-scroll"
            >
              <AnimatePresence initial={false}>
                {messages.map((msg) => (
                  <MessageBubble
                    key={msg.id}
                    message={msg}
                    isStreaming={msg.id === streamingId}
                  />
                ))}
              </AnimatePresence>

              {/* Loading dots */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{ display: 'flex', alignItems: 'flex-end', gap: 10 }}
                  >
                    <div
                      style={{
                        width: 30,
                        height: 30,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, #C9A84C, #E8C56A)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: '0 3px 12px rgba(201,168,76,0.35)',
                        flexShrink: 0,
                      }}
                    >
                      <Sparkles size={13} color="#fff" />
                    </div>
                    <div
                      style={{
                        padding: '12px 16px',
                        borderRadius: '4px 18px 18px 18px',
                        background: '#FFFFFF',
                        border: '1px solid #F0EDE6',
                        boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
                      }}
                    >
                      <TypingDots />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    style={{
                      padding: '10px 14px',
                      borderRadius: 12,
                      background: '#FEF2F2',
                      border: '1px solid #FECACA',
                      color: '#991B1B',
                      fontSize: 13,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <span>⚠</span>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* Suggestions */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  style={{
                    padding: '8px 18px 12px',
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: 8,
                    background: '#FAFAF8',
                  }}
                >
                  {QUICK_SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.05 + i * 0.07 }}
                      onClick={() => sendMessage(s)}
                      whileHover={{ scale: 1.02, background: '#F5EDD6', borderColor: '#C9A84C' }}
                      whileTap={{ scale: 0.97 }}
                      style={{
                        padding: '7px 13px',
                        borderRadius: 20,
                        border: '1px solid #E8DFC8',
                        background: '#FDF8EF',
                        color: '#8B6914',
                        fontSize: 12,
                        fontWeight: 500,
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                        letterSpacing: '0.01em',
                      }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Input */}
            <div
              style={{
                padding: '12px 16px 16px',
                background: '#FFFFFF',
                borderTop: '1px solid #F0EDE6',
                flexShrink: 0,
              }}
            >
              <motion.div
                animate={{
                  borderColor: inputFocused ? '#C9A84C' : '#EDE8DC',
                  boxShadow: inputFocused
                    ? '0 0 0 3px rgba(201,168,76,0.12)'
                    : '0 0 0 0px rgba(201,168,76,0)',
                }}
                transition={{ duration: 0.18 }}
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: 10,
                  padding: '10px 12px 10px 16px',
                  borderRadius: 16,
                  background: '#F9F7F3',
                  border: '1.5px solid #EDE8DC',
                }}
              >
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onFocus={() => setInputFocused(true)}
                  onBlur={() => setInputFocused(false)}
                  placeholder="Ask about our services…"
                  rows={1}
                  disabled={isBusy}
                  style={{
                    flex: 1,
                    background: 'transparent',
                    border: 'none',
                    outline: 'none',
                    resize: 'none',
                    fontSize: 14,
                    lineHeight: 1.55,
                    color: '#1A1A1A',
                    minHeight: 22,
                    maxHeight: 110,
                    fontFamily: 'inherit',
                    opacity: isBusy ? 0.5 : 1,
                  }}
                  aria-label="Type your message"
                />

                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!canSend}
                  whileHover={canSend ? { scale: 1.06 } : {}}
                  whileTap={canSend ? { scale: 0.93 } : {}}
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 11,
                    border: 'none',
                    background: canSend
                      ? 'linear-gradient(135deg, #C9A84C 0%, #E8C56A 100%)'
                      : '#F0EDE6',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: canSend ? 'pointer' : 'not-allowed',
                    flexShrink: 0,
                    boxShadow: canSend ? '0 4px 14px rgba(201,168,76,0.4)' : 'none',
                    transition: 'background 0.2s, box-shadow 0.2s',
                  }}
                  aria-label="Send message"
                >
                  {isBusy ? (
                    <Loader2 size={15} color={canSend ? '#fff' : '#B0A898'} className="animate-spin" />
                  ) : (
                    <Send size={15} color={canSend ? '#fff' : '#B0A898'} />
                  )}
                </motion.button>
              </motion.div>

              <p
                style={{
                  textAlign: 'center',
                  fontSize: 10,
                  color: '#C4B89A',
                  marginTop: 10,
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  fontWeight: 500,
                }}
              >
                Crescent AI · Powered by GPT-4o mini
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ────────────────────────────────────────────── */}
      <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 9999 }}>
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              key="pulse"
              style={{
                position: 'absolute',
                inset: 0,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #C9A84C, #E8C56A)',
                zIndex: -1,
              }}
              animate={{ scale: [1, 1.7], opacity: [0.5, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 1, ease: 'easeOut' }}
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.91 }}
          style={{
            width: 56,
            height: 56,
            borderRadius: '50%',
            border: 'none',
            background: isOpen
              ? '#1A1A1A'
              : 'linear-gradient(135deg, #C9A84C 0%, #E8C56A 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            boxShadow: isOpen
              ? '0 8px 30px rgba(0,0,0,0.35)'
              : '0 8px 30px rgba(201,168,76,0.55)',
            position: 'relative',
          }}
          aria-label={isOpen ? 'Close chat' : 'Chat with Crescent AI'}
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="x"
                initial={{ rotate: -70, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 70, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.17 }}
              >
                <X size={21} color="#fff" />
              </motion.span>
            ) : (
              <motion.span
                key="chat"
                initial={{ rotate: 70, opacity: 0, scale: 0.5 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -70, opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.17 }}
              >
                <MessageCircle size={21} color="#fff" />
              </motion.span>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {hasUnread && !isOpen && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 25 }}
                style={{
                  position: 'absolute',
                  top: -3,
                  right: -3,
                  width: 16,
                  height: 16,
                  borderRadius: '50%',
                  background: '#EF4444',
                  border: '2px solid #fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 9,
                  fontWeight: 700,
                  color: '#fff',
                }}
              >
                1
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      <style jsx global>{`
        .crescent-chat-scroll::-webkit-scrollbar { width: 4px; }
        .crescent-chat-scroll::-webkit-scrollbar-track { background: transparent; }
        .crescent-chat-scroll::-webkit-scrollbar-thumb { background: #E8DFC8; border-radius: 4px; }
        .crescent-chat-scroll::-webkit-scrollbar-thumb:hover { background: #C9A84C; }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </>
  );
}