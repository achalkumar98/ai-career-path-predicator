'use client';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useTheme } from '@/context/ThemeContext';
import { Monitor, X, Download } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

interface InstallPWAProps {
  /** compact = just the icon button for AppHeader; banner = bottom banner */
  variant?: 'icon' | 'banner';
}

export default function InstallPWA({ variant = 'icon' }: InstallPWAProps) {
  const { isDark } = useTheme();
  const [prompt,    setPrompt]    = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [banner,    setBanner]    = useState(false);   // controls banner visibility
  const [tooltip,   setTooltip]   = useState(false);

  useEffect(() => {
    // Already installed as standalone
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      if (variant === 'banner') setBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => { setInstalled(true); setPrompt(null); setBanner(false); });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, [variant]);

  const handleInstall = async () => {
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    if (outcome === 'accepted') { setInstalled(true); setPrompt(null); setBanner(false); }
  };

  // Nothing to show if already installed or no prompt captured yet
  if (installed || !prompt) return null;

  // ── icon variant (for AppHeader) ───────────────────────────────────────────
  if (variant === 'icon') {
    const iconColor   = isDark ? '#94a3b8' : '#6b7280';
    const iconHoverBg = isDark ? '#1a1f2e' : '#f3f4f6';

    return (
      <div style={{ position: 'relative' }}
        onMouseEnter={() => setTooltip(true)}
        onMouseLeave={() => setTooltip(false)}>
        <button
          onClick={handleInstall}
          aria-label="Install AiCareerNav"
          style={{
            width: '32px', height: '32px', borderRadius: '8px',
            background: 'transparent', border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: iconColor, transition: 'background 150ms, color 150ms',
          }}
          onMouseEnter={e => {
            (e.currentTarget as HTMLElement).style.background = iconHoverBg;
            (e.currentTarget as HTMLElement).style.color = '#2255ec';
          }}
          onMouseLeave={e => {
            (e.currentTarget as HTMLElement).style.background = 'transparent';
            (e.currentTarget as HTMLElement).style.color = iconColor;
          }}
        >
          {/* monitor + download arrow — matches the screenshot */}
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
               stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2"/>
            <line x1="8" y1="21" x2="16" y2="21"/>
            <line x1="12" y1="17" x2="12" y2="21"/>
            <polyline points="8 10 12 14 16 10"/>
            <line x1="12" y1="14" x2="12" y2="7"/>
          </svg>
        </button>

        {/* tooltip */}
        {tooltip && (
          <div style={{
            position: 'absolute', top: 'calc(100% + 8px)', right: 0,
            background: isDark ? '#1a1f2e' : '#0f1729',
            color: '#fff', fontSize: '11px', fontWeight: 500,
            padding: '5px 10px', borderRadius: '7px',
            whiteSpace: 'nowrap', pointerEvents: 'none', zIndex: 200,
            boxShadow: '0 4px 12px rgba(0,0,0,0.25)',
          }}>
            Install AiCareerNav
            <div style={{
              position: 'absolute', top: '-4px', right: '10px',
              width: '8px', height: '8px',
              background: isDark ? '#1a1f2e' : '#0f1729',
              transform: 'rotate(45deg)',
            }} />
          </div>
        )}
      </div>
    );
  }

  // ── banner variant (bottom of screen) ─────────────────────────────────────
  if (!banner) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '24px', left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 500, width: 'calc(100vw - 48px)', maxWidth: '480px',
      background: isDark ? '#1a1f2e' : '#ffffff',
      border: `1px solid ${isDark ? '#272d3d' : '#e5e7eb'}`,
      borderRadius: '16px', padding: '16px 20px',
      boxShadow: isDark
        ? '0 8px 32px rgba(0,0,0,0.5)'
        : '0 8px 32px rgba(0,0,0,0.12)',
      display: 'flex', alignItems: 'center', gap: '14px',
    }}>
      {/* app icon */}
      <div style={{
        width: '44px', height: '44px', borderRadius: '12px',
       display: 'flex', alignItems: 'center',
        justifyContent: 'center', flexShrink: 0,
      }}>
        <Image src="/assets/aicareernav-logo.png" alt="AiCareerNav" width={32} height={32} style={{ borderRadius: '8px', objectFit: 'contain' }} />
      </div>

      {/* text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '13px', fontWeight: 700,
                    color: isDark ? '#f1f5f9' : '#0f1729', marginBottom: '2px' }}>
          Install AiCareerNav
        </p>
        <p style={{ fontSize: '11px', color: isDark ? '#64748b' : '#9ca3af', lineHeight: 1.5 }}>
          Add to your home screen for quick access
        </p>
      </div>

      {/* install btn */}
      <button onClick={handleInstall}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          padding: '8px 14px', borderRadius: '9px',
          background: '#2255ec', color: '#fff',
          fontSize: '12px', fontWeight: 600, border: 'none',
          cursor: 'pointer', flexShrink: 0,
          transition: 'background 150ms',
        }}
        onMouseEnter={e => (e.currentTarget.style.background = '#1a44c8')}
        onMouseLeave={e => (e.currentTarget.style.background = '#2255ec')}>
        <Download size={13} /> Install
      </button>

      {/* dismiss */}
      <button onClick={() => setBanner(false)}
        style={{ background: 'none', border: 'none', cursor: 'pointer',
                  color: isDark ? '#475569' : '#9ca3af', padding: '4px',
                  display: 'flex', alignItems: 'center', flexShrink: 0 }}
        aria-label="Dismiss">
        <X size={16} />
      </button>
    </div>
  );
}
