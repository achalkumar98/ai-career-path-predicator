'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  Building2,
  Sparkles,
  Target,
  TrendingUp,
  X,
  ArrowRight,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { findJobMatchesApi } from '@/api/jobMatchingApi';

interface Job {
  title: string;
  company: string;
  location: string;
  matchReason: string;
}

export default function JobMatching() {
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [searched, setSearched] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanedSkills = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const cleanedInterests = interests
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);
    if (!cleanedSkills.length || !cleanedInterests.length) {
      alert('Please enter at least one skill and one interest.');
      return;
    }
    setLoading(true);
    try {
      const res = await findJobMatchesApi(cleanedSkills, cleanedInterests);
      setJobs(res.data.jobs ?? []);
      setSearched(true);
    } catch {
      alert("Error: Make sure you're logged in and your server is running.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJobs([]);
    setSearched(false);
    setSkills('');
    setInterests('');
  };

  const highlights = [
    {
      icon: Target,
      label: 'Smart Matching',
      desc: 'AI cross-references your skills against real job roles',
    },
    {
      icon: TrendingUp,
      label: 'Market Aligned',
      desc: 'Jobs matched to current hiring trends',
    },
    {
      icon: Sparkles,
      label: 'Interest Driven',
      desc: 'Roles that align with what motivates you',
    },
  ];

  // Accent for this page: green/emerald to differentiate from career-navigator
  const accent = '#2255ec';
  const accentLight = '#eef2ff';
  const accentHover = '#1a44c8';

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb' }}>
      {/* Back bar */}
      <div
        style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 48px' }}
        className="back-bar"
      >
        <Link
          href="/homepage"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            color: '#374151',
            fontSize: '13px',
          }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 60%)',
          borderBottom: '1px solid #e5e7eb',
          padding: '64px 48px',
          textAlign: 'center',
        }}
        className="inner-hero"
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(34,85,236,0.08)',
            border: '1px solid rgba(34,85,236,0.2)',
            fontSize: '12px',
            fontWeight: 600,
            color: accent,
            marginBottom: '24px',
          }}
        >
          <Briefcase size={13} />
          AI Job Matching
        </div>

        <h1
          style={{
            fontSize: '42px',
            fontWeight: 800,
            color: '#0f1729',
            lineHeight: 1.15,
            marginBottom: '16px',
          }}
          className="hero-title"
        >
          Find Jobs That
          <br />
          <span style={{ color: accent }}>Match You</span>
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: '#6b7280',
            maxWidth: '560px',
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}
        >
          Enter your skills and interests and let AI surface the roles that fit your profile — with
          clear reasons why each one is a match.
        </p>

        <button
          onClick={() => {
            setOpen(true);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 28px',
            borderRadius: '10px',
            background: accent,
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(34,85,236,0.3)',
            transition: 'background 150ms, transform 150ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = accentHover;
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = accent;
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          <Search size={15} />
          Find My Job Matches
        </button>
      </div>

      {/* Results section — shown after a search */}
      {searched && jobs.length > 0 && (
        <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }} className="page-pad">
          {/* Section header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1729' }}>
                Matched Jobs
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                {jobs.length} role{jobs.length !== 1 ? 's' : ''} found based on your profile
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                borderRadius: '8px',
                background: accentLight,
                color: accent,
                fontSize: '12px',
                fontWeight: 600,
                border: `1px solid rgba(34,85,236,0.2)`,
                cursor: 'pointer',
                transition: 'background 150ms',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#dde4fb')}
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = accentLight)
              }
            >
              <Search size={13} /> Search Again
            </button>
          </div>

          {/* Job cards */}
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}
            className="job-cards-grid"
          >
            {jobs.map((job, idx) => (
              <div
                key={idx}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '14px',
                  padding: '20px',
                  transition: 'box-shadow 200ms, transform 200ms',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 8px 24px rgba(34,85,236,0.1)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                  {/* Company logo placeholder */}
                  <div
                    style={{
                      width: '42px',
                      height: '42px',
                      borderRadius: '10px',
                      background: accentLight,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Building2 size={18} style={{ color: accent }} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: 700,
                        color: '#0f1729',
                        marginBottom: '3px',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {job.title}
                    </p>
                    <p style={{ fontSize: '12px', color: '#6b7280' }}>{job.company}</p>
                  </div>
                  {/* Match badge */}
                  <div
                    style={{
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '4px',
                      padding: '3px 8px',
                      borderRadius: '9999px',
                      background: '#f0fdf4',
                      border: '1px solid #bbf7d0',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#16a34a',
                    }}
                  >
                    <CheckCircle2 size={10} />
                    Match
                  </div>
                </div>

                {/* Location */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    color: '#6b7280',
                  }}
                >
                  <MapPin size={12} style={{ flexShrink: 0 }} />
                  {job.location}
                </div>

                {/* Divider */}
                <div style={{ height: '1px', background: '#f3f4f6' }} />

                {/* Match reason */}
                <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start' }}>
                  <Sparkles
                    size={13}
                    style={{ color: accent, flexShrink: 0, marginTop: '1px' }}
                  />
                  <p style={{ fontSize: '12px', color: '#374151', lineHeight: 1.6 }}>
                    {job.matchReason}
                  </p>
                </div>

                {/* View role CTA */}
                <button
                  style={{
                    marginTop: 'auto',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px',
                    padding: '8px 14px',
                    borderRadius: '8px',
                    background: accentLight,
                    color: accent,
                    fontSize: '12px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                    transition: 'background 150ms',
                    width: '100%',
                  }}
                  onMouseEnter={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = '#dde4fb')
                  }
                  onMouseLeave={(e) =>
                    ((e.currentTarget as HTMLElement).style.background = accentLight)
                  }
                >
                  View Role <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>

          {/* Try again link */}
          <div style={{ textAlign: 'center', marginTop: '32px' }}>
            <button
              onClick={handleReset}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '13px',
                color: '#9ca3af',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
            >
              Clear results &amp; start over
            </button>
          </div>
        </div>
      )}

      {/* Empty state after a search with no results */}
      {searched && jobs.length === 0 && (
        <div
          style={{
            padding: '64px 48px',
            maxWidth: '900px',
            margin: '0 auto',
            textAlign: 'center',
          }}
          className="page-pad"
        >
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: accentLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
            }}
          >
            <Briefcase size={24} style={{ color: accent }} />
          </div>
          <p style={{ fontSize: '16px', fontWeight: 600, color: '#0f1729', marginBottom: '8px' }}>
            No matches found
          </p>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
            Try different skills or interests to broaden your search.
          </p>
          <button
            onClick={handleReset}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              background: accent,
              color: '#fff',
              fontSize: '13px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
            }}
          >
            Try Again
          </button>
        </div>
      )}

      {/* Highlights — shown only before a search */}
      {!searched && (
        <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }} className="page-pad">
          <div
            style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
            className="highlights-grid"
          >
            {highlights.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '24px',
                  transition: 'box-shadow 200ms, transform 200ms',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow =
                    '0 8px 24px rgba(0,0,0,0.08)';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                  (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                }}
              >
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: accentLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <Icon size={18} style={{ color: accent }} />
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f1729',
                    marginBottom: '6px',
                  }}
                >
                  {label}
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal */}
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,41,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '24px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '520px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* Modal header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: accentLight,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Briefcase size={15} style={{ color: accent }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>
                    Job Matching
                  </p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                    Find roles that fit your profile
                  </p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '4px',
                  borderRadius: '6px',
                  transition: 'color 150ms',
                }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#374151')}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#9ca3af')}
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px' }}>
              <form
                onSubmit={(e) => {
                  handleSubmit(e).then(() => setOpen(false));
                }}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                {/* Skills */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: '6px',
                    }}
                  >
                    Your Skills{' '}
                    <span style={{ color: '#9ca3af', fontWeight: 400 }}>(comma separated)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={skills}
                    onChange={(e) => setSkills(e.target.value)}
                    placeholder="e.g. React, Node.js, Python, SQL"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '13px',
                      color: '#0f1729',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 150ms',
                      fontFamily: 'inherit',
                      lineHeight: 1.6,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  />
                </div>

                {/* Interests */}
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '12px',
                      fontWeight: 500,
                      color: '#374151',
                      marginBottom: '6px',
                    }}
                  >
                    Your Interests{' '}
                    <span style={{ color: '#9ca3af', fontWeight: 400 }}>(comma separated)</span>
                  </label>
                  <textarea
                    rows={3}
                    value={interests}
                    onChange={(e) => setInterests(e.target.value)}
                    placeholder="e.g. Frontend, Startups, AI, Finance"
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '13px',
                      color: '#0f1729',
                      outline: 'none',
                      resize: 'none',
                      boxSizing: 'border-box',
                      transition: 'border-color 150ms',
                      fontFamily: 'inherit',
                      lineHeight: 1.6,
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = accent)}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  />
                </div>

                {/* Tip */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '8px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: accentLight,
                    border: `1px solid rgba(34,85,236,0.15)`,
                  }}
                >
                  <Sparkles size={13} style={{ color: accent, flexShrink: 0, marginTop: '1px' }} />
                  <p style={{ fontSize: '11px', color: '#374151', lineHeight: 1.6 }}>
                    The more specific you are, the better AI can tailor your job matches.
                  </p>
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '10px',
                    background: loading ? '#93a5f5' : accent,
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => {
                    if (!loading)
                      (e.currentTarget as HTMLElement).style.background = accentHover;
                  }}
                  onMouseLeave={(e) => {
                    if (!loading)
                      (e.currentTarget as HTMLElement).style.background = accent;
                  }}
                >
                  {loading ? (
                    <>
                      <Loader2
                        size={14}
                        style={{ animation: 'spin 1s linear infinite' }}
                      />
                      Finding Matches...
                    </>
                  ) : (
                    <>
                      Find My Job Matches
                      <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
