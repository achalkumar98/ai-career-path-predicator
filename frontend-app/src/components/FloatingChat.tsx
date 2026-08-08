'use client';
import { useState, useRef, useEffect, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import { Bot, X, Send, Mic, User, Minimize2, Maximize2 } from 'lucide-react';
import { sendChatMessageApi } from '@/api/chatApi';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import toast from 'react-hot-toast';

interface Message {
  role: 'user' | 'bot';
  text: string;
  ts?: number;
}

export default function FloatingChat() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [unread, setUnread] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Seed welcome message once
  useEffect(() => {
    if (messages.length === 0) {
      const user = (() => {
        try { return JSON.parse(localStorage.getItem('user') || '{}'); } catch { return {}; }
      })();
      setMessages([{
        role: 'bot',
        text: `Hi ${user?.name || 'there'} 👋  I'm your AI Career Assistant. Ask me anything about resumes, job search, interview tips, or career growth!`,
        ts: Date.now(),
      }]);
    }
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Focus input when panel opens
  useEffect(() => {
    if (open) {
      setUnread(0);
      setTimeout(() => inputRef.current?.focus(), 120);
    }
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleSend = useCallback(async (e?: React.FormEvent) => {
    e?.preventDefault();
    const text = input.trim();
    if (!text || loading) return;

    setInput('');
    setMessages(prev => [...prev, { role: 'user', text, ts: Date.now() }]);
    setLoading(true);

    try {
      const res = await sendChatMessageApi(text);
      const reply: string = res.data.reply;
      setMessages(prev => [...prev, { role: 'bot', text: reply, ts: Date.now() }]);
      if (!open) setUnread(n => n + 1);
    } catch {
      setMessages(prev => [...prev, {
        role: 'bot',
        text: 'Sorry, something went wrong. Please make sure the server is running and try again.',
        ts: Date.now(),
      }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, open]);

  // Auto-grow textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px';
  };

  // Send on Enter (Shift+Enter = newline)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleVoice = () => {
    type SpeechCtor = new () => {
      lang: string;
      interimResults: boolean;
      onstart: (() => void) | null;
      onend: (() => void) | null;
      onresult: ((e: { results: { [k: number]: { [k: number]: { transcript: string } } } }) => void) | null;
      start(): void;
    };
    const SR = (window as unknown as { webkitSpeechRecognition?: SpeechCtor; SpeechRecognition?: SpeechCtor })
      .webkitSpeechRecognition ??
      (window as unknown as { SpeechRecognition?: SpeechCtor }).SpeechRecognition;
    if (!SR) { toast.error('Speech recognition not supported in this browser.'); return; }
    const r = new SR();
    r.lang = 'en-US';
    r.interimResults = false;
    r.onstart = () => setIsListening(true);
    r.onend = () => setIsListening(false);
    r.onresult = (e) => setInput(e.results[0][0].transcript);
    r.start();
  };

  const panelClass = `fchat-panel ${open ? 'fchat-open' : 'fchat-closed'}`;

  // Don't render the widget at all on the /chatbot page —
  // that page has its own full chat UI and the trigger would overlap it on mobile.
  if (pathname === '/chatbot') return null;

  return (
    <>
      {/* Floating trigger button — hidden while panel is open so it never overlaps the send button */}
      <button
        className="fchat-trigger"
        style={{ display: open ? 'none' : undefined }}
        onClick={() => setOpen(v => !v)}
        aria-label={open ? 'Close chat' : 'Open AI Chat Assistant'}
        title="AI Career Assistant"
      >
        {open ? <X size={20} /> : <Bot size={22} />}
        {!open && unread > 0 && (
          <span className="fchat-badge">{unread > 9 ? '9+' : unread}</span>
        )}
      </button>

      {/* Chat panel */}
      <div
        className={panelClass}
        style={{ height: expanded ? 'calc(100vh - 120px)' : undefined }}
        role="dialog"
        aria-label="AI Career Chat"
        aria-modal="false"
      >
        {/* Header */}
        <div className="fchat-header">
          <div className="fchat-header-info">
            <div className="fchat-avatar">
              <Bot size={16} />
            </div>
            <div>
              <p className="fchat-header-title">CareerBot</p>
              <p className="fchat-header-status">AI Career Assistant</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {/* Expand / collapse */}
            <button
              className="fchat-close-btn"
              onClick={() => setExpanded(v => !v)}
              aria-label={expanded ? 'Minimize chat' : 'Expand chat'}
              title={expanded ? 'Minimize' : 'Expand'}
            >
              {expanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            </button>
            <button
              className="fchat-close-btn"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
            >
              <X size={14} />
            </button>
          </div>
        </div>

        {/* Messages */}
        <div className="fchat-messages" role="log" aria-live="polite">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`fchat-bubble-row ${m.role === 'user' ? 'fchat-user' : ''}`}
            >
              <div className={`fchat-bubble-avatar ${m.role}`}>
                {m.role === 'user'
                  ? <User size={12} />
                  : <Bot size={12} />
                }
              </div>
              <div className={`fchat-bubble ${m.role}`}>
                {m.role === 'bot' ? (
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children }: { className?: string; children?: React.ReactNode }) {
                        const match = /language-(\w+)/.exec(className || '');
                        if (match) {
                          return (
                            <div style={{
                              background: '#111827', borderRadius: '8px',
                              padding: '10px 12px', marginTop: '6px', overflow: 'auto',
                            }}>
                              <code style={{ color: '#e5e7eb', fontSize: '12px', fontFamily: 'monospace' }}>
                                {children}
                              </code>
                            </div>
                          );
                        }
                        return (
                          <code style={{
                            background: 'rgba(99,102,241,0.12)', padding: '2px 5px',
                            borderRadius: '4px', fontSize: '12px',
                          }}>
                            {children}
                          </code>
                        );
                      },
                      p({ children }) {
                        return <p style={{ margin: '0 0 6px', lineHeight: 1.55 }}>{children}</p>;
                      },
                      ul({ children }) {
                        return <ul style={{ paddingLeft: '16px', margin: '4px 0' }}>{children}</ul>;
                      },
                      ol({ children }) {
                        return <ol style={{ paddingLeft: '16px', margin: '4px 0' }}>{children}</ol>;
                      },
                      li({ children }) {
                        return <li style={{ marginBottom: '3px', lineHeight: 1.5 }}>{children}</li>;
                      },
                    }}
                  >
                    {m.text}
                  </ReactMarkdown>
                ) : (
                  m.text
                )}
              </div>
            </div>
          ))}

          {/* Typing indicator */}
          {loading && (
            <div className="fchat-bubble-row">
              <div className="fchat-bubble-avatar bot">
                <Bot size={12} />
              </div>
              <div className="fchat-typing">
                <span /><span /><span />
              </div>
            </div>
          )}

          <div ref={bottomRef} />
        </div>

        {/* Footer / Input */}
        <div className="fchat-footer">
          <textarea
            ref={inputRef}
            className="fchat-input"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything about your career…"
            rows={1}
            aria-label="Chat message input"
            disabled={loading}
            style={{ minWidth: 0 }}
          />
          <button
            type="button"
            onClick={handleVoice}
            title="Voice input"
            aria-label="Voice input"
            style={{
              width: '38px', height: '38px', borderRadius: '10px', flexShrink: 0,
              border: `1px solid ${isListening ? 'rgba(220,38,38,0.3)' : 'var(--dash-card-border, #e8edf3)'}`,
              background: isListening ? '#fef2f2' : 'var(--bg-secondary, #f9fafb)',
              cursor: 'pointer', display: 'grid', placeItems: 'center',
              color: isListening ? '#dc2626' : '#6b7280',
              transition: 'all 150ms',
            }}
          >
            <Mic size={14} />
          </button>
          <button
            type="button"
            className="fchat-send-btn"
            onClick={() => handleSend()}
            disabled={loading || !input.trim()}
            aria-label="Send message"
          >
            <Send size={15} />
          </button>
        </div>
      </div>
    </>
  );
}
