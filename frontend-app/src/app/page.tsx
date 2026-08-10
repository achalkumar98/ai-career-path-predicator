'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  FileText, Search, Mic, BookOpen, Layers, Users, FileCheck,
  Headphones, ArrowRight, CheckCircle, LayoutDashboard, Compass,
  TrendingUp, MessageSquare, Brain, Upload, Menu, X, Zap,
} from 'lucide-react';

// ─── data ─────────────────────────────────────────────────────────────────────
const stats = [
  { icon: BookOpen,    value: '500+',  label: 'Interview Questions' },
  { icon: Layers,      value: '50+',   label: 'Tech Stacks' },
  { icon: Users,       value: '2.5k+', label: 'Users' },
  { icon: FileCheck,   value: '300+',  label: 'Resumes Created' },
  { icon: Headphones,  value: '100+',  label: 'Mock Interviews' },
];

const features = [
  {
    icon: LayoutDashboard, title: 'Dashboard',
    desc: 'Your AI-powered career command center. See all your tools, stats, and progress at a glance — everything in one place.',
    bullets: ['94+ career paths mapped', '1,250+ skills analyzed', '85% user success rate', 'Avg. 6-month transition'],
    btn: 'Go to Dashboard', href: '/login',
    color: '#2255ec', dimColor: 'rgba(34,85,236,0.12)', tag: 'Command Center',
  },
  {
    icon: Compass, title: 'Career Navigator',
    desc: 'Discover your ideal career path using AI. Enter your skills and interests — get personalized career recommendations and growth roadmaps.',
    bullets: ['AI skill-to-career matching', 'Fastest-growing role insights', 'Personalized growth roadmaps', 'Actionable next steps'],
    btn: 'Explore Careers', href: '/login',
    color: '#2255ec', dimColor: 'rgba(34,85,236,0.12)', tag: 'AI-Powered',
  },
  {
    icon: TrendingUp, title: 'Progress Tracker',
    desc: "Review your assessment history, track skill growth, and see how far you've come with a full timeline view.",
    bullets: ['Full assessment history', 'Skill growth over time', 'Chronological timeline view', 'Refresh & sync anytime'],
    btn: 'Track My Progress', href: '/login',
    color: '#059669', dimColor: 'rgba(5,150,105,0.12)', tag: 'Your Journey',
  },
  {
    icon: Upload, title: 'Resume Analyzer',
    desc: 'Upload your PDF resume and get AI-powered skill extraction, keyword analysis, and ATS compatibility feedback in seconds.',
    bullets: ['PDF upload & parsing', 'NLP skill extraction', 'ATS compatibility check', 'Keyword gap analysis'],
    btn: 'Analyze My Resume', href: '/login',
    color: '#7c3aed', dimColor: 'rgba(124,58,237,0.12)', tag: 'NLP Analysis',
  },
  {
    icon: Brain, title: 'Personality & Trends',
    desc: 'Describe yourself and get AI personality analysis, career trend insights, and tailored recommendations based on who you are.',
    bullets: ['Work style & personality analysis', 'Personality-to-career fit', 'Live market trend data', 'Tailored AI recommendations'],
    btn: 'Get My Insight', href: '/login',
    color: '#d97706', dimColor: 'rgba(217,119,6,0.12)', tag: 'AI Insights',
  },
  {
    icon: MessageSquare, title: 'AI Chat Assistant',
    desc: 'Ask anything about careers, skills, or interview tips. Your AI career advisor is available 24/7 with voice input support.',
    bullets: ['Real-time AI responses', 'Full chat message history', 'Voice input support', 'Career & interview tips'],
    btn: 'Start Chatting', href: '/login',
    color: '#059669', dimColor: 'rgba(5,150,105,0.12)', tag: 'Always On',
  },
];

const portals = [
  { name: 'LinkedIn',    desc: "World's largest professional network", bg: '#0077b5', letter: 'in' },
  { name: 'Naukri',      desc: "India's top job portal",               bg: '#2255ec', letter: 'N'  },
  { name: 'Indeed',      desc: '#1 job site — 250M+ visits/mo',        bg: '#003a9b', letter: 'i'  },
  { name: 'Glassdoor',   desc: 'Salaries, reviews, insider insights',  bg: '#0caa41', letter: 'G'  },
  { name: 'Google Jobs', desc: 'Aggregated from every major board',    bg: '#ea4335', letter: 'G'  },
];

const trustBadges = ['No credit card required', 'Powered by Groq AI', 'Available 24/7'];

