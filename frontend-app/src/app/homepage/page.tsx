'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Compass, TrendingUp, FileText, Lightbulb, MessageSquare, ArrowRight, Users, BarChart3, Award, Clock } from 'lucide-react';

const features = [
  {
    title: 'Career Navigator',
    desc: 'AI maps your skills and interests to real-world career paths with step-by-step growth roadmaps.',
    path: '/career-navigator',
    btn: 'Explore Careers',
    icon: Compass,
    color: '#2255ec',
    bg: '#eef2ff',
  },
  {
    title: 'Progress Tracker',
    desc: 'Monitor skill development, completed assessments, and career milestones in one place.',
    path: '/progress-tracker',
    btn: 'View Progress',
    icon: TrendingUp,
    color: '#059669',
    bg: '#f0fdf4',
  },
  {
    title: 'Resume Analyzer',
    desc: 'Upload your resume and get instant ATS compatibility scores, keyword gaps, and improvement tips.',
    path: '/resume-analyzer',
    btn: 'Analyze Resume',
    icon: FileText,
    color: '#7c3aed',
    bg: '#faf5ff',
  },
  {
    title: 'Personality & Trends',
    desc: 'Discover your work style, strengths, and how they align with current job market demand.',
    path: '/insights',
    btn: 'Get Insights',
    icon: Lightbulb,
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    title: 'AI Career Chatbot',
    desc: 'Get instant answers on resumes, interviews, salary negotiation, and career strategy — 24/7.',
    path: '/chatbot',
    btn: 'Start Chatting',
    icon: MessageSquare,
    color: '#0891b2',
    bg: '#ecfeff',
  },
];

const stats = [
  { label: 'Career Paths Mapped', value: '94+', icon: Compass, color: '#2255ec', bg: '#eef2ff' },
  { label: 'Skills Analyzed', value: '1,250+', icon: BarChart3, color: '#059669', bg: '#f0fdf4' },
  { label: 'Interview Success Rate', value: '85%', icon: Award, color: '#7c3aed', bg: '#faf5ff' },
  { label: 'Avg. Career Transition', value: '6 mo', icon: Clock, color: '#d97706', bg: '#fffbeb' },
];

export default function Homepage() {
  const router = useRouter();
  const [user, setUser] = useState<{ name?: string } | null>(null);

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || 'null') ?? { name: 'there' });
  }, []);

  return (
    <div style={{ background: '#f9fafb', minHeight: '100vh', padding: '40px 48px' }} className="page-pad">

      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: 800, color: 'var(--color-text-primary)', marginBottom: '8px', lineHeight: 1.2 }}>
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
          Your AI-powered career command center. Pick a tool below to continue your journey.
        </p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '36px' }} className="grid-auto">
        {stats.map(s => {
          const Icon = s.icon;
          return (
            <div key={s.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: s.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Icon size={20} style={{ color: s.color }} />
              </div>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 800, color: '#0f1729', lineHeight: 1 }}>{s.value}</p>
                <p style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Feature cards */}
      <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f1729', marginBottom: '16px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Tools</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="grid-auto">
        {features.map(f => {
          const Icon = f.icon;
          return (
            <div
              key={f.title}
              style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '28px', display: 'flex', flexDirection: 'column', gap: '16px', transition: 'box-shadow 200ms, transform 200ms' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon size={20} style={{ color: f.color }} />
              </div>
              <div>
                <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#0f1729', marginBottom: '6px' }}>{f.title}</h2>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65 }}>{f.desc}</p>
              </div>
              <button
                onClick={() => router.push(f.path)}
                style={{ marginTop: 'auto', display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', background: f.color, color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', width: 'fit-content', transition: 'opacity 150ms' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >
                {f.btn} <ArrowRight size={13} />
              </button>
            </div>
          );
        })}
      </div>

      {/* Quick tip */}
      <div style={{ marginTop: '32px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '24px 28px', display: 'flex', alignItems: 'center', gap: '20px' }} className="tip-banner">
        <div style={{ width: '44px', height: '44px', borderRadius: '10px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Users size={20} style={{ color: '#2255ec' }} />
        </div>
        <div>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f1729', marginBottom: '4px' }}>Did you know?</p>
          <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>
            Candidates who tailor their resume to each job description are <strong style={{ color: '#0f1729' }}>3x more likely</strong> to get an interview. Use the Resume Analyzer to optimize yours.
          </p>
        </div>
        <button
          onClick={() => router.push('/resume-analyzer')}
          style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '9px 18px', borderRadius: '8px', background: '#eef2ff', color: '#2255ec', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'background 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#dde4fb')}
          onMouseLeave={e => (e.currentTarget.style.background = '#eef2ff')}
        >
          Try it now <ArrowRight size={13} />
        </button>
      </div>
    </div>
  );
}
