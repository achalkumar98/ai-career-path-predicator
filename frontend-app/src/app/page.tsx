'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  FileText,
  Search,
  Mic,
  BookOpen,
  Layers,
  Users,
  FileCheck,
  Headphones,
  ArrowRight,
  CheckCircle,
  LayoutDashboard,
  Compass,
  TrendingUp,
  MessageSquare,
  Brain,
  Upload,
  Menu,
  X,
  MapPin,
  Filter,
} from 'lucide-react';

const stats = [
  { icon: BookOpen, value: '500+', label: 'Interview Questions' },
  { icon: Layers, value: '50+', label: 'Tech Stacks' },
  { icon: Users, value: '2.5k+', label: 'Users' },
  { icon: FileCheck, value: '300+', label: 'Resumes Created' },
  { icon: Headphones, value: '100+', label: 'Mock Interviews' },
];

const features = [
  {
    icon: LayoutDashboard,
    title: 'Dashboard',
    desc: 'Your AI-powered career command center. See all your tools, stats, and progress at a glance — everything in one place.',
    bullets: [
      '94+ career paths mapped',
      '1,250+ skills analyzed',
      '85% user success rate',
      'Avg. 6-month transition',
    ],
    btn: 'Go to Dashboard',
    color: '#2255ec',
    bg: '#eef2ff',
    tag: 'Command Center',
  },
  {
    icon: Compass,
    title: 'Career Navigator',
    desc: 'Discover your ideal career path using AI. Enter your skills and interests — get personalized career recommendations, growth roadmaps, and actionable next steps instantly.',
    bullets: [
      'AI skill-to-career matching',
      'Fastest-growing role insights',
      'Personalized growth roadmaps',
      'Actionable next steps',
    ],
    btn: 'Explore Careers',
    color: '#2255ec',
    bg: '#eef2ff',
    tag: 'AI-Powered',
  },
  {
    icon: TrendingUp,
    title: 'Progress Tracker',
    desc: "Review your assessment history, track skill growth, and see how far you've come on your career journey with a full timeline view.",
    bullets: [
      'Full assessment history',
      'Skill growth over time',
      'Chronological timeline view',
      'Refresh & sync anytime',
    ],
    btn: 'Track My Progress',
    color: '#059669',
    bg: '#f0fdf4',
    tag: 'Your Journey',
  },
  {
    icon: Upload,
    title: 'Resume Analyzer',
    desc: 'Upload your PDF resume and get AI-powered skill extraction, keyword analysis, and ATS compatibility feedback in seconds.',
    bullets: [
      'PDF upload & parsing',
      'NLP skill extraction',
      'ATS compatibility check',
      'Keyword gap analysis',
    ],
    btn: 'Analyze My Resume',
    color: '#7c3aed',
    bg: '#faf5ff',
    tag: 'NLP Analysis',
  },
  {
    icon: Brain,
    title: 'Personality & Trends',
    desc: 'Describe yourself and get AI-powered personality analysis, career trend insights, and tailored recommendations based on who you are.',
    bullets: [
      'Work style & personality analysis',
      'Personality-to-career fit',
      'Live market trend data',
      'Tailored AI recommendations',
    ],
    btn: 'Get My Insight',
    color: '#d97706',
    bg: '#fffbeb',
    tag: 'AI Insights',
  },
  {
    icon: MessageSquare,
    title: 'AI Chat Assistant',
    desc: 'Ask anything about careers, skills, job market trends, or interview tips. Your AI career advisor is available 24/7 with voice input support.',
    bullets: [
      'Real-time AI responses',
      'Full chat message history',
      'Voice input support',
      'Career & interview tips',
    ],
    btn: 'Start Chatting',
    color: '#059669',
    bg: '#f0fdf4',
    tag: 'Always On',
  },
];

