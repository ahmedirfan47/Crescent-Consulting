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
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="#A08050" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="12" cy="7" r="4" stroke="#A08050" strokeWidth="2"/>
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

      {/* Floating Button */}
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