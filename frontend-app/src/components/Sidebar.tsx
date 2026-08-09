'use client';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { stripBasePath } from '@/lib/pathHelper';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard, Compass, TrendingUp, FileText, Sparkles, MessageSquare,
  Zap, ChevronUp, User, Settings, MessageCircle, LogOut, Briefcase,
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
      { path: '/job-matching',      label: 'Job Matching',      icon: Briefcase },
      { path: '/progress-tracker',  label: 'Progress Tracker',  icon: TrendingUp },
      { path: '/resume-analyzer',   label: 'Resume Analyzer',   icon: FileText },
      { path: '/insights',          label: 'Personality & Trends', icon: Sparkles },
      { path: '/chatbot',           label: 'Chat Assistant',    icon: MessageSquare },
    ],
  },
];

export default function Sidebar({ isOpen, isMobile }: SidebarProps) {
  const { isDark } = useTheme();
  const pathname  = usePathname();
  const currentPath = stripBasePath(pathname || '/');
  const router = useRouter();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;

  // ── colour tokens ──────────────────────────────────────────
  const sideBg        = isDark ? '#0f1117' : '#ffffff';
  const sideBorder    = isDark ? '#272d3d' : '#e5e7eb';
  const divider       = isDark ? '#272d3d' : '#f3f4f6';
  const titleColor    = isDark ? '#f1f5f9' : '#0f1729';
  const bodyColor     = isDark ? '#cbd5e1' : '#374151';
  const mutedColor    = isDark ? '#64748b' : '#9ca3af';
  const hoverBg       = isDark ? '#1a1f2e' : '#f9fafb';
  const activeNavBg   = isDark ? '#1e2844' : '#eef2ff';
  const activeNavColor= '#2255ec';
  const iconBg        = isDark ? '#1a1f2e' : '#f3f4f6';
  const iconBgActive  = isDark ? '#1e2844' : '#dde4fb';
  const dropdownBg    = isDark ? '#1a1f2e' : '#ffffff';
  const dropdownShadow= isDark
    ? '0 10px 25px rgba(0,0,0,0.5)'
    : '0 10px 25px rgba(0,0,0,0.12)';

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
      background: sideBg,
      borderRight: `1px solid ${sideBorder}`,
      display: 'flex', flexDirection: 'column',
      zIndex: 50,
      transition: 'width 300ms ease, background 300ms, border-color 300ms',
      overflow: 'hidden',
    }}>

      {/* ── Logo ── */}
      <div style={{ padding: '14px 12px', borderBottom: `1px solid ${divider}`, flexShrink: 0 }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Image
            src="/assets/aicareernav-logo.png"
            alt="AiCareerNav"
            width={36}
            height={36}
            priority
            style={{ borderRadius: '10px', objectFit: 'contain', flexShrink: 0 }}
          />
          {isOpen && (
            <div>
              <span style={{ fontSize: '14px', fontWeight: 700, color: titleColor }}>AiCareerNav</span>
              <p style={{ fontSize: '11px', color: mutedColor, marginTop: '1px' }}>AI Career Platform</p>
            </div>
          )}
        </Link>
      </div>

      {/* ── Nav ── */}
      <nav style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
        {navGroups.map((group, gi) => (
          <div key={gi} style={{ marginBottom: '4px' }}>
            {group.label && isOpen && (
              <p style={{ fontSize: '10px', fontWeight: 600, color: mutedColor, letterSpacing: '0.08em', padding: '8px 8px 4px' }}>
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
                    padding: '8px 10px', borderRadius: '8px', marginBottom: '2px',
                    background: isActive ? activeNavBg : 'transparent',
                    color: isActive ? activeNavColor : bodyColor,
                    fontSize: '13px', fontWeight: isActive ? 600 : 400,
                    textDecoration: 'none',
                    transition: 'background 150ms, color 150ms',
                    whiteSpace: 'nowrap',
                  }}
                  onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = hoverBg; }}
                  onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <div style={{
                    width: '28px', height: '28px', borderRadius: '7px',
                    background: isActive ? iconBgActive : iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={14} style={{ color: isActive ? activeNavColor : mutedColor }} />
                  </div>
                  {isOpen && <span>{item.label}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </nav>

      {/* ── Upgrade ── */}
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

      {/* ── User profile ── */}
      <div style={{ padding: '8px', borderTop: `1px solid ${sideBorder}`, flexShrink: 0, position: 'relative' }}>
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          style={{
            width: '100%', padding: '8px 10px', borderRadius: '8px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '10px',
            transition: 'background 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
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
                <p style={{ fontSize: '12px', fontWeight: 600, color: titleColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.name || 'User'}
                </p>
                <p style={{ fontSize: '11px', color: mutedColor, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {user?.email || ''}
                </p>
              </div>
              <ChevronUp size={11} style={{
                color: mutedColor, flexShrink: 0,
                transform: showUserMenu ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 200ms',
              }} />
            </>
          )}
        </button>

        {/* User dropdown */}
        {showUserMenu && isOpen && (
          <div style={{
            position: 'absolute', bottom: '60px', left: '8px', right: '8px',
            background: dropdownBg, border: `1px solid ${sideBorder}`,
            borderRadius: '12px', boxShadow: dropdownShadow, padding: '8px', zIndex: 100,
          }}>
            <div style={{ padding: '8px 10px 10px', borderBottom: `1px solid ${divider}`, marginBottom: '4px' }}>
              <p style={{ fontSize: '12px', fontWeight: 600, color: titleColor }}>{user?.name || 'User'}</p>
              <p style={{ fontSize: '11px', color: mutedColor }}>{user?.email || ''}</p>
            </div>

            {[
              { label: 'Profile',          icon: User,          path: '/profile' },
              { label: 'Account Settings', icon: Settings,      path: '/account-settings' },
              { label: 'My Feedback',      icon: MessageCircle, path: '/feedback' },
            ].map(({ label, icon: Icon, path }) => (
              <button
                key={label}
                onClick={() => handleMenuNav(path)}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '8px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '13px', color: bodyColor, textAlign: 'left',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = hoverBg)}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                <Icon size={13} style={{ color: mutedColor }} />
                {label}
              </button>
            ))}

            <div style={{ borderTop: `1px solid ${divider}`, marginTop: '4px', paddingTop: '4px' }}>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%', display: 'flex', alignItems: 'center', gap: '10px',
                  padding: '8px 10px', borderRadius: '8px',
                  background: 'transparent', border: 'none', cursor: 'pointer',
                  fontSize: '13px', color: '#dc2626', textAlign: 'left',
                  transition: 'background 150ms',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = isDark ? '#2d1515' : '#fef2f2')}
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