const jobFeatures = [
  {
    icon: Search,
    title: 'Keyword Search',
    desc: 'Search by any role, skill, or technology — frontend developer, Python, DevOps, and more.',
    color: '#2255ec',
    bg: '#eef2ff',
  },
  {
    icon: MapPin,
    title: 'Location Filtered',
    desc: 'Target jobs in your preferred city or region. Exact-match and nearby results both shown.',
    color: '#059669',
    bg: '#f0fdf4',
  },
  {
    icon: TrendingUp,
    title: 'Live LinkedIn Listings',
    desc: 'Fresh postings scraped directly from LinkedIn in real time — no stale data, no sign-in needed.',
    color: '#7c3aed',
    bg: '#faf5ff',
  },
  {
    icon: Filter,
    title: 'Date Range Filter',
    desc: 'Narrow results by posted date — last 24 hours, 7 days, custom range, and more.',
    color: '#d97706',
    bg: '#fffbeb',
  },
  {
    icon: Layers,
    title: 'Paginated Results',
    desc: 'Browse up to 12 jobs per page with smooth pagination — never lose your place mid-search.',
    color: '#0891b2',
    bg: '#ecfeff',
  },
  {
    icon: FileCheck,
    title: 'Direct Apply Links',
    desc: 'Every result includes a direct link to apply on LinkedIn — one click and you\'re there.',
    color: '#dc2626',
    bg: '#fef2f2',
  },
];

