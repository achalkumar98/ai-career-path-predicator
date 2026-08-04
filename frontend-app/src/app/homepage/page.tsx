'use client';
import { useRouter } from 'next/navigation';
import { FaCompass, FaChartLine, FaFileAlt, FaLightbulb, FaRobot } from 'react-icons/fa';

const features = [
  { title: 'Career Navigator', desc: 'Discover AI-matched career paths based on your skills and interests.', path: '/career-navigator', btn: 'Explore Careers', icon: FaCompass },
  { title: 'Progress Tracker', desc: 'Track skill growth, completed courses, and career milestones.', path: '/progress-tracker', btn: 'Track Now', icon: FaChartLine },
  { title: 'Resume Analyzer', desc: 'Get AI feedback and keyword matching to land your dream job.', path: '/resume-analyzer', btn: 'Analyze Resume', icon: FaFileAlt },
  { title: 'Personality & Trends', desc: 'Understand your traits and stay ahead of job market trends.', path: '/insights', btn: 'View Insights', icon: FaLightbulb },
  { title: 'AI Career Chatbot', desc: 'Ask anything about careers, skills, or jobs — instant AI guidance.', path: '/chatbot', btn: 'Chat Now', icon: FaRobot },
];

const stats = [
  { label: 'Career Paths', value: '94+' },
  { label: 'Skills Analyzed', value: '1,250+' },
  { label: 'Success Rate', value: '85%' },
  { label: 'Avg. Transition', value: '6 mo' },
];

export default function Homepage() {
  const router = useRouter();
  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null') ?? { name: 'Guest' }
    : { name: 'Guest' };

  return (
    <div className="min-h-screen" style={{ background: '#f9fafb', padding: 'var(--space-8) var(--space-7)' }}>

      {/* Header */}
      <div style={{ marginBottom: 'var(--space-8)' }}>
        <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-surface-raised)', marginBottom: 'var(--space-2)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Dashboard
        </p>
        <h1 style={{ fontSize: 'var(--font-size-4xl)', fontWeight: 700, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)', lineHeight: 1.2 }}>
          Welcome back, <span className="gradient-text">{user.name}</span> 👋
        </h1>
        <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-tertiary)' }}>
          Your AI-powered career command center. What would you like to explore today?
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 'var(--space-5)', marginBottom: 'var(--space-8)' }}
        className="grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="glass" style={{ padding: 'var(--space-6)', textAlign: 'center' }}>
            <p style={{ fontSize: 'var(--font-size-3xl)', fontWeight: 700, color: 'var(--color-surface-raised)' }}>{s.value}</p>
            <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-6)' }}
        className="grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="glass"
              style={{
                padding: 'var(--space-7)',
                display: 'flex', flexDirection: 'column', gap: 'var(--space-5)',
                transition: `box-shadow var(--motion-fast), transform var(--motion-fast)`,
                cursor: 'default',
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'var(--shadow-1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div
                style={{
                  width: '40px', height: '40px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(34,85,236,0.08)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
              >
                <Icon size={18} style={{ color: 'var(--color-surface-raised)' }} aria-hidden="true" />
              </div>
              <div>
                <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-2)' }}>{f.title}</h2>
                <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-tertiary)', lineHeight: '1.6' }}>{f.desc}</p>
              </div>
              <button
                onClick={() => router.push(f.path)}
                className="btn-accent"
                style={{ marginTop: 'auto', width: 'fit-content' }}
              >
                {f.btn} →
              </button>
            </div>
          );
        })}
      </div>

      {/* Quote */}
      <div className="glass" style={{ marginTop: 'var(--space-8)', padding: 'var(--space-7)', textAlign: 'center' }}>
        <p style={{ fontSize: 'var(--font-size-lg)', fontStyle: 'italic', color: 'var(--color-text-tertiary)' }}>
          &quot;Your future is created by what you do today, not tomorrow.&quot; ✨
        </p>
      </div>
    </div>
  );
}
