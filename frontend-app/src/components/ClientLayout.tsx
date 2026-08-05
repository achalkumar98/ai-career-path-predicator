'use client';
import { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import Footer from './Footer';
import { stripBasePath } from '@/lib/pathHelper';

const PUBLIC_PATHS = ['/', '/login', '/register', '/contact', '/upgrade'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const currentPath = stripBasePath(pathname || '/');
  const isPublic = PUBLIC_PATHS.includes(currentPath);

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f9fafb' }}>
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh', marginLeft: isOpen ? '240px' : '64px', transition: 'margin-left 300ms ease' }}>
        <AppHeader toggleSidebar={() => setIsOpen(!isOpen)} />
        <main style={{ flex: 1 }}>
          {children}
        </main>
        <Footer />
      </div>
    </div>
  );
}
