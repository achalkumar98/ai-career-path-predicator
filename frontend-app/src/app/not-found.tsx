import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4" style={{ background: 'var(--bg-primary)' }}>
      <div className="text-center">
        <p className="text-8xl font-bold gradient-text mb-4">404</p>
        <h1 className="text-2xl font-semibold text-white mb-2">Page not found</h1>
        <p className="mb-8" style={{ color: 'var(--text-muted)' }}>The page you&apos;re looking for doesn&apos;t exist.</p>
        <Link href="/" className="btn-accent px-6 py-3 inline-block">← Back to Home</Link>
      </div>
    </div>
  );
}
