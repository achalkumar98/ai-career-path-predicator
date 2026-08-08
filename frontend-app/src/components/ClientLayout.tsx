'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Toaster } from 'react-hot-toast';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import Footer from './Footer';
import FloatingChat from './FloatingChat';
import { stripBasePath } from '@/lib/pathHelper';
import { useTheme } from '@/context/ThemeContext';

const PUBLIC_PATHS = ['/', '/login', '/register', '/contact', '/upgrade'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const { isDark } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = stripBasePath(pathname || '/');
  const isPublic = PUBLIC_PATHS.includes(currentPath);

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsOpen(!mobile);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  // Close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) setIsOpen(false);
  }, [pathname, isMobile]);

  useEffect(() => {
    if (!isPublic) {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      } else {
        setAuthChecked(true);
      }
    }
  }, [isPublic, router]);

  if (isPublic) {
    return (
      <>
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            success: { iconTheme: { primary: '#166534', secondary: '#ffffff' } },
          }}
        />
        {children}
        <Footer />
      </>
    );
  }

  if (!authChecked) return null;

  const marginLeft = isMobile ? '0px' : isOpen ? '240px' : '64px';

  return (
    <div style={{
      display: 'flex',
      minHeight: '100vh',
      background: isDark ? '#141720' : '#f9fafb',
      transition: 'background 300ms',
    }}>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div className="sidebar-overlay open" onClick={() => setIsOpen(false)} />
      )}

      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} isMobile={isMobile} />

      <div
        className="main-content"
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          minHeight: '100vh',
          marginLeft,
          transition: 'margin-left 300ms ease, background 300ms',
          background: isDark ? '#141720' : '#f9fafb',
        }}
      >
        <AppHeader toggleSidebar={() => setIsOpen(!isOpen)} />
        <main style={{ flex: 1 }}>{children}</main>
        <FloatingChat />
        <Toaster
          position="bottom-right"
          toastOptions={{
            duration: 4000,
            success: { iconTheme: { primary: '#166534', secondary: '#ffffff' } },
          }}
        />
        <Footer />
      </div>
    </div>
  );
}
