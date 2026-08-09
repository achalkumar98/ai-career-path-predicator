'use client';
import { useEffect, useRef, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import api from '@/lib/axios';
import {
  PanelLeft, Bell, LogOut, User, Settings, X,
  MessageCircle, Phone, Loader2,
} from 'lucide-react';
import InstallPWA from '@/components/InstallPWA';

const pageTitles: Record<string, string> = {
  '/homepage':         'Dashboard',
  '/career-navigator': 'Career Navigator',
  '/progress-tracker': 'Progress Tracker',
  '/resume-analyzer':  'Resume Analyzer',
  '/insights':         'Personality & Trends',
  '/chatbot':          'Chat Assistant',
  '/profile':          'Profile',
  '/account-settings': 'Account Settings',
  '/feedback':         'Feedback',
  '/job-matching':     'Job Matching',
};

interface ApiNotification {
  _id: string;
  type: 'feedback' | 'contact';
  title: string;
  description: string;
  meta: Record<string, unknown>;
  read: boolean;
  createdAt: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins  = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days  = Math.floor(diff / 86_400_000);
  if (mins  < 1)  return 'just now';
  if (mins  < 60) return `${mins}m ago`;
  if (hours < 24) return `${hours}h ago`;
  return `${days}d ago`;
}

function NotifIcon({ type }: { type: 'feedback' | 'contact' }) {
  if (type === 'feedback')
    return <MessageCircle size={15} style={{ color: '#7c3aed' }} />;
  return <Phone size={15} style={{ color: '#d97706' }} />;
}

interface AppHeaderProps { toggleSidebar: () => void; }

export default function AppHeader({ toggleSidebar }: AppHeaderProps) {
  const { isDark } = useTheme();
  const router   = useRouter();
  const pathname = usePathname();

  const [user,    setUser]    = useState<{ name?: string; email?: string } | null>(null);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showBell,   setShowBell]   = useState(false);

  // notifications state
  const [notifications, setNotifications] = useState<ApiNotification[]>([]);
  const [notifLoading,  setNotifLoading]  = useState(false);
  const [notifError,    setNotifError]    = useState(false);

  const avatarRef = useRef<HTMLDivElement>(null);
  const bellRef   = useRef<HTMLDivElement>(null);

  const title      = pageTitles[pathname] ?? 'Dashboard';
  const unreadCount = notifications.filter(n => !n.read).length;

  // ── colour tokens ──────────────────────────────────────────
  const headerBg      = isDark ? 'rgba(15,17,23,0.95)'  : 'rgba(255,255,255,0.95)';
  const headerBorder  = isDark ? '#272d3d'               : '#e5e7eb';
  const titleColor    = isDark ? '#f1f5f9'               : '#0f1729';
  const iconColor     = isDark ? '#94a3b8'               : '#6b7280';
  const iconHoverBg   = isDark ? '#1a1f2e'               : '#f3f4f6';
  const dropBg        = isDark ? '#1a1f2e'               : '#ffffff';
  const dropBorder    = isDark ? '#272d3d'               : '#e5e7eb';
  const dropShadow    = isDark ? '0 8px 32px rgba(0,0,0,0.5)' : '0 8px 32px rgba(0,0,0,0.12)';
  const dividerColor  = isDark ? '#272d3d'               : '#f3f4f6';
  const bodyColor     = isDark ? '#cbd5e1'               : '#374151';
  const mutedColor    = isDark ? '#64748b'               : '#9ca3af';
  const notifUnreadBg = isDark ? '#1a2036'               : '#f8f9ff';
  const notifItemBg   = isDark ? '#1a1f2e'               : '#ffffff';
  const notifHoverBg  = isDark ? '#272d3d'               : '#f3f4f6';
  const notifIconBg   = isDark ? '#272d3d'               : '#f3f4f6';

  const dropdownBase: React.CSSProperties = {
    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    background: dropBg, border: `1px solid ${dropBorder}`,
    borderRadius: '14px', boxShadow: dropShadow,
    zIndex: 100, overflow: 'hidden',
  };

  // ── load user ──────────────────────────────────────────────
  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
  }, []);

  // ── fetch notifications ────────────────────────────────────
  const fetchNotifications = useCallback(async () => {
    setNotifLoading(true);
    setNotifError(false);
    try {
      const res = await api.get<ApiNotification[]>('/notifications?limit=30');
      setNotifications(res.data);
    } catch {
      setNotifError(true);
    } finally {
      setNotifLoading(false);
    }
  }, []);

  // fetch on mount + every 60 s
  useEffect(() => {
    fetchNotifications();
    const id = setInterval(fetchNotifications, 60_000);
    return () => clearInterval(id);
  }, [fetchNotifications]);

  // re-fetch when bell opens
  useEffect(() => {
    if (showBell) fetchNotifications();
  }, [showBell, fetchNotifications]);

  // ── close dropdowns on outside click ──────────────────────
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setShowAvatar(false);
      if (bellRef.current   && !bellRef.current.contains(e.target as Node))   setShowBell(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── notification actions ───────────────────────────────────
  const handleMarkAllRead = async () => {
    try {
      await api.patch('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch { /* silent */ }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n._id === id ? { ...n, read: true } : n));
    } catch { /* silent */ }
  };

  const handleDismiss = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await api.delete(`/notifications/${id}`);
      setNotifications(prev => prev.filter(n => n._id !== id));
    } catch { /* silent */ }
  };

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      height: '56px',
      background: headerBg,
      backdropFilter: 'blur(8px)',
      borderBottom: `1px solid ${headerBorder}`,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', gap: '16px',
      transition: 'background 300ms, border-color 300ms',
    }}>

      {/* ── Left ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={toggleSidebar}
          style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor, transition: 'background 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.background = iconHoverBg)}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={16} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: 600, color: titleColor }}>{title}</span>
      </div>

      {/* ── Right ── */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* ── Install PWA ── */}
        <InstallPWA variant="icon" />

        {/* ── Bell ── */}
        <div ref={bellRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowBell(v => !v); setShowAvatar(false); }}
            style={{ width: '32px', height: '32px', borderRadius: '8px', background: showBell ? iconHoverBg : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: iconColor, transition: 'background 150ms', position: 'relative' }}
            onMouseEnter={e => (e.currentTarget.style.background = iconHoverBg)}
            onMouseLeave={e => (e.currentTarget.style.background = showBell ? iconHoverBg : 'transparent')}
            aria-label="Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute', top: '5px', right: '5px',
                width: '8px', height: '8px', borderRadius: '50%',
                background: '#2255ec', border: `1.5px solid ${isDark ? '#0f1117' : '#fff'}`,
              }} />
            )}
          </button>

          {showBell && (
            <div style={{ ...dropdownBase, width: '360px' }} className="notif-dropdown">

              {/* Dropdown header */}
              <div style={{ padding: '16px 18px 12px', borderBottom: `1px solid ${dividerColor}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: titleColor }}>Notifications</p>
                  <p style={{ fontSize: '11px', color: mutedColor, marginTop: '2px' }}>
                    {notifLoading ? 'Refreshing…' : unreadCount > 0 ? `${unreadCount} unread` : 'All caught up'}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {unreadCount > 0 && (
                    <button onClick={handleMarkAllRead} style={{ fontSize: '11px', color: '#2255ec', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                      Mark all read
                    </button>
                  )}
                  <button
                    onClick={fetchNotifications}
                    disabled={notifLoading}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: mutedColor, display: 'flex', alignItems: 'center', padding: '2px' }}
                    title="Refresh"
                    aria-label="Refresh notifications"
                  >
                    <Loader2 size={13} className={notifLoading ? 'spin' : ''} />
                  </button>
                </div>
              </div>

              {/* List */}
              <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                {notifError ? (
                  <div style={{ padding: '28px', textAlign: 'center' }}>
                    <p style={{ fontSize: '13px', color: '#dc2626', marginBottom: '10px' }}>Failed to load notifications</p>
                    <button onClick={fetchNotifications} style={{ fontSize: '12px', color: '#2255ec', background: 'none', border: 'none', cursor: 'pointer' }}>Try again</button>
                  </div>
                ) : notifications.length === 0 && !notifLoading ? (
                  <div style={{ padding: '36px', textAlign: 'center' }}>
                    <div style={{ fontSize: '32px', marginBottom: '10px' }}>🔔</div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: titleColor, marginBottom: '4px' }}>No notifications yet</p>
                    <p style={{ fontSize: '12px', color: mutedColor }}>You&apos;ll see feedback and contact messages here.</p>
                  </div>
                ) : (
                  notifications.map(n => (
                    <div
                      key={n._id}
                      onClick={() => handleMarkRead(n._id)}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: '12px',
                        padding: '13px 18px',
                        background: !n.read ? notifUnreadBg : notifItemBg,
                        borderBottom: `1px solid ${dividerColor}`,
                        transition: 'background 150ms',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={e => (e.currentTarget.style.background = notifHoverBg)}
                      onMouseLeave={e => (e.currentTarget.style.background = !n.read ? notifUnreadBg : notifItemBg)}
                    >
                      {/* Icon */}
                      <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: notifIconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <NotifIcon type={n.type} />
                      </div>

                      {/* Content */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '3px' }}>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: titleColor, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{n.title}</p>
                          {!n.read && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2255ec', flexShrink: 0 }} />}
                        </div>
                        <p style={{ fontSize: '12px', color: bodyColor, lineHeight: 1.55, marginBottom: '5px' }}>{n.description}</p>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <span style={{ fontSize: '10px', fontWeight: 600, color: n.type === 'feedback' ? '#7c3aed' : '#d97706', background: n.type === 'feedback' ? (isDark ? '#2d1f4a' : '#f5f3ff') : (isDark ? '#3d2a0f' : '#fffbeb'), padding: '2px 7px', borderRadius: '9999px', textTransform: 'capitalize' }}>
                            {n.type}
                          </span>
                          <span style={{ fontSize: '11px', color: mutedColor }}>{timeAgo(n.createdAt)}</span>
                        </div>
                      </div>

                      {/* Dismiss */}
                      <button
                        onClick={e => handleDismiss(e, n._id)}
                        style={{ background: 'none', border: 'none', cursor: 'pointer', color: isDark ? '#475569' : '#d1d5db', padding: '2px', flexShrink: 0, display: 'flex', alignItems: 'center' }}
                        onMouseEnter={e => (e.currentTarget.style.color = iconColor)}
                        onMouseLeave={e => (e.currentTarget.style.color = isDark ? '#475569' : '#d1d5db')}
                        aria-label="Dismiss"
                      >
                        <X size={13} />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {/* Footer */}
              {notifications.length > 0 && (
                <div style={{ padding: '10px 18px', borderTop: `1px solid ${dividerColor}`, textAlign: 'center' }}>
                  <p style={{ fontSize: '11px', color: mutedColor }}>
                    Showing {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── Avatar ── */}
        <div ref={avatarRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowAvatar(v => !v); setShowBell(false); }}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: isDark ? '#1e2844' : '#e8eaf6', border: showAvatar ? '2px solid #2255ec' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#2255ec', transition: 'border-color 150ms' }}
            aria-label="Profile menu"
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </button>

          {showAvatar && (
            <div style={{ ...dropdownBase, width: '220px' }}>
              {/* User info */}
              <div style={{ padding: '16px 18px', borderBottom: `1px solid ${dividerColor}`, display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: isDark ? '#1e2844' : '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#2255ec', flexShrink: 0 }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: titleColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
                  <p style={{ fontSize: '11px', color: mutedColor, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</p>
                </div>
              </div>

              {/* Menu items */}
              <div style={{ padding: '6px' }}>
                {[
                  { icon: User,     label: 'Profile',          href: '/profile' },
                  { icon: Settings, label: 'Account Settings', href: '/account-settings' },
                ].map(({ icon: Icon, label, href }) => (
                  <button
                    key={label}
                    onClick={() => { router.push(href); setShowAvatar(false); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: bodyColor, fontSize: '13px', textAlign: 'left', transition: 'background 150ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = iconHoverBg)}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <Icon size={14} style={{ color: iconColor, flexShrink: 0 }} />
                    {label}
                  </button>
                ))}

                <div style={{ borderTop: `1px solid ${dividerColor}`, margin: '4px 0' }} />

                <button
                  onClick={handleSignOut}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '13px', textAlign: 'left', transition: 'background 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = isDark ? '#2d1515' : '#fef2f2')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                >
                  <LogOut size={14} style={{ flexShrink: 0 }} />
                  Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
