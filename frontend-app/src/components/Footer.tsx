'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useTheme } from '@/context/ThemeContext';

const cols = [
  {
    title: 'Product',
    links: [
      { label: 'Resume Analyzer',   href: '/resume-analyzer' },
      { label: 'Career Navigator',  href: '/career-navigator' },
      { label: 'AI Chatbot',        href: '/chatbot' },
      { label: 'Progress Tracker',  href: '/progress-tracker' },
      { label: 'Insights',          href: '/insights' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'ATS Guidelines',   href: '#' },
      { label: 'Interview Tips',   href: '#' },
      { label: 'Resume Templates', href: '#' },
      { label: 'Career Blog',      href: '#' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'Pricing',    href: '/upgrade' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Feedback',   href: '/feedback' },
      { label: 'About',      href: '#' },
    ],
  },
  {
    title: 'Legal',
    links: [
      { label: 'Privacy Policy',  href: '#' },
      { label: 'Terms of Service', href: '#' },
      { label: 'Cookie Policy',   href: '#' },
      { label: 'Refund Policy',   href: '#' },
    ],
  },
];

const socials = [
  {
    label: 'LinkedIn',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    label: 'GitHub',
    href: '#',
    icon: (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
      </svg>
    ),
  },
];

export default function Footer() {
  const { isDark } = useTheme();

  // ── colour tokens ──────────────────────────────────────────
  const footerBg    = isDark ? '#0f1117' : '#f9fafb';
  const borderColor = isDark ? '#272d3d' : '#e5e7eb';
  const titleColor  = isDark ? '#f1f5f9' : '#0f1729';
  const linkColor   = isDark ? '#94a3b8' : '#6b7280';
  const linkHover   = '#2255ec';
  const socialBg    = isDark ? '#1a1f2e' : '#ffffff';
  const copyColor   = isDark ? '#64748b' : '#9ca3af';

  return (
    <footer style={{ background: footerBg, borderTop: `1px solid ${borderColor}`, color: titleColor, fontFamily: 'Inter, sans-serif', transition: 'background 300ms, border-color 300ms' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '64px 48px 48px' }} className="footer-pad">

        {/* ── Main grid ── */}
        <div
          style={{ display: 'grid', gridTemplateColumns: '1.6fr repeat(4, 1fr)', gap: '48px', marginBottom: '56px' }}
          className="footer-grid"
        >
          {/* Brand column */}
          <div className="footer-brand">
            <Link href="/" style={{ display: 'inline-flex', alignItems: 'center', gap: '10px', textDecoration: 'none', marginBottom: '16px' }}>
              <Image src="/assets/aicareernav-logo.png" alt="AiCareerNav" width={36} height={36} style={{ borderRadius: '10px', objectFit: 'contain', flexShrink: 0 }} />
              <span style={{ fontSize: '16px', fontWeight: 700, color: titleColor }}>AICareerNav</span>
            </Link>
            <p style={{ fontSize: '13px', color: linkColor, lineHeight: 1.75, marginBottom: '24px', maxWidth: '220px' }}>
              AI-powered career platform to build ATS-ready resumes, find jobs, and ace interviews.
            </p>

            {/* Socials */}
            <div style={{ display: 'flex', gap: '10px' }}>
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  style={{
                    width: '34px', height: '34px', borderRadius: '8px',
                    background: socialBg, border: `1px solid ${borderColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: linkColor, textDecoration: 'none',
                    transition: 'background 150ms, color 150ms',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#2255ec'; (e.currentTarget as HTMLElement).style.color = '#fff'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = socialBg; (e.currentTarget as HTMLElement).style.color = linkColor; }}
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {cols.map((col) => (
            <div key={col.title}>
              <p style={{ fontSize: '11px', fontWeight: 700, color: titleColor, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '16px' }}>
                {col.title}
              </p>
              {col.links.map((l) => (
                <Link
                  key={l.label}
                  href={l.href}
                  style={{ display: 'block', fontSize: '13px', color: linkColor, textDecoration: 'none', marginBottom: '10px', transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.color = linkHover)}
                  onMouseLeave={e => (e.currentTarget.style.color = linkColor)}
                >
                  {l.label}
                </Link>
              ))}
            </div>
          ))}
        </div>

        {/* ── Bottom bar ── */}
        <div style={{ borderTop: `1px solid ${borderColor}`, paddingTop: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <p style={{ fontSize: '12px', color: copyColor }}>
            © 2025 CareerNav. Crafted to help you land your next role.
          </p>
          <div style={{ display: 'flex', gap: '20px' }}>
            {['Privacy', 'Terms', 'Cookies', 'Refund'].map((l) => (
              <a
                key={l}
                href="#"
                style={{ fontSize: '12px', color: copyColor, textDecoration: 'none', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = isDark ? '#cbd5e1' : '#374151')}
                onMouseLeave={e => (e.currentTarget.style.color = copyColor)}
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
