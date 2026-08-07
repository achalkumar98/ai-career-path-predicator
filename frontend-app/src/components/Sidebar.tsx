'use client';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { stripBasePath } from '@/lib/pathHelper';
import {
  LayoutDashboard, Compass, TrendingUp, FileText, Sparkles, MessageSquare,
  Zap, ChevronUp, User, Settings, MessageCircle, LogOut,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
  isMobile?: boolean;
}

const navGroups = [
  {
    items: [
      { path: '/homepage', label: 'Dashboard', icon: LayoutDashboard },
    ],
  },
  {
    label: 'TOOLS',
    items: [
      { path: '/career-navigator', label: 'Career Navigator', icon: Compass },
      { path: '/progress-tracker', label: 'Progress Tracker', icon: TrendingUp },
      { path: '/resume-analyzer', label: 'Resume Analyzer', icon: FileText },
      { path: '/insights', label: 'Personality & Trends', icon: Sparkles },
      { path: '/chatbot', label: 'Chat Assistant', icon: MessageSquare },
    ],
  },
];

export default function Sidebar({ isOpen, toggleSidebar, isMobile }: SidebarProps) {
  const pathname = usePathname();
  const currentPath = stripBasePath(pathname || '/');
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setShowUserMenu(false);
    router.push('/');
  };

  const handleMenuNav = (path: string) => {
    setShowUserMenu(false);
    router.push(path);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, height: '100vh',
      width: isOpen ? '240px' : isMobile ? '0px' : '64px',
      background: '#ffffff',
      borderRight: '1px solid #e5e7eb',
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
      transition: 'width 300ms ease',
      overflow: 'hidden',
    }}>
      {/* Logo */}
      <div style={{ padding: '14px 12px', borderBottom: '1px solid #f3f4f6', flexShrink: 0 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <div style={{
            width: '36px', height: '36px', borderRadius: '10px',
            background: '#2255ec', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '16px' }}>A</span>
          </div>
          {isOpen && (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>AiCareerNav</span>
              </div>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>AI Career Platform</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {navGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: '4px' }}>
            {group.label && isOpen && (
              <p style={{ fontSize: '10px', fontWeight: 600, color: '#9ca3af', letterSpacing: '0.08em', padding: '8px 8px 4px' }}>
                {group.label}
              </p>
            )}
            {group.items.map((item) => {
              const Icon = item.icon;
              const isActive = currentPath === item.path;
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  title={!isOpen ? item.label : undefined}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '10px',
                    padding: '8px 10px',
                    borderRadius: '8px',
                    marginBottom: '2px',
                    background: isActive ? '#eef2ff' : 'transparent',
                    color: isActive ? '#2255ec' : '#374151',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    textDecoration: 'none',
                    transition: 'background 150ms, color 150ms',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = '#f9fafb'; } }}
                  onMouseLeave={e => { if (!isActive) { (e.currentTarget as HTMLElement).style.background = 'transparent'; } }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '7px',
                    background: isActive ? '#dde4fb' : '#f3f4f6',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={14} style={{ color: isActive ? '#2255ec' : '#6b7280' }} />
                  </div>
                  {isOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* Upgrade */}
      <div style={{ padding: '8px', flexShrink: 0 }}>
        <button
          onClick={() => router.push('/upgrade')}
          style={{
            width: '100%', padding: isOpen ? '10px 14px' : '10px',
            borderRadius: '10px', background: '#2255ec', color: '#fff',
            fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: isOpen ? 'flex-start' : 'center',
            gap: '8px', transition: 'background 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#1a44c8')}
          onMouseLeave={e => (e.currentTarget.style.background = '#2255ec')}
        >
          <Zap size={13} />
          {isOpen && 'Upgrade to Pro'}
        </button>
      </div>

      {/* User profile */}
      <div style={{ padding: '8px', borderTop: '1px solid #e5e7eb', flexShrink: 0, position: 'relative' }}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{
            width: '100%', padding: '8px 10px', borderRadius: '8px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '10px',
            transition: 'background 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          <div style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#dde4fb', display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, fontSize: '13px', fontWeight: 700, color: '#2255ec',
          }}>
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          {isOpen && (
            <>
              <div style={{ flex: 1, textAlign: 'left', overflow: 'hidden' }}>
                <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f1729', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'User'}
                </p>
                <p style={{ fontSize: '11px', color: '#9ca3af', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || ''}
                </p>
              </div>
              <ChevronUp size={11} style={{ color: '#9ca3af', flexShrink: 0, transform: showUserMenu ? 'rotate(0deg)' : 'rotate(180deg)', transition: 'transform 200ms' }} />
            </>
          )}
        </button>

        {/* User dropdown */}
        {showUserMenu && isOpen && (
          <div style={{
            position: 'absolute', bottom: '60px', left: '8px', right: '8px',
            background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px',
            boxShadow: '0 10px 25px rgba(0,0,0,0.12)', padding: '8px', zIndex: 100,
          }}>
            <div style={{ padding: '8px 10px 10px', borderBottom: '1px solid #f3f4f6', marginBottom: '4px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: '#0f1729' }}>{user?.name || 'User'}</p>
              <p style={{ fontSize: '11px', color: '#9ca3af' }}>{user?.email || ''}</p>
            </div>
            {[
              { label: 'Profile', icon: User, path: '/profile' },
              { label: 'Account Settings', icon: Settings, path: '/account-settings' },
              { label: 'My Feedback', icon: MessageCircle, path: '/feedback' },
            ].map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => handleMenuNav(path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '8px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '13px', color: '#374151', textAlign: 'left',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#f9fafb')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Icon size={13} style={{ color: '#6b7280' }} />
                {label}
              </button>
            ))}
            <div style={{ borderTop: '1px solid #f3f4f6', marginTop: '4px', paddingTop: '4px' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '8px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '13px', color: '#dc2626', textAlign: 'left',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#fef2f2')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <LogOut size={13} />
                Log out
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
