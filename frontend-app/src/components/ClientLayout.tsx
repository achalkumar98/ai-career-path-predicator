'use client';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import Sidebar from './Sidebar';
import AppHeader from './AppHeader';
import Footer from './Footer';
import { stripBasePath } from '@/lib/pathHelper';

const PUBLIC_PATHS = ['/', '/login', '/register', '/contact', '/upgrade'];

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);
  const pathname = usePathname();
  const currentPath = stripBasePath(pathname || '/');
  const isPublic = PUBLIC_PATHS.includes(currentPath);

  if (isPublic) {
    return (
      <>
        {children}
        <Footer />
      </>
    );
  }

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
