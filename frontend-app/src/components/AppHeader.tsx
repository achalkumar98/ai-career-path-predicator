'use client';
import { useRouter, usePathname } from 'next/navigation';
import { PanelLeft, Compass, ChartBar, FileText, Lightbulb, Bot, Bell } from 'lucide-react';

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

interface AppHeaderProps {
  toggleSidebar: () => void;
}

export default function AppHeader({ toggleSidebar }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null')
    : null;

  const title = pageTitles[pathname] || 'Dashboard';

  return (
    <header style={{
      position: 'sticky', top: 0, zIndex: 40,
      height: '56px',
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(8px)',
      borderBottom: '1px solid #e5e7eb',
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: '0 24px',
      gap: '16px',
    }}>
      {/* Left: toggle + breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <button
          onClick={toggleSidebar}
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6b7280', transition: 'background 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Toggle sidebar"
        >
          <PanelLeft size={16} />
        </button>
        <span style={{ fontSize: '14px', fontWeight: 600, color: '#0f1729' }}>{title}</span>
      </div>

      {/* Right: bell + avatar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <button
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#6b7280', transition: 'background 150ms', position: 'relative',
          }}
          onMouseEnter={e => (e.currentTarget.style.background = '#f3f4f6')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          aria-label="Notifications"
        >
          <Bell size={15} />
          <span style={{
            position: 'absolute', top: '6px', right: '6px',
            width: '6px', height: '6px', borderRadius: '50%',
            background: '#2255ec', border: '1.5px solid #fff',
          }} />
        </button>

        <button
          onClick={() => router.push('/profile')}
          style={{
            width: '32px', height: '32px', borderRadius: '50%',
            background: '#e8eaf6', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: '13px', fontWeight: 700, color: '#2255ec',
            transition: 'box-shadow 150ms',
          }}
          onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 0 0 2px #2255ec')}
          onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
          aria-label="Profile"
        >
          {user?.name?.[0]?.toUpperCase() || 'U'}
        </button>
      </div>
    </header>
  );
}
