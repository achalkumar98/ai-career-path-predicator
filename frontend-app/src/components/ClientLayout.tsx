'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import Footer from './Footer';
import { stripBasePath } from '@/lib/pathHelper';

const PUBLIC_PATHS = ['/', '/login', '/register', '/contact', '/upgrade'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
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
        {children}
        <Footer />
      </>
    );
  }

  if (!authChecked) return null;

  const sidebarWidth = isOpen ? '240px' : isMobile ? '0px' : '64px';
  const marginLeft = isMobile ? '0px' : isOpen ? '240px' : '64px';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      {/* Mobile overlay */}
      {isMobile && isOpen && (
        <div
          className="sidebar-overlay open"
          onClick={() => setIsOpen(false)}
        />
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
          transition: 'margin-left 300ms ease',
        }}
      >
        <AppHeader toggleSidebar={() => setIsOpen(!isOpen)} />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </div>
    </div>
  );
}
