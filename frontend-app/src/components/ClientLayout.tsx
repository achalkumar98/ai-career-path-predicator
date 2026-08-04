'use client';
import { useState } from 'react';
import Sidebar from './Sidebar';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex min-h-screen" style={{ background: 'var(--bg-primary)' }}>
      <Sidebar isOpen={isOpen} toggleSidebar={() => setIsOpen(!isOpen)} />
      <main
        className="flex-1 transition-all duration-300 min-h-screen"
        style={{ marginLeft: isOpen ? '256px' : '72px', background: 'var(--bg-primary)' }}
      >
        {children}
      </main>
    </div>
  );
}
