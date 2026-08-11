'use client';
import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  MessageSquare, Mic, Send, Loader2, Bot, User, ArrowLeft,
  Plus, Trash2, Clock, ChevronLeft, ChevronRight, PanelLeft, X,
} from 'lucide-react';
import { sendChatMessageApi } from '@/api/chatApi';
import ReactMarkdown from 'react-markdown';
import toast from 'react-hot-toast';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  role: 'user' | 'bot';
  text: string;
}
interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
}

const STORAGE_KEY = 'chatbot_sessions';
const MAX_SESSIONS = 20;

// ── Helpers ───────────────────────────────────────────────────────────────────
function loadSessions(): ChatSession[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
  catch { return []; }
}
function saveSessions(sessions: ChatSession[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
}
function makeSessionId() {
  return `chat_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}
function makeTitle(msg: string) {
  return msg.length > 46 ? msg.slice(0, 46) + '…' : msg;
}
function relativeTime(ts: number) {
  const diff = Date.now() - ts;
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Date(ts).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
}

// ── CodeBlock ─────────────────────────────────────────────────────────────────
function CodeBlock({ language, value }: { language: string; value: string }) {
  return (
    <div style={{ marginTop: 10, borderRadius: 12, overflow: 'hidden', border: '1px solid #374151' }}>
      <div style={{ background: '#111827', color: '#fff', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '12px' }}>{language}</span>
        <button
          onClick={() => { navigator.clipboard.writeText(value); toast.success('Copied!'); }}
          style={{ background: 'transparent', border: 'none', color: '#9ca3af', cursor: 'pointer', fontSize: '11px', fontWeight: 600 }}
        >
          Copy
        </button>
      </div>
      <SyntaxHighlighter language={language} style={oneDark} customStyle={{ margin: 0 }}>
        {value}
      </SyntaxHighlighter>
    </div>
  );
}

// ── Sidebar ───────────────────────────────────────────────────────────────────
function Sidebar({
  sessions, activeId, onSelect, onNew, onDelete, isDark,
  collapsed, onToggle, mobileOpen, onMobileClose,
}: {
  sessions: ChatSession[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onNew: () => void;
  onDelete: (id: string) => void;
  isDark: boolean;
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}) {
  const bg  = isDark ? '#0f1117' : '#f9fafb';
  const bdr = isDark ? '#1e2433' : '#e5e7eb';
  const txt = isDark ? '#f1f5f9' : '#0f1729';
  const sub = isDark ? '#64748b' : '#9ca3af';
  const hov = isDark ? '#1a1f2e' : '#f0f4ff';
  const act = isDark ? '#1e2844' : '#eef2ff';

  const sessionList = (
    <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
      {sessions.length === 0 ? (
        <div style={{ padding: '28px 12px', textAlign: 'center' }}>
          <MessageSquare size={26} style={{ color: sub, display: 'block', margin: '0 auto 10px' }} />
          <p style={{ fontSize: '12px', color: sub, lineHeight: 1.6, margin: 0 }}>
            No chats yet.<br />Start a new conversation.
          </p>
        </div>
      ) : (
        sessions.map((s) => (
          <div
            key={s.id}
            onClick={() => { onSelect(s.id); onMobileClose(); }}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '9px 10px', borderRadius: '9px', marginBottom: '3px',
              background: s.id === activeId ? act : 'transparent',
              border: s.id === activeId ? `1px solid ${isDark ? '#2e3d6b' : '#c7d2fe'}` : '1px solid transparent',
              cursor: 'pointer', transition: 'background 120ms',
            }}
            onMouseEnter={(e) => { if (s.id !== activeId) (e.currentTarget as HTMLElement).style.background = hov; }}
            onMouseLeave={(e) => { if (s.id !== activeId) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            <MessageSquare size={13} style={{ color: s.id === activeId ? '#2255ec' : sub, flexShrink: 0 }} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: '12px', fontWeight: s.id === activeId ? 600 : 400, color: s.id === activeId ? txt : (isDark ? '#cbd5e1' : '#374151'), whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', margin: 0 }}>
                {s.title}
              </p>
              <p style={{ fontSize: '10px', color: sub, margin: '2px 0 0', display: 'flex', alignItems: 'center', gap: '3px' }}>
                <Clock size={9} /> {relativeTime(s.updatedAt)}
              </p>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onDelete(s.id); }}
              title="Delete"
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: sub, padding: '3px', borderRadius: '5px', flexShrink: 0, opacity: 0.6 }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.opacity = '1'; (e.currentTarget as HTMLElement).style.color = '#dc2626'; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.opacity = '0.6'; (e.currentTarget as HTMLElement).style.color = sub; }}
            >
              <Trash2 size={11} />
            </button>
          </div>
        ))
      )}
    </div>
  );

  // ── Mobile: full-height overlay drawer ──────────────────────────────────
  const mobileDrawer = (
    <>
      {/* Backdrop */}
      {mobileOpen && (
        <div
          className="chatbot-sidebar-backdrop"
          onClick={onMobileClose}
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,41,0.48)', zIndex: 299, backdropFilter: 'blur(2px)' }}
        />
      )}
      {/* Drawer */}
      <div
        className="chatbot-sidebar-drawer"
        style={{
          position: 'fixed', top: 0, left: 0, height: '100dvh', width: '280px',
          background: bg, borderRight: `1px solid ${bdr}`,
          boxShadow: '4px 0 28px rgba(0,0,0,0.18)',
          zIndex: 300, display: 'flex', flexDirection: 'column',
          transform: mobileOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 260ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* Drawer header */}
        <div style={{ padding: '14px 14px', borderBottom: `1px solid ${bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
          <span style={{ fontSize: '14px', fontWeight: 700, color: txt }}>Chat History</span>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => { onNew(); onMobileClose(); }}
              style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2255ec', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <Plus size={15} style={{ color: '#fff' }} />
            </button>
            <button
              onClick={onMobileClose}
              style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'none', border: `1px solid ${bdr}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sub }}
            >
              <X size={15} />
            </button>
          </div>
        </div>
        {sessionList}
      </div>
    </>
  );

  // ── Desktop: inline sidebar (collapsible) ────────────────────────────────
  const desktopSidebar = (
    <div
      className="chatbot-sidebar-desktop"
      style={{
        width: collapsed ? '52px' : '260px', minWidth: collapsed ? '52px' : '260px',
        background: bg, borderRight: `1px solid ${bdr}`,
        display: 'flex', flexDirection: 'column',
        transition: 'width 220ms ease, min-width 220ms ease',
        overflow: 'hidden', flexShrink: 0,
      }}
    >
      {/* Desktop header */}
      <div style={{ padding: '14px 12px', borderBottom: `1px solid ${bdr}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px', flexShrink: 0 }}>
        {!collapsed && <span style={{ fontSize: '13px', fontWeight: 700, color: txt, whiteSpace: 'nowrap' }}>Chat History</span>}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginLeft: collapsed ? 'auto' : undefined }}>
          {!collapsed && (
            <button onClick={onNew} title="New chat" style={{ width: '30px', height: '30px', borderRadius: '8px', background: '#2255ec', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Plus size={14} style={{ color: '#fff' }} />
            </button>
          )}
          <button onClick={onToggle} title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'} style={{ width: '30px', height: '30px', borderRadius: '8px', background: 'none', border: `1px solid ${bdr}`, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: sub, flexShrink: 0 }}>
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>
      </div>

      {/* Collapsed icon rail */}
      {collapsed ? (
        <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', padding: '10px 0' }}>
          <button onClick={onNew} title="New chat" style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2255ec', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '4px' }}>
            <Plus size={14} style={{ color: '#fff' }} />
          </button>
          {sessions.slice(0, 12).map((s) => (
            <button key={s.id} onClick={() => onSelect(s.id)} title={s.title} style={{ width: '32px', height: '32px', borderRadius: '8px', border: 'none', background: s.id === activeId ? '#2255ec' : 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageSquare size={13} style={{ color: s.id === activeId ? '#fff' : sub }} />
            </button>
          ))}
        </div>
      ) : sessionList}
    </div>
  );

  return (
    <>
      {mobileDrawer}
      {desktopSidebar}
    </>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ChatAssistant() {
  const { isDark } = useTheme();

  const [sessions, setSessions]             = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const [input, setInput]     = useState('');
  const [loading, setLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load sessions
  useEffect(() => {
    const stored = loadSessions();
    setSessions(stored);
    if (stored.length > 0) setActiveSessionId(stored[0].id);
  }, []);

  // Auto-scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [sessions, activeSessionId, loading]);

  // Close mobile sidebar on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') setMobileSidebarOpen(false); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const activeSession = sessions.find((s) => s.id === activeSessionId) ?? null;

  const updateSession = useCallback((id: string, updater: (s: ChatSession) => ChatSession) => {
    setSessions((prev) => {
      const next = prev.map((s) => (s.id === id ? updater(s) : s));
      next.sort((a, b) => b.updatedAt - a.updatedAt);
      saveSessions(next);
      return next;
    });
  }, []);

  const startNewChat = useCallback(() => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const welcome: Message = {
      role: 'bot',
      text: `Hi ${user?.name || 'there'}! 👋 I'm your AI Career Assistant. Ask me anything about resumes, job search, interview tips, or career growth. 🚀`,
    };
    const s: ChatSession = { id: makeSessionId(), title: 'New Chat', messages: [welcome], createdAt: Date.now(), updatedAt: Date.now() };
    setSessions((prev) => { const next = [s, ...prev].slice(0, MAX_SESSIONS); saveSessions(next); return next; });
    setActiveSessionId(s.id);
    setInput('');
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => { const next = prev.filter((s) => s.id !== id); saveSessions(next); return next; });
    setActiveSessionId((cur) => {
      if (cur !== id) return cur;
      return sessions.find((s) => s.id !== id)?.id ?? null;
    });
    toast.success('Chat deleted');
  }, [sessions]);

  // Voice
  interface SpeechRecognitionInstance {
    lang: string; interimResults: boolean;
    onstart: (() => void) | null; onend: (() => void) | null;
    onresult: ((e: { results: { [key: number]: { [key: number]: { transcript: string } } } }) => void) | null;
    start: () => void;
  }
  type SpeechRecognitionCtor = new () => SpeechRecognitionInstance;
  const handleVoice = () => {
    const SR = (
      (window as Window & { webkitSpeechRecognition?: SpeechRecognitionCtor }).webkitSpeechRecognition ||
      (window as Window & { SpeechRecognition?: SpeechRecognitionCtor }).SpeechRecognition
    );
    if (!SR) { toast.error('Speech recognition not supported.'); return; }
    const r = new SR();
    r.lang = 'en-US'; r.interimResults = false;
    r.onstart = () => setIsListening(true);
    r.onend   = () => setIsListening(false);
    r.onresult = (e) => setInput(e.results[0][0].transcript);
    r.start();
  };

  // Send
  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    let sessionId = activeSessionId;
    if (!sessionId || !sessions.find((s) => s.id === sessionId)) {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const welcome: Message = { role: 'bot', text: `Hi ${user?.name || 'there'}! 👋 I'm your AI Career Assistant. Ask me anything about resumes, job search, interview tips, or career growth. 🚀` };
      const newS: ChatSession = { id: makeSessionId(), title: 'New Chat', messages: [welcome], createdAt: Date.now(), updatedAt: Date.now() };
      setSessions((prev) => { const next = [newS, ...prev].slice(0, MAX_SESSIONS); saveSessions(next); return next; });
      sessionId = newS.id;
      setActiveSessionId(sessionId);
    }
    const userMsg = input.trim();
    setInput('');
    const isFirst = sessions.find((s) => s.id === sessionId)?.messages.filter((m) => m.role === 'user').length === 0;
    updateSession(sessionId, (s) => ({ ...s, title: isFirst ? makeTitle(userMsg) : s.title, messages: [...s.messages, { role: 'user', text: userMsg }], updatedAt: Date.now() }));
    setLoading(true);
    try {
      const res = await sendChatMessageApi(userMsg);
      updateSession(sessionId, (s) => ({ ...s, messages: [...s.messages, { role: 'bot', text: res.data.reply }], updatedAt: Date.now() }));
    } catch {
      updateSession(sessionId, (s) => ({ ...s, messages: [...s.messages, { role: 'bot', text: 'Sorry, I ran into an error. Please make sure the server is running and try again.' }], updatedAt: Date.now() }));
    } finally {
      setLoading(false);
    }
  };

  // Colour tokens
  const mBg       = isDark ? '#141720' : '#ffffff';
  const mBdr      = isDark ? '#1e2433' : '#e5e7eb';
  const mTxt      = isDark ? '#f1f5f9' : '#0f1729';
  const mSub      = isDark ? '#64748b' : '#6b7280';
  const mAvatBg   = isDark ? 'rgba(5,150,105,0.2)' : '#f0fdf4';
  const msgBotBg  = isDark ? '#0f1117' : '#f9fafb';
  const msgBotBdr = isDark ? '#1e2433' : '#e5e7eb';
  const msgBotClr = isDark ? '#cbd5e1' : '#374151';
  const iBg       = isDark ? '#0f1117' : '#ffffff';
  const iClr      = isDark ? '#e2e8f0' : '#0f1729';
  const iBdr      = isDark ? '#1e2433' : '#e5e7eb';
  const footBg    = isDark ? '#141720' : '#ffffff';
  const headerBg  = isDark ? '#1a1f2e' : '#ffffff';

  const messages = activeSession?.messages ?? [];

  return (
    <div className="chatbot-root" style={{ height: 'calc(100vh - 56px)', background: isDark ? '#141720' : '#f9fafb', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>

      {/* ── Top bar ─────────────────────────────────────────────────────── */}
      <div className="chatbot-topbar" style={{ background: headerBg, borderBottom: `1px solid ${mBdr}`, padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0, gap: '8px' }}>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', minWidth: 0 }}>
          {/* Mobile: hamburger to open history drawer */}
          <button
            className="chatbot-history-btn"
            onClick={() => setMobileSidebarOpen(true)}
            aria-label="Open chat history"
            style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'none', border: `1px solid ${mBdr}`, cursor: 'pointer', display: 'none', alignItems: 'center', justifyContent: 'center', color: mSub, flexShrink: 0 }}
          >
            <PanelLeft size={16} />
          </button>

          <Link href="/homepage" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', textDecoration: 'none', color: mSub, fontSize: '12px', flexShrink: 0 }}>
            <ArrowLeft size={13} /> <span className="chatbot-back-label">Back</span>
          </Link>

          <span style={{ color: mBdr, flexShrink: 0 }}>|</span>

          <div style={{ display: 'flex', alignItems: 'center', gap: '7px', minWidth: 0 }}>
            <div style={{ width: '28px', height: '28px', borderRadius: '8px', background: mAvatBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <Bot size={14} style={{ color: '#059669' }} />
            </div>
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '13px', fontWeight: 700, color: mTxt, margin: 0 }}>CareerBot</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', display: 'inline-block', flexShrink: 0 }} />
                <p className="chatbot-status-label" style={{ fontSize: '10px', color: mSub, margin: 0, whiteSpace: 'nowrap' }}>AI Career Assistant</p>
              </div>
            </div>
          </div>

          {/* Active session title — hidden on very small screens */}
          {activeSession && activeSession.title !== 'New Chat' && (
            <span className="chatbot-active-title" style={{ fontSize: '11px', color: mSub, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '160px' }}>
              — {activeSession.title}
            </span>
          )}
        </div>

        <button
          onClick={startNewChat}
          className="chatbot-newchat-btn"
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 14px', borderRadius: '8px', background: '#059669', color: '#fff', fontSize: '12px', fontWeight: 600, border: 'none', cursor: 'pointer', transition: 'background 150ms', flexShrink: 0, whiteSpace: 'nowrap' }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
        >
          <Plus size={13} /> <span className="chatbot-newchat-label">New Chat</span>
        </button>
      </div>

      {/* ── Body ────────────────────────────────────────────────────────── */}
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>

        <Sidebar
          sessions={sessions}
          activeId={activeSessionId}
          onSelect={(id) => { setActiveSessionId(id); setInput(''); }}
          onNew={startNewChat}
          onDelete={deleteSession}
          isDark={isDark}
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed((v) => !v)}
          mobileOpen={mobileSidebarOpen}
          onMobileClose={() => setMobileSidebarOpen(false)}
        />

        {/* ── Chat panel ──────────────────────────────────────────────── */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', background: mBg }}>

          {/* Empty state */}
          {!activeSession ? (
            <div className="chatbot-empty" style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '18px', background: mAvatBg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <MessageSquare size={28} style={{ color: '#059669' }} />
              </div>
              <h2 style={{ fontSize: '20px', fontWeight: 700, color: mTxt, marginBottom: '10px' }}>Start a Conversation</h2>
              <p style={{ fontSize: '14px', color: mSub, maxWidth: '340px', lineHeight: 1.7, marginBottom: '28px' }}>
                Ask anything about resumes, job search, career paths, interview tips, or skill development.
              </p>
              <button
                onClick={startNewChat}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '12px 24px', borderRadius: '10px', background: '#059669', color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5,150,105,0.3)', transition: 'background 150ms' }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#047857')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#059669')}
              >
                <Plus size={15} /> Start New Chat
              </button>
            </div>
          ) : (
            <>
              {/* Messages */}
              <div className="chatbot-messages" style={{ flex: 1, overflowY: 'auto', padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {messages.map((m, i) => (
                  <div key={i} style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: m.role === 'user' ? '#2255ec' : mAvatBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {m.role === 'user' ? <User size={13} style={{ color: '#fff' }} /> : <Bot size={13} style={{ color: '#059669' }} />}
                    </div>
                    <div className="chatbot-bubble" style={{ maxWidth: '72%', padding: '10px 14px', borderRadius: m.role === 'user' ? '14px 4px 14px 14px' : '4px 14px 14px 14px', background: m.role === 'user' ? '#2255ec' : msgBotBg, border: m.role === 'bot' ? `1px solid ${msgBotBdr}` : 'none', fontSize: '13px', color: m.role === 'user' ? '#fff' : msgBotClr, lineHeight: 1.65, wordBreak: 'break-word' }}>
                      {m.role === 'bot' ? (
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            code({ className, children }: { className?: string; children?: React.ReactNode }) {
                              const match = /language-(\w+)/.exec(className || '');
                              if (match) return <CodeBlock language={match[1]} value={String(children)} />;
                              return <code style={{ background: isDark ? '#0f1117' : '#eef2ff', padding: '2px 5px', borderRadius: '4px', color: isDark ? '#e2e8f0' : undefined }}>{children}</code>;
                            },
                          }}
                        >
                          {m.text}
                        </ReactMarkdown>
                      ) : m.text}
                    </div>
                  </div>
                ))}

                {/* Typing dots */}
                {loading && (
                  <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: mAvatBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Bot size={13} style={{ color: '#059669' }} />
                    </div>
                    <div style={{ padding: '12px 16px', borderRadius: '4px 14px 14px 14px', background: msgBotBg, border: `1px solid ${msgBotBdr}`, display: 'flex', gap: '4px', alignItems: 'center' }}>
                      {[0, 1, 2].map((i) => (
                        <span key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#9ca3af', display: 'inline-block', animation: `bounce 1.2s ${i * 0.2}s infinite` }} />
                      ))}
                    </div>
                  </div>
                )}
                <div ref={bottomRef} />
              </div>

              {/* Input bar */}
              <div className="chatbot-input-bar" style={{ padding: '12px 16px', borderTop: `1px solid ${mBdr}`, flexShrink: 0, background: footBg }}>
                <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', maxWidth: '900px', margin: '0 auto' }}>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Ask anything about your career…"
                    className="chatbot-input"
                    style={{ flex: 1, minWidth: 0, padding: '10px 14px', borderRadius: '10px', border: `1px solid ${iBdr}`, fontSize: '14px', outline: 'none', background: iBg, color: iClr, fontFamily: 'inherit', transition: 'border-color 150ms' }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#059669')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = iBdr)}
                  />
                  <button
                    type="button"
                    onClick={handleVoice}
                    aria-label="Voice input"
                    className="chatbot-icon-btn"
                    style={{ width: '42px', height: '42px', borderRadius: '10px', border: `1px solid ${isListening ? 'rgba(220,38,38,0.3)' : iBdr}`, background: isListening ? '#fef2f2' : (isDark ? '#0f1117' : '#fff'), cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isListening ? '#dc2626' : mSub, flexShrink: 0 }}
                  >
                    <Mic size={16} />
                  </button>
                  <button
                    type="submit"
                    disabled={loading || !input.trim()}
                    className="chatbot-icon-btn"
                    style={{ width: '42px', height: '42px', borderRadius: '10px', background: loading || !input.trim() ? (isDark ? '#064e3b' : '#d1fae5') : '#059669', border: 'none', cursor: loading || !input.trim() ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'background 150ms' }}
                  >
                    {loading
                      ? <Loader2 size={16} style={{ color: '#059669', animation: 'spin 1s linear infinite' }} />
                      : <Send size={16} style={{ color: '#fff' }} />
                    }
                  </button>
                </form>
                <p style={{ textAlign: 'center', fontSize: '11px', color: mSub, marginTop: '6px' }}>
                  AI can make mistakes. Verify important career advice.
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        @keyframes spin   { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes bounce { 0%,80%,100% { transform: translateY(0); } 40% { transform: translateY(-6px); } }
      `}</style>
    </div>
  );
}
