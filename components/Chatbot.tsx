'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import {
  MessageCircle,
  X,
  Send,
  Bot,
  User,
  Loader2,
  ChevronDown,
  RotateCcw,
  Sparkles,
} from 'lucide-react';

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
  'How long does an engagement take?',
  'Book a consultation',
];

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 h-4">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="w-1.5 h-1.5 rounded-full bg-amber-400/60 animate-bounce"
          style={{ animationDelay: `${delay}ms`, animationDuration: '0.9s' }}
        />
      ))}
    </span>
  );
}

interface MessageBubbleProps {
  message: Message;
  isStreaming?: boolean;
}

function MessageBubble({ message, isStreaming }: MessageBubbleProps) {
  const isUser = message.role === 'user';
  const isEmpty = !message.content;

  return (
    <div className={`flex gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      <div
        className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center mt-0.5"
        style={
          isUser
            ? { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.1)' }
            : { background: 'linear-gradient(135deg, #C9A84C 0%, #F5D78E 100%)' }
        }
      >
        {isUser ? (
          <User size={12} className="text-white/60" />
        ) : (
          <Bot size={12} className="text-black" />
        )}
      </div>

      <div
        className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
          isUser ? 'rounded-tr-sm text-white/90' : 'rounded-tl-sm text-white/85'
        }`}
        style={
          isUser
            ? {
                background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.1)',
              }
            : {
                background: 'rgba(201, 168, 76, 0.07)',
                border: '1px solid rgba(201, 168, 76, 0.15)',
              }
        }
      >
        {isEmpty ? (
          <TypingDots />
        ) : (
          <>
            <span className="whitespace-pre-wrap">{message.content}</span>
            {isStreaming && (
              <span className="inline-block w-0.5 h-4 bg-amber-400/70 ml-0.5 animate-pulse align-middle" />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [streamingId, setStreamingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasUnread, setHasUnread] = useState(false);

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
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 100)}px`;
  };

  const toggleChat = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsOpen((prev) => !prev);
    setTimeout(() => setIsAnimating(false), 350);
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
      if (inputRef.current) {
        inputRef.current.style.height = 'auto';
      }
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
          err instanceof Error ? err.message : 'Something went wrong. Please try again.';
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

  return (
    <>
      {/* Chat Panel */}
      <div
        className="fixed bottom-[5.5rem] right-5 z-50 w-[370px] max-w-[calc(100vw-1.25rem)] flex flex-col rounded-2xl overflow-hidden shadow-2xl"
        style={{
          height: '560px',
          maxHeight: 'calc(100dvh - 9rem)',
          background: '#0d0d0d',
          border: '1px solid rgba(255,255,255,0.08)',
          boxShadow: '0 25px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(201,168,76,0.08)',
          transformOrigin: 'bottom right',
          transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.92) translateY(12px)',
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'transform 0.3s cubic-bezier(0.34,1.56,0.64,1), opacity 0.25s ease',
        }}
        aria-hidden={!isOpen}
        role="dialog"
        aria-label="Crescent AI Chat"
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-4 py-3.5 flex-shrink-0"
          style={{
            background: 'linear-gradient(180deg, #161616 0%, #111111 100%)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #C9A84C 0%, #F5D78E 100%)',
                  boxShadow: '0 0 16px rgba(201,168,76,0.3)',
                }}
              >
                <Sparkles size={16} className="text-black" />
              </div>
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-400 rounded-full border-2 border-[#161616]" />
            </div>
            <div>
              <p className="text-white font-semibold text-sm tracking-wide">Crescent AI</p>
              <p className="text-emerald-400 text-[11px] font-medium">Online · Ready to help</p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={clearChat}
              disabled={isBusy || messages.length <= 1}
              title="Clear conversation"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
            >
              <RotateCcw size={13} />
            </button>
            <button
              onClick={toggleChat}
              title="Minimise chat"
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white/30 hover:text-white/70 hover:bg-white/5 transition-all"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 overscroll-contain chat-scrollbar">
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isStreaming={message.id === streamingId}
            />
          ))}

          {isLoading && (
            <div className="flex gap-2.5">
              <div
                className="flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #F5D78E 100%)' }}
              >
                <Bot size={12} className="text-black" />
              </div>
              <div
                className="rounded-2xl rounded-tl-sm px-3.5 py-2.5"
                style={{
                  background: 'rgba(201, 168, 76, 0.07)',
                  border: '1px solid rgba(201, 168, 76, 0.15)',
                }}
              >
                <TypingDots />
              </div>
            </div>
          )}

          {error && (
            <div
              className="rounded-xl px-4 py-3 text-sm text-red-300 flex items-start gap-2"
              style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.18)' }}
            >
              <span className="mt-0.5 flex-shrink-0">⚠</span>
              <span>{error}</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Suggestions */}
        {showSuggestions && (
          <div className="px-4 pb-3 flex flex-wrap gap-1.5 flex-shrink-0">
            {QUICK_SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-[11px] px-2.5 py-1.5 rounded-full transition-all text-white/50 hover:text-white/90"
                style={{
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(201,168,76,0.4)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(201,168,76,0.06)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.1)';
                  (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.03)';
                }}
              >
                {s}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div
          className="px-4 py-3 flex-shrink-0"
          style={{ borderTop: '1px solid rgba(255,255,255,0.07)' }}
        >
          <div
            className="flex items-end gap-2.5 rounded-xl px-4 py-2.5 transition-all duration-200"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: `1px solid ${input ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.08)'}`,
            }}
          >
            <textarea
              ref={inputRef}
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder="Ask about our services…"
              rows={1}
              disabled={isBusy}
              className="flex-1 bg-transparent text-white/90 text-sm placeholder-white/25 resize-none outline-none min-h-[22px] max-h-[100px] leading-relaxed disabled:opacity-50"
              style={{ scrollbarWidth: 'none' }}
              aria-label="Chat message input"
            />
            <button
              onClick={() => sendMessage()}
              disabled={!input.trim() || isBusy}
              aria-label="Send message"
              className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center transition-all disabled:opacity-25 disabled:cursor-not-allowed hover:scale-105 active:scale-95"
              style={{ background: 'linear-gradient(135deg, #C9A84C 0%, #F5D78E 100%)' }}
            >
              {isBusy ? (
                <Loader2 size={13} className="text-black animate-spin" />
              ) : (
                <Send size={13} className="text-black" />
              )}
            </button>
          </div>
          <p className="text-center text-white/15 text-[10px] mt-2 tracking-widest uppercase">
            Crescent AI · Powered by GPT
          </p>
        </div>
      </div>

      {/* Floating Button */}
      <button
        onClick={toggleChat}
        aria-label={isOpen ? 'Close AI chat' : 'Open AI chat'}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-amber-400/50"
        style={{
          background: isOpen
            ? '#1a1a1a'
            : 'linear-gradient(135deg, #C9A84C 0%, #F5D78E 100%)',
          border: isOpen ? '1px solid rgba(255,255,255,0.1)' : 'none',
          boxShadow: isOpen
            ? '0 8px 24px rgba(0,0,0,0.4)'
            : '0 8px 32px rgba(201,168,76,0.4)',
        }}
      >
        <span
          className="transition-all duration-300"
          style={{ transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
        >
          {isOpen ? (
            <X size={20} className="text-white" />
          ) : (
            <MessageCircle size={20} className="text-black" />
          )}
        </span>

        {hasUnread && !isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full border-2 border-[#0a0a0a] text-white text-[9px] flex items-center justify-center font-bold">
            1
          </span>
        )}
      </button>

      <style jsx global>{`
        .chat-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .chat-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
        }
        .chat-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </>
  );
}