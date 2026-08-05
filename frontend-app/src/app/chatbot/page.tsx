'use client';
import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { MessageSquare, Mic, Send, X, Loader2, Bot, User, ArrowLeft } from 'lucide-react';
import { sendChatMessageApi } from '@/api/chatApi';

interface Message {
  role: 'user' | 'bot';
  text: string;
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open && messages.length === 0) {
      const user = JSON.parse(
      localStorage.getItem('user') || '{}'
    );

      setMessages([
      {
        role: 'bot',
        text: `Hi ${user?.name || 'Friend'}! 👋 I'm your AI Career Assistant. Ask me anything about resumes, job search, interview tips, or career growth. 🚀`
      }
    ]);
    }
  }, [open]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleVoice = () => {
    const SR = (window as Window & { webkitSpeechRecognition?: new () => SpeechRecognition; SpeechRecognition?: new () => SpeechRecognition }).webkitSpeechRecognition
      || (window as Window & { SpeechRecognition?: new () => SpeechRecognition }).SpeechRecognition;
    if (!SR) { alert('Speech recognition not supported.'); return; }
    const r = new SR();
    r.lang = 'en-US'; r.interimResults = false;
    r.onstart = () => setIsListening(true);
    r.onend = () => setIsListening(false);
    r.onresult = (e: SpeechRecognitionEvent) => setInput(e.results[0][0].transcript);
    r.start();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await sendChatMessageApi(userMsg);
      setMessages(prev => [...prev, { role: 'bot', text: res.data.reply }]);
    } catch {
      setMessages(prev => [...prev, { role: 'bot', text: 'Sorry, I ran into an error. Please make sure the server is running and try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    { icon: Bot, label: 'AI-Powered', desc: 'Intelligent responses to career questions' },
    { icon: Mic, label: 'Voice Input', desc: 'Speak your questions hands-free' },
    { icon: MessageSquare, label: 'Instant Answers', desc: 'Get guidance on any career topic' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb' }}>
      {/* Back bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 48px' }}>
        <Link href="/homepage" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#374151', fontSize: '13px' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg,#f0fdf4 0%,#f9fafb 60%)', borderBottom: '1px solid #e5e7eb', padding: '64px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '12px', fontWeight: 600, color: '#059669', marginBottom: '24px' }}>
          <MessageSquare size={13} /> AI Assistant
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#0f1729', lineHeight: 1.15, marginBottom: '16px' }}>
          Career<br /><span style={{ color: '#059669' }}>Chat Assistant</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          Ask anything about careers, skills, job market trends, or interview tips. Your AI career advisor is available 24/7.
        </p>
        <button onClick={() => setOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', borderRadius: '10px', background: '#059669', color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5,150,105,0.3)', transition: 'background 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#047857')}
          onMouseLeave={e => (e.currentTarget.style.background = '#059669')}>
          Start Chatting <MessageSquare size={15} />
        </button>
      </div>

      {/* Highlights */}
      <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }}>
          {highlights.map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', transition: 'box-shadow 200ms, transform 200ms' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Icon size={18} style={{ color: '#059669' }} />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f1729', marginBottom: '6px' }}>{label}</p>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Chat Modal */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,41,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '560px', height: '600px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

            {/* Header */}
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Bot size={18} style={{ color: '#059669' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>CareerBot</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                    <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                    <p style={{ fontSize: '11px', color: '#6b7280' }}>Online — AI Career Assistant</p>
                  </div>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', borderRadius: '6px', transition: 'background 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                onMouseLeave={e => (e.currentTarget.style.background = 'none')}>
                <X size={18} />
              </button>
            </div>

            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: m.role === 'user' ? '#2255ec' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    {m.role === 'user' ? <User size={14} style={{ color: '#fff' }} /> : <Bot size={14} style={{ color: '#059669' }} />}
                  </div>
                  <div style={{ maxWidth: '75%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: m.role === 'user' ? '#2255ec' : '#f9fafb', border: m.role === 'bot' ? '1px solid #e5e7eb' : 'none', fontSize: '13px', color: m.role === 'user' ? '#fff' : '#374151', lineHeight: 1.65 }}>
                    {m.text}
                  </div>
                </div>
              ))}
              {loading && (
                <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                  <div style={{ width: '30px', height: '30px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Bot size={14} style={{ color: '#059669' }} />
                  </div>
                  <div style={{ padding: '12px 16px', borderRadius: '4px 14px 14px 14px', background: '#f9fafb', border: '1px solid #e5e7eb', display: 'flex', gap: '4px', alignItems: 'center' }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af', display: 'inline-block', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                    ))}
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div style={{ padding: '16px 20px', borderTop: '1px solid #f3f4f6', flexShrink: 0 }}>
              <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px' }}>
                <input
                  type="text" value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Ask anything about your career..."
                  style={{ flex: 1, padding: '10px 14px', borderRadius: '10px', border: '1px solid #e5e7eb', fontSize: '13px', outline: 'none', transition: 'border-color 150ms' }}
                  onFocus={e => (e.currentTarget.style.borderColor = '#059669')}
                  onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
                <button type="button" onClick={handleVoice}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', border: `1px solid ${isListening ? 'rgba(220,38,38,0.3)' : '#e5e7eb'}`, background: isListening ? '#fef2f2' : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isListening ? '#dc2626' : '#6b7280', flexShrink: 0 }}
                  aria-label="Voice input">
                  <Mic size={15} />
                </button>
                <button type="submit" disabled={loading || !input.trim()}
                  style={{ width: '40px', height: '40px', borderRadius: '10px', background: loading || !input.trim() ? '#d1fae5' : '#059669', border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 150ms' }}>
                  {loading ? <Loader2 size={15} style={{ color: '#059669', animation: 'spin 1s linear infinite' }} /> : <Send size={15} style={{ color: '#fff' }} />}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}
