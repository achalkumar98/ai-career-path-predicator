'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import * as echarts from 'echarts';

const features = [
  { icon: '🧠', title: 'Skill Assessment', desc: 'Identify your strengths, weaknesses, and hidden talents with our AI-powered assessment.' },
  { icon: '🗺️', title: 'Career Mapping', desc: 'Match your profile with thousands of career paths to find your optimal professional journey.' },
  { icon: '🎓', title: 'Learning Roadmap', desc: 'Get personalized course and certification recommendations to achieve your goals.' },
];

const testimonials = [
  { name: 'Sarah L.', role: 'Former Teacher → UX Designer', quote: 'The assessment identified my hidden design talents. I transitioned from teaching to UX design in just 8 months.', stars: 5 },
  { name: 'Marcus J.', role: 'Sales Rep → Data Analyst', quote: 'The AI showed me how my analytical skills transfer to data analysis. Now I\'m earning 40% more.', stars: 5 },
  { name: 'Jennifer M.', role: 'Marketing → Product Management', quote: 'After 10 years in marketing, the career path visualization showed me exactly how to transition.', stars: 5 },
];

const stats = [
  { value: '94+', label: 'Career Paths' },
  { value: '1,250+', label: 'Skills Analyzed' },
  { value: '85%', label: 'Success Rate' },
  { value: '6 mo', label: 'Avg. Transition' },
];

