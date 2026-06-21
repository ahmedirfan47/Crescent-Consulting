'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Loader2,
  RotateCcw,
  Sparkles,
  User,
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

// ─── Constants ────────────────────────────────────────────────────────────────

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
  'How long does an engagement take?',
  'Book a consultation',
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

// ─── Typing Indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 h-5">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'rgba(201,168,76,0.6)' }}
          animate={{ y: [0, -5, 0], opacity: [0.5, 1, 0.5] }}
          transition={{
            duration: 0.9,
            repeat: Infinity,
            delay: i * 0.18,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

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
      initial={{ opacity: 0, y: 12, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.22, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {/* Avatar */}
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center self-end mb-0.5"
        style={
          isUser
            ? {
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
              }
            : {
                background: 'linear-gradient(135deg, #C9A84C 0%, #F5D78E 100%)',
                boxShadow: '0 2px 10px rgba(201,168,76,0.3)',
              }
        }
      >
        {isUser ? (
          <User size={12} className="text-white/50" />
        ) : (
          <Sparkles size={11} className="text-black" />
        )}
      </div>

      {/* Bubble */}
      <div
        className={`relative max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
          isUser ? 'rounded-br-sm' : 'rounded-bl-sm'
        }`}
        style={
          isUser
            ? {
                background: 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.09)',
                color: 'rgba(255,255,255,0.88)',
              }
            : {
                background:
                  'linear-gradient(135deg, rgba(201,168,76,0.09) 0%, rgba(245,215,142,0.05) 100%)',
                border: '1px solid rgba(201,168,76,0.15)',
                color: 'rgba(255,255,255,0.84)',
              }
        }
      >
        {!message.content ? (
          <TypingIndicator />
        ) : (
          <>
            <span className="whitespace-pre-wrap">{message.content}</span>
            {isStreaming && (
              <motion.span
                className="inline-block w-[2px] h-[14px] ml-0.5 align-middle rounded-full"
                style={{ background: 'rgba(201,168,76,0.7)' }}
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.5, repeat: Infinity }}
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

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  useEffect(() => {
    if (isOpen) {
      setHasUnread(false);
      setTimeout(() => inputRef.current?.focus(), 400);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
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
          {
            id: assistantId,
            role: 'assistant',
            content: '',
            timestamp: new Date(),
          },
        ]);
        setIsLoading(false);
        setStreamingId(assistantId);

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        if (!reader) throw new Error('No readable stream available');

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
        const errorMessage =
          err instanceof Error
            ? err.message
            : 'Something went wrong. Please try again.';
        setError(errorMessage);
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
  const showSuggestions = messages.length === 1 && !isBusy;
  const canSend = input.trim() && !isBusy;

  return (
    <>
      {/* ── Chat Panel ─────────────────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="chat-panel"
            initial={{ opacity: 0, scale: 0.88, y: 24, originX: 1, originY: 1 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 24 }}
            transition={{ type: 'spring', stiffness: 420, damping: 32 }}
            className="fixed bottom-24 right-5 z-50 flex flex-col overflow-hidden"
            style={{
              width: '400px',
              maxWidth: 'calc(100vw - 1.5rem)',
              height: '620px',
              maxHeight: 'calc(100dvh - 7rem)',
              borderRadius: '22px',
              background: 'linear-gradient(170deg, #131313 0%, #0b0b0b 100%)',
              border: '1px solid rgba(201,168,76,0.13)',
              boxShadow:
                '0 40px 100px rgba(0,0,0,0.75), 0 0 0 1px rgba(255,255,255,0.04), inset 0 1px 0 rgba(201,168,76,0.07)',
            }}
            role="dialog"
            aria-label="Crescent AI Chat"
          >
            {/* ── Header ─────────────────────────────────────────────── */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{
                background:
                  'linear-gradient(135deg, #181818 0%, #131313 100%)',
                borderBottom: '1px solid rgba(255,255,255,0.05)',
              }}
            >
              <div className="flex items-center gap-3.5">
                {/* Icon */}
                <div className="relative">
                  <div
                    className="w-10 h-10 rounded-[13px] flex items-center justify-center"
                    style={{
                      background:
                        'linear-gradient(135deg, #C9A84C 0%, #F5D78E 100%)',
                      boxShadow: '0 4px 18px rgba(201,168,76,0.38)',
                    }}
                  >
                    <Sparkles size={18} className="text-black" />
                  </div>
                  {/* Online pulse */}
                  <motion.span
                    className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-400 rounded-full border-2"
                    style={{ borderColor: '#181818' }}
                    animate={{ scale: [1, 1.25, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  />
                </div>

                <div>
                  <p
                    className="text-white font-semibold text-[13px] tracking-wide"
                    style={{ letterSpacing: '0.03em' }}
                  >
                    Crescent AI
                  </p>
                  <p className="text-emerald-400 text-[11px] font-medium tracking-wide mt-0.5">
                    Online · Ready to help
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-0.5">
                <motion.button
                  onClick={clearChat}
                  disabled={isBusy || messages.length <= 1}
                  title="Clear conversation"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-white/55 hover:bg-white/5 transition-colors disabled:opacity-0 disabled:pointer-events-none"
                >
                  <RotateCcw size={13} />
                </motion.button>
                <motion.button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-white/20 hover:text-white/55 hover:bg-white/5 transition-colors"
                >
                  <X size={15} />
                </motion.button>
              </div>
            </div>

            {/* ── Messages ───────────────────────────────────────────── */}
            <div
              className="flex-1 overflow-y-auto px-5 py-5 space-y-4 overscroll-contain"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(255,255,255,0.07) transparent',
              }}
            >
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <MessageBubble
                    key={message.id}
                    message={message}
                    isStreaming={message.id === streamingId}
                  />
                ))}
              </AnimatePresence>

              {/* Loading state before streaming begins */}
              <AnimatePresence>
                {isLoading && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex gap-2.5"
                  >
                    <div
                      className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'linear-gradient(135deg, #C9A84C, #F5D78E)',
                        boxShadow: '0 2px 10px rgba(201,168,76,0.3)',
                      }}
                    >
                      <Sparkles size={11} className="text-black" />
                    </div>
                    <div
                      className="rounded-2xl rounded-bl-sm px-4 py-3"
                      style={{
                        background:
                          'linear-gradient(135deg, rgba(201,168,76,0.09), rgba(245,215,142,0.05))',
                        border: '1px solid rgba(201,168,76,0.15)',
                      }}
                    >
                      <TypingIndicator />
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Error */}
              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="flex items-start gap-2.5 rounded-xl px-4 py-3 text-[13px]"
                    style={{
                      background: 'rgba(239,68,68,0.07)',
                      border: '1px solid rgba(239,68,68,0.14)',
                      color: 'rgba(252,165,165,0.85)',
                    }}
                  >
                    <span className="mt-px">⚠</span>
                    <span>{error}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>

            {/* ── Quick Suggestions ──────────────────────────────────── */}
            <AnimatePresence>
              {showSuggestions && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 6 }}
                  className="px-5 pb-3 flex flex-wrap gap-2"
                >
                  {QUICK_SUGGESTIONS.map((s, i) => (
                    <motion.button
                      key={s}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.08 + i * 0.07 }}
                      onClick={() => sendMessage(s)}
                      whileHover={{
                        borderColor: 'rgba(201,168,76,0.38)',
                        background: 'rgba(201,168,76,0.06)',
                        color: 'rgba(255,255,255,0.8)',
                      }}
                      whileTap={{ scale: 0.97 }}
                      className="text-[11px] px-3 py-1.5 rounded-full transition-colors"
                      style={{
                        border: '1px solid rgba(255,255,255,0.08)',
                        background: 'rgba(255,255,255,0.02)',
                        color: 'rgba(255,255,255,0.4)',
                      }}
                    >
                      {s}
                    </motion.button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Input Bar ──────────────────────────────────────────── */}
            <div
              className="px-4 pb-4 pt-3 flex-shrink-0"
              style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}
            >
              <motion.div
                animate={{
                  borderColor: inputFocused
                    ? 'rgba(201,168,76,0.28)'
                    : 'rgba(255,255,255,0.07)',
                  boxShadow: inputFocused
                    ? '0 0 0 3px rgba(201,168,76,0.07)'
                    : '0 0 0 0px rgba(201,168,76,0)',
                }}
                transition={{ duration: 0.2 }}
                className="flex items-end gap-3 rounded-xl px-4 py-3"
                style={{
                  background: 'rgba(255,255,255,0.03)',
                  border: '1px solid rgba(255,255,255,0.07)',
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
                  className="flex-1 bg-transparent text-sm text-white/85 placeholder-white/20 resize-none outline-none leading-relaxed min-h-[22px] max-h-[120px] disabled:opacity-40"
                  style={{ scrollbarWidth: 'none' }}
                  aria-label="Type your message"
                />

                <motion.button
                  onClick={() => sendMessage()}
                  disabled={!canSend}
                  whileHover={canSend ? { scale: 1.07 } : {}}
                  whileTap={canSend ? { scale: 0.92 } : {}}
                  className="flex-shrink-0 w-9 h-9 rounded-xl flex items-center justify-center transition-all duration-200 disabled:cursor-not-allowed"
                  style={{
                    background: canSend
                      ? 'linear-gradient(135deg, #C9A84C 0%, #F5D78E 100%)'
                      : 'rgba(255,255,255,0.05)',
                    boxShadow: canSend
                      ? '0 4px 16px rgba(201,168,76,0.35)'
                      : 'none',
                    opacity: canSend ? 1 : 0.35,
                  }}
                  aria-label="Send message"
                >
                  {isBusy ? (
                    <Loader2 size={14} className="text-black animate-spin" />
                  ) : (
                    <Send
                      size={14}
                      className={canSend ? 'text-black' : 'text-white/30'}
                    />
                  )}
                </motion.button>
              </motion.div>

              <p
                className="text-center text-[10px] mt-2.5 tracking-[0.12em] uppercase"
                style={{ color: 'rgba(255,255,255,0.1)' }}
              >
                Crescent AI · Powered by GPT-4o mini
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Floating Button ────────────────────────────────────────────── */}
      <div className="fixed bottom-5 right-5 z-50">
        {/* Ambient pulse ring — only when closed */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div
              key="pulse"
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, #C9A84C, #F5D78E)',
              }}
              animate={{
                scale: [1, 1.65, 1.65],
                opacity: [0.45, 0, 0],
              }}
              transition={{
                duration: 2.2,
                repeat: Infinity,
                repeatDelay: 1.2,
                ease: 'easeOut',
              }}
            />
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          whileHover={{ scale: 1.09 }}
          whileTap={{ scale: 0.92 }}
          className="relative w-14 h-14 rounded-full flex items-center justify-center focus:outline-none"
          style={{
            background: isOpen
              ? 'rgba(18,18,18,0.96)'
              : 'linear-gradient(135deg, #C9A84C 0%, #F5D78E 100%)',
            border: isOpen
              ? '1px solid rgba(255,255,255,0.1)'
              : '1px solid rgba(201,168,76,0.2)',
            boxShadow: isOpen
              ? '0 8px 28px rgba(0,0,0,0.5)'
              : '0 8px 36px rgba(201,168,76,0.5)',
          }}
          aria-label={isOpen ? 'Close chat' : 'Chat with Crescent AI'}
        >
          {/* Icon transition */}
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.span
                key="close"
                initial={{ rotate: -80, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: 80, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <X size={20} className="text-white" />
              </motion.span>
            ) : (
              <motion.span
                key="open"
                initial={{ rotate: 80, opacity: 0, scale: 0.6 }}
                animate={{ rotate: 0, opacity: 1, scale: 1 }}
                exit={{ rotate: -80, opacity: 0, scale: 0.6 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
              >
                <MessageCircle size={20} className="text-black" />
              </motion.span>
            )}
          </AnimatePresence>

          {/* Unread badge */}
          <AnimatePresence>
            {hasUnread && !isOpen && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 500, damping: 28 }}
                className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white font-bold"
                style={{
                  fontSize: '9px',
                  border: '2px solid #0a0a0a',
                }}
              >
                1
              </motion.span>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Webkit scrollbar styles */}
      <style jsx global>{`
        [role='dialog'] ::-webkit-scrollbar {
          width: 3px;
        }
        [role='dialog'] ::-webkit-scrollbar-track {
          background: transparent;
        }
        [role='dialog'] ::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
        }
        [role='dialog'] ::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.15);
        }
      `}</style>
    </>
  );
}