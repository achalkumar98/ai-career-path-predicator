'use client';
import { useRouter } from 'next/navigation';
import { FaCompass, FaChartLine, FaFileAlt, FaLightbulb, FaRobot } from 'react-icons/fa';

const features = [
  { title: 'Career Navigator', desc: 'Discover AI-matched career paths based on your skills and interests.', path: '/career-navigator', btn: 'Explore Careers', icon: FaCompass, color: '#0066ff' },
  { title: 'Progress Tracker', desc: 'Track skill growth, completed courses, and career milestones.', path: '/progress-tracker', btn: 'Track Now', icon: FaChartLine, color: '#00d4ff' },
  { title: 'Resume Analyzer', desc: 'Get AI feedback and keyword matching to land your dream job.', path: '/resume-analyzer', btn: 'Analyze Resume', icon: FaFileAlt, color: '#7c3aed' },
  { title: 'Personality & Trends', desc: 'Understand your traits and stay ahead of job market trends.', path: '/insights', btn: 'View Insights', icon: FaLightbulb, color: '#f59e0b' },
  { title: 'AI Career Chatbot', desc: 'Ask anything about careers, skills, or jobs — instant AI guidance.', path: '/chatbot', btn: 'Chat Now', icon: FaRobot, color: '#10b981' },
];

export default function Homepage() {
  const router = useRouter();
  const user = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem('user') || 'null') ?? { name: 'Guest' }
    : { name: 'Guest' };

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: 'var(--bg-primary)' }}>
      {/* Header */}
      <div className="mb-10">
        <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>Dashboard</p>
        <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
          Welcome back, <span className="gradient-text">{user.name}</span> 👋
        </h1>
        <p style={{ color: 'var(--text-muted)' }}>Your AI-powered career command center. What would you like to explore today?</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {[
          { label: 'Career Paths', value: '94+' },
          { label: 'Skills Analyzed', value: '1,250+' },
          { label: 'Success Rate', value: '85%' },
          { label: 'Avg. Transition', value: '6 mo' },
        ].map((s) => (
          <div key={s.label} className="glass p-4 text-center">
            <p className="text-2xl font-bold gradient-text">{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              className="glass p-6 flex flex-col gap-4 transition-all duration-300 cursor-pointer group"
              style={{ borderColor: 'rgba(0,212,255,0.1)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = `${f.color}40`; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${f.color}20` }}>
                <Icon size={22} style={{ color: f.color }} />
              </div>
              <div>
                <h2 className="text-lg font-semibold text-white mb-1">{f.title}</h2>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
              <button
                onClick={() => router.push(f.path)}
                className="mt-auto text-sm font-semibold px-4 py-2 rounded-lg transition-all duration-200 w-fit"
                style={{ background: `${f.color}20`, color: f.color, border: `1px solid ${f.color}40` }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = `${f.color}35`; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = `${f.color}20`; }}
              >
                {f.btn} →
              </button>
            </div>
          );
        })}
      </div>

      {/* Quote */}
      <div className="mt-12 glass p-6 text-center" style={{ borderColor: 'rgba(0,212,255,0.1)' }}>
        <p className="text-lg italic" style={{ color: 'var(--text-muted)' }}>
          &quot;Your future is created by what you do today, not tomorrow.&quot; ✨
        </p>
      </div>
    </div>
  );
}