export default function LandingPage() {
  const [email, setEmail] = useState('');
  const [isAssessmentVisible, setIsAssessmentVisible] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const careerChartRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  const questions = [
    { question: 'Which work environment do you prefer?', options: ['Collaborative team setting', 'Independent work', 'Mix of both', 'Leadership position'] },
    { question: 'What skills would you like to develop?', options: ['Technical/coding', 'Communication/presentation', 'Creative/design', 'Analytical/problem-solving'] },
    { question: 'How do you prefer to learn?', options: ['Hands-on experience', 'Structured courses', 'Self-directed learning', 'Mentorship'] },
  ];

  useEffect(() => {
    if (!careerChartRef.current) return;
    const chart = echarts.init(careerChartRef.current, 'dark');
    chart.setOption({
      backgroundColor: 'transparent',
      animation: true,
      tooltip: { trigger: 'item', formatter: '{b}' },
      series: [{
        type: 'graph', layout: 'force', roam: true,
        label: { show: true, position: 'right', color: '#8899aa', fontSize: 11 },
        force: { repulsion: 120, edgeLength: 90 },
        data: [
          { name: 'Skills Assessment', symbolSize: 55, itemStyle: { color: '#0066ff' } },
          { name: 'Data Science', symbolSize: 42, itemStyle: { color: '#00d4ff' } },
          { name: 'UX Design', symbolSize: 42, itemStyle: { color: '#7c3aed' } },
          { name: 'Software Eng.', symbolSize: 42, itemStyle: { color: '#10b981' } },
          { name: 'Product Mgmt', symbolSize: 42, itemStyle: { color: '#f59e0b' } },
          { name: 'ML Engineer', symbolSize: 30, itemStyle: { color: '#00d4ff' } },
          { name: 'Data Analyst', symbolSize: 30, itemStyle: { color: '#00d4ff' } },
          { name: 'UI Designer', symbolSize: 30, itemStyle: { color: '#7c3aed' } },
          { name: 'UX Researcher', symbolSize: 30, itemStyle: { color: '#7c3aed' } },
          { name: 'Frontend Dev', symbolSize: 30, itemStyle: { color: '#10b981' } },
          { name: 'Backend Dev', symbolSize: 30, itemStyle: { color: '#10b981' } },
          { name: 'Technical PM', symbolSize: 30, itemStyle: { color: '#f59e0b' } },
        ],
        links: [
          { source: 'Skills Assessment', target: 'Data Science' },
          { source: 'Skills Assessment', target: 'UX Design' },
          { source: 'Skills Assessment', target: 'Software Eng.' },
          { source: 'Skills Assessment', target: 'Product Mgmt' },
          { source: 'Data Science', target: 'ML Engineer' },
          { source: 'Data Science', target: 'Data Analyst' },
          { source: 'UX Design', target: 'UI Designer' },
          { source: 'UX Design', target: 'UX Researcher' },
          { source: 'Software Eng.', target: 'Frontend Dev' },
          { source: 'Software Eng.', target: 'Backend Dev' },
          { source: 'Product Mgmt', target: 'Technical PM' },
        ],
        lineStyle: { color: 'rgba(0,212,255,0.2)', width: 1.5, curveness: 0.2 },
      }],
    });
    const onResize = () => chart.resize();
    window.addEventListener('resize', onResize);
    return () => { chart.dispose(); window.removeEventListener('resize', onResize); };
  }, []);

  const handleStart = () => router.push(token ? '/homepage' : '/login');

  const handleAnswerSelect = (answer: string) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: answer }));
    if (currentQuestion < questions.length - 1) setCurrentQuestion((p) => p + 1);
    else setIsAssessmentVisible(false);
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)' }}>

      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 lg:px-12 py-4" style={{ background: 'rgba(10,15,30,0.85)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(0,212,255,0.08)' }}>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold" style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)' }}>AI</div>
          <span className="font-bold text-lg gradient-text">CareerNav</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="text-sm px-4 py-2 rounded-lg transition-colors" style={{ color: 'var(--text-muted)' }} onMouseEnter={e => (e.currentTarget.style.color = 'white')} onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-muted)')}>Sign In</Link>
          <Link href="/register" className="btn-accent text-sm px-4 py-2">Get Started</Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-20" style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(0,102,255,0.15) 0%, transparent 60%)' }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,212,255,0.06) 0%, transparent 70%)' }} />
          <div className="absolute top-1/2 right-1/4 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, rgba(0,102,255,0.08) 0%, transparent 70%)' }} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6" style={{ background: 'rgba(0,212,255,0.1)', border: '1px solid rgba(0,212,255,0.2)', color: 'var(--accent)' }}>
            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            AI-Powered Career Guidance
          </div>
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Navigate Your<br /><span className="gradient-text">Career Future</span>
          </h1>
          <p className="text-lg lg:text-xl mb-10 max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Personalized skill-based guidance powered by AI. Discover your ideal career path, track progress, and land your dream job.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button onClick={handleStart} className="btn-accent px-8 py-4 text-base">
              Start Your Journey →
            </button>
            <button onClick={() => setIsAssessmentVisible(true)} className="px-8 py-4 text-base rounded-lg font-semibold transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'white' }} onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.1)')} onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.05)')}>
              Free Assessment
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-16">
            {stats.map((s) => (
              <div key={s.label} className="glass p-4 text-center">
                <p className="text-2xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment Modal */}
      {isAssessmentVisible && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
          <div className="glass p-8 w-full max-w-lg">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold text-white">Quick Assessment</h3>
              <button onClick={() => setIsAssessmentVisible(false)} style={{ color: 'var(--text-muted)' }} className="text-xl hover:text-white">✕</button>
            </div>
            <div className="mb-6">
              <div className="flex justify-between text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
                <span>Question {currentQuestion + 1} of {questions.length}</span>
                <span>{Math.round(((currentQuestion + 1) / questions.length) * 100)}%</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-1.5 rounded-full transition-all duration-300" style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, #0066ff, #00d4ff)' }} />
              </div>
            </div>
            <p className="text-white font-medium mb-4">{questions[currentQuestion].question}</p>
            <div className="space-y-2">
              {questions[currentQuestion].options.map((option, i) => (
                <button key={i} onClick={() => handleAnswerSelect(option)} className="w-full text-left px-4 py-3 rounded-lg text-sm transition-all duration-200" style={{ background: answers[currentQuestion] === option ? 'rgba(0,212,255,0.15)' : 'rgba(255,255,255,0.04)', border: `1px solid ${answers[currentQuestion] === option ? 'rgba(0,212,255,0.4)' : 'rgba(255,255,255,0.08)'}`, color: 'var(--text-primary)' }} onMouseEnter={e => { if (answers[currentQuestion] !== option) (e.currentTarget.style.background = 'rgba(255,255,255,0.08)'); }} onMouseLeave={e => { if (answers[currentQuestion] !== option) (e.currentTarget.style.background = 'rgba(255,255,255,0.04)'); }}>
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Features */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>How It Works</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Everything you need to succeed</h2>
            <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>Our AI analyzes your skills and preferences to create a personalized career roadmap.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title} className="glass p-6 transition-all duration-300" onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.3)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }} onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,212,255,0.15)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Career Graph */}
      <section className="py-24 px-6" style={{ background: 'rgba(13,21,38,0.5)' }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>Visualization</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Explore Career Paths</h2>
            <p style={{ color: 'var(--text-muted)' }}>See how different roles connect and branch from your skills.</p>
          </div>
          <div className="glass p-4" style={{ height: '480px' }}>
            <div ref={careerChartRef} className="w-full h-full" />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-sm font-medium mb-3" style={{ color: 'var(--accent)' }}>Success Stories</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Real people, real results</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass p-6">
                <div className="flex mb-3">{'⭐'.repeat(t.stars)}</div>
                <p className="text-sm leading-relaxed mb-4" style={{ color: 'var(--text-muted)' }}>&quot;{t.quote}&quot;</p>
                <div>
                  <p className="text-sm font-semibold text-white">{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--accent)' }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6" style={{ background: 'radial-gradient(ellipse at center, rgba(0,102,255,0.12) 0%, transparent 70%)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">Ready to find your path?</h2>
          <p className="mb-8" style={{ color: 'var(--text-muted)' }}>Join thousands of professionals who found their ideal career with AI Career Navigator.</p>
          <form onSubmit={(e) => { e.preventDefault(); setEmail(''); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your email" className="input-dark flex-1" required />
            <button type="submit" className="btn-accent px-6 py-3 whitespace-nowrap">Get Started</button>
          </form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-10 px-6" style={{ borderTop: '1px solid rgba(0,212,255,0.08)', background: 'var(--bg-secondary)' }}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold" style={{ background: 'linear-gradient(135deg, #0066ff, #00d4ff)' }}>AI</div>
            <span className="font-semibold gradient-text">CareerNav</span>
          </div>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>© 2025 AI Career Navigator. All rights reserved.</p>
          <div className="flex gap-6 text-sm" style={{ color: 'var(--text-muted)' }}>
            {['Terms', 'Privacy', 'Contact'].map((l) => (
              <a key={l} href="#" className="hover:text-white transition-colors">{l}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
