import Link from 'next/link';

const cols = [
  { title: 'Product', links: [{ label: 'Templates', href: '#' }, { label: 'Resume Score', href: '#' }, { label: 'ATS Guidelines', href: '#' }, { label: 'Features', href: '#' }] },
  { title: 'Career Tools', links: [{ label: 'Job Search', href: '/homepage' }, { label: 'Interview Prep', href: '/chatbot' }, { label: 'Blog', href: '#' }] },
  { title: 'Company', links: [{ label: 'Pricing', href: '/upgrade' }, { label: 'Contact Us', href: '/contact' }, { label: 'Feedback', href: '/feedback' }] },
  { title: 'Legal', links: [{ label: 'Privacy', href: '#' }, { label: 'Terms', href: '#' }, { label: 'Cookies', href: '#' }, { label: 'Refund Policy', href: '#' }] },
];

export default function Footer() {
  return (
    <footer style={{ background: '#f9fafb', borderTop: '1px solid #e5e7eb', padding: '48px 48px 28px' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '36px', marginBottom: '40px' }}>
          {cols.map(col => (
            <div key={col.title}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f1729', marginBottom: '14px' }}>{col.title}</p>
              {col.links.map(l => (
                <Link key={l.label} href={l.href} style={{ display: 'block', fontSize: '12px', color: '#6b7280', textDecoration: 'none', marginBottom: '9px', transition: 'color 150ms' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#2255ec')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6b7280')}>{l.label}</Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop: '1px solid #e5e7eb', paddingTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <p style={{ fontSize: '11px', color: '#9ca3af' }}>© 2025 CareerNav. Crafted to help you land your next role.</p>
          <div style={{ display: 'flex', gap: '18px' }}>
            {['Privacy', 'Terms', 'Cookies', 'Refund'].map(l => (
              <a key={l} href="#" style={{ fontSize: '11px', color: '#9ca3af', textDecoration: 'none', transition: 'color 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.color = '#374151')}
                onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}>{l}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