// ─── component ────────────────────────────────────────────────────────────────
export default function LandingPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="landing-root" style={{ minHeight: '100vh', fontFamily: 'Inter, sans-serif' }}>

      {/* ════════════════════════════════════════════════════════
          NAVBAR
      ════════════════════════════════════════════════════════ */}
      <nav className="landing-nav" style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        height: '62px', backdropFilter: 'blur(12px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 48px',
      }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Image src="/assets/aicareernav-logo.png" alt="AiCareerNav" width={32} height={32} priority style={{ borderRadius: '8px', objectFit: 'contain' }} />
          <span className="landing-nav-brand" style={{ fontSize: '15px', fontWeight: 700 }}>AICareerNav</span>
        </Link>

        <div id="landing-mobile-menu" className={`landing-nav-cta${isMobileMenuOpen ? ' open' : ''}`}
          style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {[{ label: 'Contact Us', href: '/contact' }, { label: 'Pricing', href: '/upgrade' }].map(({ label, href }) => (
            <Link key={label} href={href} onClick={() => setIsMobileMenuOpen(false)}
              className="landing-nav-link" style={{ padding: '7px 14px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', borderRadius: '8px', transition: 'background 150ms' }}>
              {label}
            </Link>
          ))}
          <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}
            className="landing-nav-signin" style={{ padding: '7px 16px', fontSize: '13px', fontWeight: 500, textDecoration: 'none', borderRadius: '8px', border: '1px solid', transition: 'border-color 150ms, color 150ms' }}>
            Sign In
          </Link>
          <button onClick={() => { setIsMobileMenuOpen(false); router.push('/login'); }}
            style={{ padding: '8px 18px', fontSize: '13px', fontWeight: 700, background: '#2255ec', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', transition: 'background 150ms, transform 150ms' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1a44c8'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#2255ec'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Get Started
          </button>
        </div>
        <button type="button" className="landing-menu-toggle"
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={isMobileMenuOpen} aria-controls="landing-mobile-menu"
          onClick={() => setIsMobileMenuOpen((v) => !v)}>
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ════════════════════════════════════════════════════════
          HERO
      ════════════════════════════════════════════════════════ */}
      <section className="hero-section section-pad" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '100px 48px 72px' }}>
        <div className="hero-grid" style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '72px', alignItems: 'center' }}>

          {/* Left copy */}
          <div>
            {/* Badge */}
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(34,85,236,0.1)', border: '1px solid rgba(34,85,236,0.2)', fontSize: '12px', fontWeight: 600, color: '#2255ec', marginBottom: '32px' }}>
              <Zap size={12} /> AI-Powered Career Platform — Resume · Jobs · Interviews
            </div>

            <h1 className="hero-h1" style={{ lineHeight: 1.08, fontWeight: 800, marginBottom: '22px' }}>
              Your AI<br />
              <span style={{ color: '#2255ec' }}>Career Navigator</span>
            </h1>

            <p className="hero-subtext" style={{ lineHeight: 1.78, marginBottom: '40px', maxWidth: '460px' }}>
              Analyze your resume with AI, navigate your career path, track your progress, and ace
              interviews — all powered by Groq AI, all in one platform.
            </p>

            {/* CTA buttons */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '32px' }}>
              <button onClick={() => router.push('/login')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 24px', borderRadius: '10px', background: '#2255ec', color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(34,85,236,0.35)', transition: 'background 150ms, transform 150ms' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = '#1a44c8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = '#2255ec'; e.currentTarget.style.transform = 'translateY(0)'; }}>
                <FileText size={15} /> Analyze Resume <ArrowRight size={14} />
              </button>
              <button onClick={() => router.push('/login')} className="hero-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '13px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, border: '1.5px solid', cursor: 'pointer', transition: 'border-color 150ms, background 150ms' }}>
                <Search size={14} /> Find Career Path
              </button>
              <button onClick={() => router.push('/login')} className="hero-btn-secondary" style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '13px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 500, border: '1.5px solid', cursor: 'pointer', transition: 'border-color 150ms, background 150ms' }}>
                <Mic size={14} /> AI Chat
              </button>
            </div>

            {/* Trust badges */}
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {trustBadges.map((b) => (
                <span key={b} className="trust-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500 }}>
                  <CheckCircle size={13} style={{ color: '#059669', flexShrink: 0 }} /> {b}
                </span>
              ))}
            </div>
          </div>

          {/* Right — floating preview cards */}
          <div className="hero-floating-cards" style={{ position: 'relative', height: '460px' }}>
            {/* Subtle dot grid */}
            <div style={{ position: 'absolute', inset: 0, backgroundImage: 'radial-gradient(circle, rgba(34,85,236,0.15) 1.5px, transparent 1.5px)', backgroundSize: '28px 28px', borderRadius: '20px' }} />

            {/* Center glow orb */}
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: '180px', height: '180px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(34,85,236,0.1) 0%, transparent 70%)' }} />

            {/* Floating cards */}
            {[
              { top: '12px', right: '0px', bg: '#2255ec', isBlue: true, title: '500+ Questions', sub: 'Across 50+ tech stacks' },
              { top: '80px', left: '0px', isBlue: false, title: '🧠 Groq AI Engine', sub: 'Ultra-fast inference' },
              { bottom: '100px', right: '0px', isBlue: false, title: '📄 Resume Analyzer', sub: 'ATS + NLP feedback' },
              { bottom: '16px', left: '10px', isBlue: false, title: '🎙️ AI Chat Assistant', sub: 'Career advice 24/7' },
            ].map((card, i) => (
              <div key={i} className={card.isBlue ? '' : 'hero-float-card'} style={{
                position: 'absolute',
                top: card.top, right: card.right, bottom: card.bottom, left: card.left,
                borderRadius: '16px', padding: '16px 20px',
                minWidth: '180px',
                ...(card.isBlue
                  ? { background: '#2255ec', boxShadow: '0 10px 32px rgba(34,85,236,0.4)' }
                  : {}),
              }}>
                <p style={{ fontSize: '13px', fontWeight: 700, ...(card.isBlue ? { color: '#fff' } : {}) }}>{card.title}</p>
                <p style={{ fontSize: '11px', marginTop: '3px', ...(card.isBlue ? { color: 'rgba(255,255,255,0.75)' } : {}) }}>{card.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          STATS STRIP
      ════════════════════════════════════════════════════════ */}
      <section className="stats-section section-pad" style={{ padding: '0' }}>
        <div className="stats-inner" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 48px' }}>
          <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '1px' }}>
            {stats.map(({ icon: Icon, value, label }, idx) => (
              <div key={label} className="stat-item" style={{ textAlign: 'center', padding: '40px 24px', position: 'relative' }}>
                {/* right divider except last */}
                {idx < stats.length - 1 && (
                  <div className="stat-divider" style={{ position: 'absolute', right: 0, top: '25%', bottom: '25%', width: '1px' }} />
                )}
                <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: 'rgba(34,85,236,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                  <Icon size={22} style={{ color: '#2255ec' }} />
                </div>
                <p className="stat-value" style={{ fontSize: '30px', fontWeight: 800, letterSpacing: '-0.03em', lineHeight: 1, marginBottom: '6px' }}>{value}</p>
                <p className="stat-label" style={{ fontSize: '12px', fontWeight: 500 }}>{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FEATURES — Six Tools
      ════════════════════════════════════════════════════════ */}
      <section className="features-section section-pad" style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          {/* Section heading */}
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(34,85,236,0.1)', border: '1px solid rgba(34,85,236,0.2)', fontSize: '12px', fontWeight: 600, color: '#2255ec', marginBottom: '18px' }}>
              ✦ Your Career Journey
            </div>
            <h2 className="landing-section-h2 section-h2" style={{ fontWeight: 800, lineHeight: 1.12, marginBottom: '14px' }}>
              Six Tools to <span style={{ color: '#2255ec' }}>Career Success</span>
            </h2>
            <p className="section-subtext" style={{ fontSize: '15px', maxWidth: '520px', margin: '0 auto', lineHeight: 1.75 }}>
              From resume analysis to AI career coaching — everything you need to land your next role, all in one platform.
            </p>
          </div>

          {/* Feature cards grid */}
          <div className="features-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '24px' }}>
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="feature-card" style={{ borderRadius: '20px', padding: '32px', display: 'flex', flexDirection: 'column', transition: 'box-shadow 220ms, transform 220ms' }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-5px)'; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; }}>

                  {/* Icon + tag row */}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                    <div style={{ width: '52px', height: '52px', borderRadius: '15px', background: f.dimColor, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon size={24} style={{ color: f.color }} />
                    </div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: f.color, background: f.dimColor, padding: '5px 13px', borderRadius: '9999px', letterSpacing: '0.01em' }}>
                      {f.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="feature-card-title" style={{ fontSize: '18px', fontWeight: 800, marginBottom: '10px', letterSpacing: '-0.01em' }}>{f.title}</h3>

                  {/* Description */}
                  <p className="feature-card-desc" style={{ fontSize: '13px', lineHeight: 1.78, marginBottom: '22px' }}>{f.desc}</p>

                  {/* Bullet list */}
                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: '10px', flex: 1 }}>
                    {f.bullets.map((b) => (
                      <li key={b} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: f.color, flexShrink: 0 }} />
                        <span className="feature-bullet" style={{ fontSize: '13px' }}>{b}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <button onClick={() => router.push(f.href)} style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', gap: '7px', padding: '13px 20px', borderRadius: '11px', background: f.color, color: '#fff', fontSize: '13px', fontWeight: 700, border: 'none', cursor: 'pointer', width: '100%', transition: 'opacity 150ms, transform 150ms' }}
                    onMouseEnter={(e) => { e.currentTarget.style.opacity = '0.88'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                    onMouseLeave={(e) => { e.currentTarget.style.opacity = '1';    e.currentTarget.style.transform = 'translateY(0)'; }}>
                    {f.btn} <ArrowRight size={14} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          JOB PORTALS
      ════════════════════════════════════════════════════════ */}
      <section className="portals-section section-pad" style={{ padding: '96px 48px' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>

          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(5,150,105,0.1)', border: '1px solid rgba(5,150,105,0.22)', fontSize: '12px', fontWeight: 600, color: '#059669', marginBottom: '18px' }}>
              ✦ Job Portal Coverage
            </div>
            <h2 className="landing-section-h2 section-h2" style={{ fontWeight: 800, lineHeight: 1.12, marginBottom: '14px' }}>
              One Click, <span style={{ color: '#059669' }}>Every Major Portal</span>
            </h2>
            <p className="section-subtext" style={{ fontSize: '15px', maxWidth: '540px', margin: '0 auto', lineHeight: 1.75 }}>
              We generate smart search links for the job sites you actually use — your role and
              location pre-filled, one click opens each in a new tab.
            </p>
          </div>

          <div className="portals-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '18px', marginBottom: '44px' }}>
            {portals.map((p) => (
              <div key={p.name} className="portal-card" style={{ borderRadius: '18px', padding: '32px 16px', textAlign: 'center', cursor: 'pointer', transition: 'box-shadow 200ms, transform 200ms' }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '15px', background: p.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: '#fff', fontWeight: 800, fontSize: '18px', boxShadow: `0 6px 18px ${p.bg}44` }}>
                  {p.letter}
                </div>
                <p className="portal-name" style={{ fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>{p.name}</p>
                <p className="portal-desc" style={{ fontSize: '11px', lineHeight: 1.6 }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <p className="section-subtext" style={{ textAlign: 'center', fontSize: '13px', marginBottom: '32px', lineHeight: 1.75 }}>
            Each card opens the platform in a new tab with your search ready.<br />
            You apply on the original site — we don&apos;t store applications or charge fees.
          </p>

          <div style={{ textAlign: 'center' }}>
            <button onClick={() => router.push('/login')} style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '14px 30px', borderRadius: '11px', background: '#059669', color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 6px 20px rgba(5,150,105,0.3)', transition: 'background 150ms, transform 150ms' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = '#047857'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = '#059669'; e.currentTarget.style.transform = 'translateY(0)'; }}>
              Try Smart Job Search <ArrowRight size={15} />
            </button>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════
          FINAL CTA
      ════════════════════════════════════════════════════════ */}
      <section className="cta-section section-pad" style={{ padding: '96px 48px' }}>
        <div className="cta-inner" style={{ maxWidth: '680px', margin: '0 auto', textAlign: 'center', borderRadius: '28px', padding: '72px 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '7px', padding: '6px 16px', borderRadius: '9999px', background: 'rgba(34,85,236,0.1)', border: '1px solid rgba(34,85,236,0.2)', fontSize: '12px', fontWeight: 600, color: '#2255ec', marginBottom: '24px' }}>
            <Zap size={12} /> Ready to start?
          </div>
          <h2 className="landing-section-h2 section-h2" style={{ fontWeight: 800, lineHeight: 1.12, marginBottom: '16px' }}>
            Ready to <span style={{ color: '#2255ec' }}>Navigate Your Career</span>?
          </h2>
          <p className="section-subtext" style={{ fontSize: '15px', marginBottom: '36px', lineHeight: 1.78 }}>
            Analyze your resume, discover career paths, track your progress, and chat with AI —
            start your journey today, completely free.
          </p>
          <button onClick={() => router.push('/login')} style={{ display: 'inline-flex', alignItems: 'center', gap: '9px', padding: '15px 36px', borderRadius: '12px', background: '#2255ec', color: '#fff', fontSize: '15px', fontWeight: 700, border: 'none', cursor: 'pointer', boxShadow: '0 8px 28px rgba(34,85,236,0.35)', transition: 'background 150ms, transform 150ms' }}
            onMouseEnter={(e) => { e.currentTarget.style.background = '#1a44c8'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = '#2255ec'; e.currentTarget.style.transform = 'translateY(0)'; }}>
            Get Started Free <ArrowRight size={16} />
          </button>
          <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center', marginTop: '28px' }}>
            {trustBadges.map((b) => (
              <span key={b} className="trust-badge" style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', fontSize: '12px', fontWeight: 500 }}>
                <CheckCircle size={13} style={{ color: '#059669', flexShrink: 0 }} /> {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Inline styles (scoped to landing page only) ── */}
      <style>{`
        /* ─── landing root ─── */
        .landing-root { background: #ffffff; color: #0f1729; }

        /* ─── navbar ─── */
        .landing-nav { background: rgba(255,255,255,0.96); border-bottom: 1px solid #e5e7eb; }
        .landing-nav-brand { color: #0f1729; }
        .landing-nav-link { color: #374151; }
        .landing-nav-link:hover { background: #f3f4f6; }
        .landing-nav-signin { color: #374151; border-color: #e5e7eb; }
        .landing-nav-signin:hover { border-color: #2255ec; color: #2255ec; }

        /* ─── hero ─── */
        .hero-section { background: linear-gradient(160deg, #f0f4ff 0%, #ffffff 55%); }
        .hero-h1 { font-size: clamp(38px, 5vw, 56px); color: #0f1729; }
        .hero-subtext { font-size: 16px; color: #6b7280; }
        .hero-btn-secondary { background: #ffffff; color: #0f1729; border-color: #e5e7eb; }
        .hero-btn-secondary:hover { border-color: #2255ec; background: #f5f7ff; }
        .trust-badge { color: #6b7280; }
        .hero-float-card { background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 6px 24px rgba(0,0,0,0.07); }
        .hero-float-card p:first-child { color: #0f1729; }
        .hero-float-card p:last-child  { color: #6b7280; }

        /* ─── stats ─── */
        .stats-section { background: #f9fafb; border-top: 1px solid #e5e7eb; border-bottom: 1px solid #e5e7eb; }
        .stat-item { background: transparent; }
        .stat-divider { background: #e5e7eb; }
        .stat-value { color: #0f1729; }
        .stat-label { color: #6b7280; }

        /* ─── features ─── */
        .features-section { background: #ffffff; }
        .section-subtext { color: #6b7280; }
        .feature-card { background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .feature-card:hover { box-shadow: 0 14px 44px rgba(0,0,0,0.1); }
        .feature-card-title { color: #0f1729; }
        .feature-card-desc { color: #6b7280; }
        .feature-bullet { color: #374151; }

        /* ─── portals ─── */
        .portals-section { background: #f9fafb; border-top: 1px solid #e5e7eb; }
        .portal-card { background: #fff; border: 1px solid #e5e7eb; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
        .portal-card:hover { box-shadow: 0 10px 32px rgba(0,0,0,0.09); }
        .portal-name { color: #0f1729; }
        .portal-desc { color: #6b7280; }

        /* ─── CTA ─── */
        .cta-section { background: #fff; border-top: 1px solid #e5e7eb; }
        .cta-inner { background: linear-gradient(135deg, #f0f4ff 0%, #f9fafb 100%); border: 1px solid #e0e8ff; }

        /* ── section headings ── */
        .section-h2 { font-size: clamp(28px, 4vw, 40px); color: #0f1729; }

        /* ─── dark mode overrides ─── */
        [data-theme='dark'] .landing-root { background: #0f1117; color: #cbd5e1; }
        [data-theme='dark'] .landing-nav { background: rgba(15,17,23,0.97) !important; border-bottom-color: #272d3d !important; }
        [data-theme='dark'] .landing-nav-brand { color: #f1f5f9 !important; }
        [data-theme='dark'] .landing-nav-link { color: #94a3b8 !important; }
        [data-theme='dark'] .landing-nav-link:hover { background: #1a1f2e !important; }
        [data-theme='dark'] .landing-nav-signin { color: #94a3b8 !important; border-color: #272d3d !important; }
        [data-theme='dark'] .landing-nav-signin:hover { border-color: #2255ec !important; color: #93b4ff !important; }
        [data-theme='dark'] .hero-section { background: linear-gradient(160deg, #0f1421 0%, #0f1117 60%) !important; }
        [data-theme='dark'] .hero-h1 { color: #f1f5f9 !important; }
        [data-theme='dark'] .hero-subtext { color: #94a3b8 !important; }
        [data-theme='dark'] .hero-btn-secondary { background: #1a1f2e !important; color: #cbd5e1 !important; border-color: #272d3d !important; }
        [data-theme='dark'] .hero-btn-secondary:hover { border-color: #2255ec !important; background: #1e2540 !important; }
        [data-theme='dark'] .trust-badge { color: #64748b !important; }
        [data-theme='dark'] .hero-float-card { background: #1a1f2e !important; border-color: #272d3d !important; box-shadow: 0 6px 24px rgba(0,0,0,0.4) !important; }
        [data-theme='dark'] .hero-float-card p:first-child { color: #f1f5f9 !important; }
        [data-theme='dark'] .hero-float-card p:last-child  { color: #64748b !important; }
        [data-theme='dark'] .stats-section { background: #141720 !important; border-color: #272d3d !important; }
        [data-theme='dark'] .stat-divider { background: #272d3d !important; }
        [data-theme='dark'] .stat-value { color: #f1f5f9 !important; }
        [data-theme='dark'] .stat-label { color: #64748b !important; }
        [data-theme='dark'] .features-section { background: #0f1117 !important; }
        [data-theme='dark'] .section-subtext { color: #64748b !important; }
        [data-theme='dark'] .feature-card { background: #181c27 !important; border-color: #272d3d !important; box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important; }
        [data-theme='dark'] .feature-card:hover { box-shadow: 0 14px 44px rgba(0,0,0,0.5) !important; }
        [data-theme='dark'] .feature-card-title { color: #f1f5f9 !important; }
        [data-theme='dark'] .feature-card-desc { color: #64748b !important; }
        [data-theme='dark'] .feature-bullet { color: #94a3b8 !important; }
        [data-theme='dark'] .portals-section { background: #141720 !important; border-color: #272d3d !important; }
        [data-theme='dark'] .portal-card { background: #181c27 !important; border-color: #272d3d !important; box-shadow: 0 2px 8px rgba(0,0,0,0.3) !important; }
        [data-theme='dark'] .portal-card:hover { box-shadow: 0 10px 32px rgba(0,0,0,0.5) !important; }
        [data-theme='dark'] .portal-name { color: #f1f5f9 !important; }
        [data-theme='dark'] .portal-desc { color: #64748b !important; }
        [data-theme='dark'] .cta-section { background: #0f1117 !important; border-color: #272d3d !important; }
        [data-theme='dark'] .cta-inner { background: linear-gradient(135deg, #111827 0%, #141720 100%) !important; border-color: #272d3d !important; }
        [data-theme='dark'] .section-h2 { color: #f1f5f9 !important; }

        /* ─── responsive ─── */
        @media (max-width: 1024px) {
          .features-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 900px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .hero-floating-cards { display: none !important; }
          .stats-grid { grid-template-columns: repeat(3,1fr) !important; }
          .portals-grid { grid-template-columns: repeat(3,1fr) !important; }
        }
        @media (max-width: 640px) {
          .features-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .portals-grid { grid-template-columns: repeat(2,1fr) !important; }
          .cta-inner { padding: 40px 24px !important; }
          .landing-nav { padding: 0 20px !important; }
          section { padding-left: 20px !important; padding-right: 20px !important; }
        }
        .landing-menu-toggle {
          display: none; background: none; border: none; cursor: pointer; color: #374151; padding: 6px;
        }
        @media (max-width: 768px) {
          .landing-menu-toggle { display: flex; align-items: center; }
          .landing-nav-cta:not(.open) { display: none !important; }
          .landing-nav-cta.open {
            display: flex !important; flex-direction: column; position: fixed;
            top: 62px; left: 0; right: 0; background: #fff; padding: 20px;
            border-bottom: 1px solid #e5e7eb; z-index: 49; gap: 8px;
          }
          [data-theme='dark'] .landing-nav-cta.open { background: #1a1f2e !important; border-color: #272d3d !important; }
        }
        [data-theme='dark'] .landing-menu-toggle { color: #94a3b8 !important; }
      `}</style>
    </div>
  );
}
