'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaBars, FaHome, FaCompass, FaChartLine, FaFileAlt, FaLightbulb, FaRobot, FaSignInAlt, FaUserPlus, FaSignOutAlt } from 'react-icons/fa';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const navItems = [
  { path: '/homepage', label: 'Home', icon: FaHome },
  { path: '/career-navigator', label: 'Career Navigator', icon: FaCompass },
  { path: '/progress-tracker', label: 'Progress Tracker', icon: FaChartLine },
  { path: '/resume-analyzer', label: 'Resume Analyzer', icon: FaFileAlt },
  { path: '/insights', label: 'Personality & Trends', icon: FaLightbulb },
  { path: '/chatbot', label: 'Chat Assistant', icon: FaRobot },
];

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  return (
    <div
      className="fixed top-0 left-0 h-screen flex flex-col transition-all duration-300 z-50"
      style={{
        width: isOpen ? '256px' : '72px',
        background: 'linear-gradient(180deg, #0d1526 0%, #0a0f1e 100%)',
        borderRight: '1px solid rgba(0,212,255,0.1)',
      }}
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-5" style={{ borderBottom: '1px solid rgba(0,212,255,0.1)' }}>
        {isOpen && (
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)' }}>
              AI
            </div>
            <span className="font-bold text-lg gradient-text">CareerNav</span>
          </Link>
        )}
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg transition-colors"
          style={{ color: 'var(--text-muted)' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'var(--accent)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}
        >
          <FaBars size={18} />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-6 overflow-y-auto">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <li key={item.path}>
                <Link
                  href={item.path}
                  className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 group"
                  style={{
                    background: active ? 'rgba(0,212,255,0.12)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-muted)',
                    borderLeft: active ? '2px solid var(--accent)' : '2px solid transparent',
                  }}
                  onMouseEnter={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; } }}
                  onMouseLeave={e => { if (!active) { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = 'var(--text-muted)'; } }}
                >
                  <Icon size={18} className="flex-shrink-0" />
                  {isOpen && <span className="text-sm font-medium">{item.label}</span>}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Bottom auth */}
      <div className="px-3 pb-6 space-y-1" style={{ borderTop: '1px solid rgba(0,212,255,0.1)', paddingTop: '16px' }}>
        {token ? (
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-lg w-full transition-all duration-200"
            style={{ color: '#f87171' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(248,113,113,0.1)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <FaSignOutAlt size={18} className="flex-shrink-0" />
            {isOpen && <span className="text-sm font-medium">Logout</span>}
          </button>
        ) : (
          <>
            <Link
              href="/login"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
              style={{ color: pathname === '/login' ? 'var(--accent)' : 'var(--text-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = pathname === '/login' ? 'var(--accent)' : 'var(--text-muted)'; }}
            >
              <FaSignInAlt size={18} className="flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">Login</span>}
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200"
              style={{ color: pathname === '/register' ? 'var(--accent)' : 'var(--text-muted)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,212,255,0.06)'; (e.currentTarget as HTMLElement).style.color = 'var(--text-primary)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.color = pathname === '/register' ? 'var(--accent)' : 'var(--text-muted)'; }}
            >
              <FaUserPlus size={18} className="flex-shrink-0" />
              {isOpen && <span className="text-sm font-medium">Register</span>}
            </Link>
          </>
        )}
      </div>
    </div>
  );
}
