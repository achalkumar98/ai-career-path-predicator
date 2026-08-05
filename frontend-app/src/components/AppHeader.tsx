'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { PanelLeft, Bell, LogOut, User, Settings, X, FileText, Lightbulb, BarChart3, Sparkles } from 'lucide-react';

const pageTitles: Record<string, string> = {
  '/homepage': 'Dashboard',
  '/career-navigator': 'Career Navigator',
  '/progress-tracker': 'Progress Tracker',
  '/resume-analyzer': 'Resume Analyzer',
  '/insights': 'Personality & Trends',
  '/chatbot': 'Chat Assistant',
  '/profile': 'Profile',
  '/account-settings': 'Account Settings',
  '/feedback': 'Feedback',
};

interface Notification {
  id: number;
  icon: React.ReactNode;
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

const NOTIFICATIONS: Notification[] = [
  {
    id: 1,
    icon: <FileText size={15} style={{ color: '#7c3aed' }} />,
    title: 'Resume analyzed successfully',
    desc: 'Your resume scored 87% ATS compatibility.',
    time: '2m ago',
    unread: true,
  },
  {
    id: 2,
    icon: <Lightbulb size={15} style={{ color: '#d97706' }} />,
    title: 'New career insight ready',
    desc: 'AI has generated personalized career tips for you.',
    time: '1h ago',
    unread: true,
  },
  {
    id: 3,
    icon: <BarChart3 size={15} style={{ color: '#059669' }} />,
    title: 'Assessment complete',
    desc: 'Your skill assessment results are now available.',
    time: '3h ago',
    unread: false,
  },
  {
    id: 4,
    icon: <Sparkles size={15} style={{ color: '#2255ec' }} />,
    title: 'Welcome to CareerNav',
    desc: 'Start by uploading your resume or exploring career paths.',
    time: '1d ago',
    unread: false,
  },
];

interface AppHeaderProps {
  toggleSidebar: () => void;
}

export default function AppHeader({ toggleSidebar }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ name?: string; email?: string } | null>(null);
  const [showAvatar, setShowAvatar] = useState(false);
  const [showBell, setShowBell] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS);

  const avatarRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);

  const title = pageTitles[pathname] || 'Dashboard';
  const unreadCount = notifications.filter(n => n.unread).length;

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) setShowAvatar(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setShowBell(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/login');
  };

  const markAllRead = () => setNotifications(n => n.map(x => ({ ...x, unread: false })));
  const dismiss = (id: number) => setNotifications(n => n.filter(x => x.id !== id));

  const dropdownBase: React.CSSProperties = {
    position: 'absolute', top: 'calc(100% + 10px)', right: 0,
    background: '#fff', border: '1px solid #e5e7eb',
    borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    zIndex: 100, overflow: 'hidden',
  };

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      height: '56px',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px', gap: '16px',
    }}>
      {/* Left */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={toggleSidebar}
          style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', transition: 'background 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={16} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f1729' }}>{title}</span>
      </div>

      {/* Right */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>

        {/* Bell */}
        <div ref={bellRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowBell(v => !v); setShowAvatar(false); }}
            style={{ width: '32px', height: '32px', borderRadius: '8px', background: showBell ? '#f3f4f6' : 'transparent', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', transition: 'background 150ms', position: 'relative' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={e => (e.currentTarget.style.background = showBell ? '#f3f4f6' : 'transparent')}
            aria-label="Notifications"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span style={{ position: 'absolute', top: '5px', right: '5px', width: '8px', height: '8px', borderRadius: '50%', background: '#2255ec', border: '1.5px solid #fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '8px', color: '#fff', fontWeight: 700 }} />
            )}
          </button>

          {showBell && (
            <div style={{ ...dropdownBase, width: '340px' }}>
              {/* Header */}
              <div style={{ padding: '16px 18px 12px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>Notifications</p>
                  {unreadCount > 0 && <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>{unreadCount} unread</p>}
                </div>
                {unreadCount > 0 && (
                  <button onClick={markAllRead} style={{ fontSize: '11px', color: '#2255ec', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>
                    Mark all read
                  </button>
                )}
              </div>

              {/* List */}
              <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
                {notifications.length === 0 ? (
                  <div style={{ padding: '32px', textAlign: 'center' }}>
                    <p style={{ fontSize: '24px', marginBottom: '8px' }}>🔔</p>
                    <p style={{ fontSize: '13px', color: '#9ca3af' }}>No notifications yet</p>
                  </div>
                ) : notifications.map(n => (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', padding: '12px 18px', background: n.unread ? '#f8f9ff' : '#fff', borderBottom: '1px solid #f9fafb', transition: 'background 150ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseLeave={e => (e.currentTarget.style.background = n.unread ? '#f8f9ff' : '#fff')}
                  >
                    <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      {n.icon}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '2px' }}>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1729', flex: 1 }}>{n.title}</p>
                        {n.unread && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#2255ec', flexShrink: 0 }} />}
                      </div>
                      <p style={{ fontSize: '12px', color: '#6b7280', lineHeight: 1.5, marginBottom: '4px' }}>{n.desc}</p>
                      <p style={{ fontSize: '11px', color: '#9ca3af' }}>{n.time}</p>
                    </div>
                    <button onClick={() => dismiss(n.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d1d5db', padding: '2px', flexShrink: 0, display: 'flex', alignItems: 'center' }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#6b7280')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#d1d5db')}
                    >
                      <X size={13} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div ref={avatarRef} style={{ position: 'relative' }}>
          <button
            onClick={() => { setShowAvatar(v => !v); setShowBell(false); }}
            style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e8eaf6', border: showAvatar ? '2px solid #2255ec' : '2px solid transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 700, color: '#2255ec', transition: 'border-color 150ms' }}
            aria-label="Profile menu"
          >
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </button>

          {showAvatar && (
            <div style={{ ...dropdownBase, width: '220px' }}>
              {/* User info */}
              <div style={{ padding: '16px 18px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#e8eaf6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 700, color: '#2255ec', flexShrink: 0 }}>
                  {user?.name?.[0]?.toUpperCase() || 'U'}
                </div>
                <div style={{ minWidth: 0 }}>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1729', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user?.email || ''}</p>
                </div>
              </div>

              {/* Menu items */}
              <div style={{ padding: '6px' }}>
                {[
                  { icon: User, label: 'Profile', href: '/profile' },
                  { icon: Settings, label: 'Account Settings', href: '/account-settings' },
                ].map(({ icon: Icon, label, href }) => (
                  <button key={label} onClick={() => { router.push(href); setShowAvatar(false); }}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#374151', fontSize: '13px', textAlign: 'left', transition: 'background 150ms' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'none')}
                  >
                    <Icon size={14} style={{ color: '#6b7280', flexShrink: 0 }} />
                    {label}
                  </button>
                ))}

                <div style={{ borderTop: '1px solid #f3f4f6', margin: '4px 0' }} />

                <button onClick={handleSignOut}
                  style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '9px 12px', borderRadius: '8px', background: 'none', border: 'none', cursor: 'pointer', color: '#dc2626', fontSize: '13px', textAlign: 'left', transition: 'background 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
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