export default function LandingPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#fff',
        color: '#0f1729',
        fontFamily: 'Inter, sans-serif',
      }}
    >
      {/* ── Navbar ── */}
      <nav
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          height: '60px',
          background: 'rgba(255,255,255,0.96)',
          backdropFilter: 'blur(8px)',
          borderBottom: '1px solid #e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 48px',
        }}
        className="landing-nav"
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            textDecoration: 'none',
          }}
        >
          <Image
            src="/assets/aicareernav-logo.png"
            alt="AiCareerNav"
            width={32}
            height={32}
            priority
            style={{ borderRadius: '8px', objectFit: 'contain' }}
          />
          <span style={{ fontSize: '15px', fontWeight: 700, color: '#0f1729' }}>AICareerNav</span>
        </Link>
        <div
          id="landing-mobile-menu"
          style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          className={`landing-nav-cta${isMobileMenuOpen ? ' open' : ''}`}
        >
          <Link
            href="/contact"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              padding: '7px 14px',
              fontSize: '13px',
              color: '#374151',
              textDecoration: 'none',
              borderRadius: '8px',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Contact Us
          </Link>
          <Link
            href="/upgrade"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              padding: '7px 14px',
              fontSize: '13px',
              color: '#374151',
              textDecoration: 'none',
              borderRadius: '8px',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#f3f4f6')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Pricing
          </Link>
          <Link
            href="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            style={{
              padding: '7px 16px',
              fontSize: '13px',
              color: '#374151',
              textDecoration: 'none',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              transition: 'border-color 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
          >
            Sign In
          </Link>
          <button
            onClick={() => {
              setIsMobileMenuOpen(false);
              router.push('/login');
            }}
            style={{
              padding: '7px 18px',
              fontSize: '13px',
              fontWeight: 600,
              background: '#2255ec',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1a44c8')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2255ec')}
          >
            Get Started
          </button>
        </div>
        <button
          type="button"
          className="landing-menu-toggle"
          aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMobileMenuOpen}
          aria-controls="landing-mobile-menu"
          onClick={() => setIsMobileMenuOpen((isOpen) => !isOpen)}
        >
          {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* ── Hero ── */}
      <section
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          padding: '80px 48px 60px',
          background: 'linear-gradient(160deg, #f8faff 0%, #ffffff 60%)',
        }}
        className="hero-section"
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            width: '100%',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '64px',
            alignItems: 'center',
          }}
          className="hero-grid"
        >
          <div>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                borderRadius: '9999px',
                background: 'rgba(34,85,236,0.07)',
                border: '1px solid rgba(34,85,236,0.18)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#2255ec',
                marginBottom: '28px',
              }}
            >
              ✦ AI-Powered Career Platform — Resume · Jobs · Interviews
            </div>
            <h1
              style={{
                fontSize: '54px',
                fontWeight: 800,
                lineHeight: 1.1,
                color: '#0f1729',
                marginBottom: '20px',
              }}
              className="hero-h1"
            >
              Your AI
              <br />
              <span style={{ color: '#2255ec' }}>Career Navigator</span>
            </h1>
            <p
              style={{
                fontSize: '16px',
                color: '#6b7280',
                lineHeight: 1.75,
                marginBottom: '36px',
                maxWidth: '460px',
              }}
            >
              Analyze your resume with AI, navigate your career path, track your progress, and ace
              interviews — all powered by Google groq , all in one platform.
            </p>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                flexWrap: 'wrap',
                marginBottom: '28px',
              }}
            >
              <button
                onClick={() => router.push('/login')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '12px 22px',
                  borderRadius: '10px',
                  background: '#2255ec',
                  color: '#fff',
                  fontSize: '14px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(34,85,236,0.28)',
                  transition: 'background 150ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.background = '#1a44c8')}
                onMouseLeave={(e) => (e.currentTarget.style.background = '#2255ec')}
              >
                <FileText size={14} /> Analyze Resume <ArrowRight size={13} />
              </button>
              <span style={{ color: '#d1d5db', fontSize: '16px' }}>→</span>
              <button
                onClick={() => router.push('/login')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: '#fff',
                  color: '#0f1729',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: '1.5px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <Search size={13} /> Find Career Path
              </button>
              <span style={{ color: '#d1d5db', fontSize: '16px' }}>→</span>
              <button
                onClick={() => router.push('/login')}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '7px',
                  padding: '12px 18px',
                  borderRadius: '10px',
                  background: '#fff',
                  color: '#0f1729',
                  fontSize: '14px',
                  fontWeight: 500,
                  border: '1.5px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'border-color 150ms',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                onMouseLeave={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
              >
                <Mic size={13} /> AI Chat
              </button>
            </div>
            <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap' }}>
              {['No credit card', 'Powered by groq  AI', 'Available 24/7'].map((t) => (
                <span
                  key={t}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    color: '#6b7280',
                  }}
                >
                  <CheckCircle size={13} style={{ color: '#059669' }} /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Right floating cards */}
          <div style={{ position: 'relative', height: '440px' }} className="hero-floating-cards">
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                display: 'grid',
                gridTemplateColumns: 'repeat(6,1fr)',
                gap: '10px',
                opacity: 0.12,
              }}
            >
              {Array.from({ length: 36 }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '4px',
                    height: '4px',
                    borderRadius: '50%',
                    background: '#2255ec',
                  }}
                />
              ))}
            </div>
            <div
              style={{
                position: 'absolute',
                top: '10px',
                right: '0',
                background: '#2255ec',
                color: '#fff',
                borderRadius: '14px',
                padding: '16px 20px',
                boxShadow: '0 8px 28px rgba(34,85,236,0.32)',
                minWidth: '180px',
              }}
            >
              <p style={{ fontSize: '14px', fontWeight: 700 }}>500+ Questions</p>
              <p style={{ fontSize: '11px', opacity: 0.8, marginTop: '2px' }}>
                Across 50+ tech stacks
              </p>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '70px',
                left: '0',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                padding: '14px 18px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.07)',
                minWidth: '170px',
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f1729' }}>
                🧠 groq AI Engine
              </p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                Powered by Google groq
              </p>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '110px',
                right: '0',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                padding: '14px 18px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.07)',
                minWidth: '160px',
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f1729' }}>
                📄 Resume Analyzer
              </p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                ATS + NLP feedback
              </p>
            </div>
            <div
              style={{
                position: 'absolute',
                bottom: '20px',
                left: '10px',
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '14px',
                padding: '14px 18px',
                boxShadow: '0 4px 18px rgba(0,0,0,0.07)',
                minWidth: '180px',
              }}
            >
              <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f1729' }}>
                🎙️ AI Chat Assistant
              </p>
              <p style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                Career advice 24/7
              </p>
            </div>
            <div
              style={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                transform: 'translate(-50%,-50%)',
                width: '160px',
                height: '160px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg,rgba(34,85,236,0.06),rgba(5,150,105,0.06))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '72px',
              }}
            >
              🧑💼
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section
        style={{
          padding: '64px 48px',
          background: '#f9fafb',
          borderTop: '1px solid #e5e7eb',
          borderBottom: '1px solid #e5e7eb',
        }}
        className="section-pad"
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(5,1fr)',
            gap: '24px',
          }}
          className="stats-grid"
        >
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '54px',
                  height: '54px',
                  borderRadius: '14px',
                  background: 'rgba(34,85,236,0.08)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 14px',
                }}
              >
                <Icon size={22} style={{ color: '#2255ec' }} />
              </div>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: 800,
                  color: '#0f1729',
                  marginBottom: '4px',
                }}
              >
                {value}
              </p>
              <p style={{ fontSize: '12px', color: '#6b7280' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── 6 Platform Features ── */}
      <section style={{ padding: '80px 48px', background: '#fff' }} className="section-pad">
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(34,85,236,0.06)',
                border: '1px solid rgba(34,85,236,0.15)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#2255ec',
                marginBottom: '16px',
              }}
            >
              ✦ Your Career Journey
            </div>
            <h2
              style={{
                fontSize: '38px',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#0f1729',
                marginBottom: '12px',
              }}
              className="section-h2 landing-section-h2"
            >
              Six Tools to <span style={{ color: '#2255ec' }}>Career Success</span>
            </h2>
            <p
              style={{
                fontSize: '15px',
                color: '#6b7280',
                maxWidth: '520px',
                margin: '0 auto',
              }}
            >
              From resume analysis to AI career coaching — everything you need to land your next
              role, all in one platform.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              gap: '24px',
            }}
            className="features-grid"
          >
            {features.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  style={{
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '20px',
                    padding: '32px',
                    display: 'flex',
                    flexDirection: 'column',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                    transition: 'box-shadow 200ms, transform 200ms, border-color 200ms',
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = '0 12px 40px rgba(0,0,0,0.1)';
                    el.style.transform = 'translateY(-4px)';
                    el.style.borderColor = f.color;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)';
                    el.style.transform = 'translateY(0)';
                    el.style.borderColor = '#e5e7eb';
                  }}
                >
                  {/* Icon + Tag */}
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '20px',
                    }}
                  >
                    <div
                      style={{
                        width: '48px',
                        height: '48px',
                        borderRadius: '14px',
                        background: f.bg,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Icon size={22} style={{ color: f.color }} />
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: 600,
                        color: f.color,
                        background: f.bg,
                        padding: '4px 12px',
                        borderRadius: '9999px',
                      }}
                    >
                      {f.tag}
                    </span>
                  </div>

                  {/* Title */}
                  <h3
                    style={{
                      fontSize: '18px',
                      fontWeight: 700,
                      color: '#0f1729',
                      marginBottom: '10px',
                    }}
                  >
                    {f.title}
                  </h3>

                  {/* Description */}
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#6b7280',
                      lineHeight: 1.75,
                      marginBottom: '20px',
                    }}
                  >
                    {f.desc}
                  </p>

                  {/* Bullet highlights */}
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '9px',
                      marginBottom: '28px',
                      flex: 1,
                    }}
                  >
                    {f.bullets.map((b) => (
                      <div
                        key={b}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '9px',
                        }}
                      >
                        <div
                          style={{
                            width: '7px',
                            height: '7px',
                            borderRadius: '50%',
                            background: f.color,
                            flexShrink: 0,
                          }}
                        />
                        <span style={{ fontSize: '13px', color: '#374151' }}>{b}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA — always goes to /login */}
                  <button
                    onClick={() => router.push('/login')}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '7px',
                      padding: '12px 20px',
                      borderRadius: '10px',
                      background: f.color,
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: 'pointer',
                      width: '100%',
                      transition: 'opacity 150ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.85')}
                    onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
                  >
                    {f.btn} <ArrowRight size={13} />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Live Job Matching ── */}
      <section
        style={{
          padding: '80px 48px',
          background: 'linear-gradient(180deg,#eef2ff 0%,#f9fafb 100%)',
          borderTop: '1px solid #e5e7eb',
        }}
        className="section-pad"
      >
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 16px',
                borderRadius: '9999px',
                background: 'rgba(34,85,236,0.08)',
                border: '1px solid rgba(34,85,236,0.2)',
                fontSize: '12px',
                fontWeight: 600,
                color: '#2255ec',
                marginBottom: '16px',
              }}
            >
              ✦ Live Job Matching
            </div>
            <h2
              style={{
                fontSize: '38px',
                fontWeight: 800,
                lineHeight: 1.15,
                color: '#0f1729',
                marginBottom: '12px',
              }}
              className="landing-section-h2"
            >
              Real Jobs from <span style={{ color: '#2255ec' }}>LinkedIn — Live</span>
            </h2>
            <p style={{ fontSize: '15px', color: '#6b7280', maxWidth: '560px', margin: '0 auto' }}>
              Search live LinkedIn job listings by keyword and location. Fresh postings scraped in
              real time — no stale data, no sign-in required, direct apply links included.
            </p>
          </div>

          {/* How it works — 3-step strip */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3,1fr)',
              marginBottom: '48px',
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: '20px',
              overflow: 'hidden',
            }}
            className="how-it-works-grid"
          >
            {([
              { step: '01', icon: Search,    title: 'Enter Keyword & Location', desc: 'Type any role, skill, or technology alongside your preferred city or region.' },
              { step: '02', icon: TrendingUp, title: 'We Scrape LinkedIn Live',   desc: 'Our engine fetches fresh postings directly from LinkedIn — no cached data.' },
              { step: '03', icon: FileCheck,  title: 'Browse & Apply Directly',   desc: 'Filter by date, paginate results, and click any card to apply on LinkedIn.' },
            ] as { step: string; icon: React.ElementType; title: string; desc: string }[]).map(({ step, icon: Icon, title, desc }, idx) => (
              <div
                key={step}
                style={{ padding: '36px 28px', borderRight: idx < 2 ? '1px solid #e5e7eb' : 'none' }}
              >
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                  <div style={{ width: '46px', height: '46px', borderRadius: '13px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={19} style={{ color: '#2255ec' }} />
                  </div>
                  <div>
                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#2255ec', letterSpacing: '0.06em' }}>STEP {step}</span>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729', margin: '5px 0 7px' }}>{title}</p>
                    <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65 }}>{desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Feature cards */}
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '16px', marginBottom: '44px' }}
            className="features-grid"
          >
            {jobFeatures.map((f) => {
              const Icon = f.icon;
              return (
                <div
                  key={f.title}
                  style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '16px', padding: '24px', transition: 'box-shadow 200ms, transform 200ms, border-color 200ms' }}
                  onMouseEnter={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = '0 8px 28px rgba(0,0,0,0.08)'; el.style.transform = 'translateY(-3px)'; el.style.borderColor = f.color; }}
                  onMouseLeave={(e) => { const el = e.currentTarget as HTMLElement; el.style.boxShadow = 'none'; el.style.transform = 'translateY(0)'; el.style.borderColor = '#e5e7eb'; }}
                >
                  <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: f.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '13px' }}>
                    <Icon size={18} style={{ color: f.color }} />
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729', marginBottom: '6px' }}>{f.title}</p>
                  <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.65 }}>{f.desc}</p>
                </div>
              );
            })}
          </div>

          {/* Disclaimer + CTA */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '24px', lineHeight: 1.75 }}>
              Jobs are fetched live from LinkedIn — results may take 15–30 seconds.
              <br />
              You apply directly on LinkedIn. We never store your applications or charge fees.
            </p>
            <button
              onClick={() => router.push('/login')}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', borderRadius: '10px', background: '#2255ec', color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,85,236,0.28)', transition: 'background 150ms' }}
              onMouseEnter={(e) => (e.currentTarget.style.background = '#1a44c8')}
              onMouseLeave={(e) => (e.currentTarget.style.background = '#2255ec')}
            >
              Search Live Jobs <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section
        style={{
          padding: '80px 48px',
          background: '#fff',
          borderTop: '1px solid #e5e7eb',
        }}
        className="section-pad"
      >
        <div style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
          <h2
            style={{
              fontSize: '38px',
              fontWeight: 800,
              lineHeight: 1.15,
              color: '#0f1729',
              marginBottom: '14px',
            }}
            className="landing-section-h2"
          >
            Ready to <span style={{ color: '#2255ec' }}>Navigate Your Career</span>?
          </h2>
          <p style={{ fontSize: '15px', color: '#6b7280', marginBottom: '32px' }}>
            Analyze your resume, discover career paths, track your progress, and chat with AI —
            start your journey today.
          </p>
          <button
            onClick={() => router.push('/login')}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '14px 32px',
              borderRadius: '10px',
              background: '#2255ec',
              color: '#fff',
              fontSize: '15px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(34,85,236,0.28)',
              transition: 'background 150ms',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = '#1a44c8')}
            onMouseLeave={(e) => (e.currentTarget.style.background = '#2255ec')}
          >
            Get Started Free <ArrowRight size={15} />
          </button>
        </div>
      </section>
    </div>
  );
}
