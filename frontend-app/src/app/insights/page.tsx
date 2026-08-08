'use client';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import Link from 'next/link';
import { Sparkles, Brain, LineChart, X, Loader2, ArrowLeft } from 'lucide-react';
import { getInsightsApi } from '@/api/insightsApi';
import toast from 'react-hot-toast';

export default function Insights() {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setLoading(true);
    try {
      const res = await getInsightsApi(userInput);
      setResult(res.data.insight || res.data);
    } catch {
      toast.error('Error fetching insights. Is your backend running?');
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    {
      icon: Brain,
      label: 'Personality Analysis',
      desc: 'Understand your work style and strengths',
    },
    { icon: LineChart, label: 'Market Trends', desc: 'Stay ahead of industry shifts' },
    { icon: Sparkles, label: 'AI Insights', desc: 'Personalized career intelligence' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: isDark ? '#141720' : '#f9fafb', transition: 'background 300ms' }}>
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
          background: 'linear-gradient(135deg, #fffbeb 0%, #f9fafb 60%)',
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
            background: 'rgba(245,158,11,0.08)',
            border: '1px solid rgba(245,158,11,0.2)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#d97706',
            marginBottom: '24px',
          }}
        >
          <Sparkles size={13} />
          AI Insights
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
          Personality &<br />
          <span style={{ color: '#d97706' }}>Trends</span>
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#6b7280',
            maxWidth: '520px',
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}
        >
          Describe yourself and get AI-powered personality analysis, career trend insights, and
          tailored recommendations based on who you are.
        </p>
        <button
          onClick={() => {
            setOpen(true);
            setResult(null);
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 28px',
            borderRadius: '10px',
            background: '#d97706',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(217,119,6,0.3)',
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#b45309')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#d97706')}
        >
          Get My AI Insight
          <Sparkles size={15} />
        </button>
      </div>

      {/* Highlights */}
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
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
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
                  background: '#fffbeb',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <Icon size={18} style={{ color: '#d97706' }} />
              </div>
              <p
                style={{ fontSize: '14px', fontWeight: 600, color: '#0f1729', marginBottom: '6px' }}
              >
                {label}
              </p>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

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
                    background: '#fffbeb',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={15} style={{ color: '#d97706' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>
                    Personality & Trends
                  </p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>AI-powered career insight</p>
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
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '24px' }}>
              {!result ? (
                <form
                  onSubmit={handleSubmit}
                  style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
                >
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
                      Tell us about yourself — your goals, values, and personality:
                    </label>
                    <textarea
                      rows={5}
                      value={userInput}
                      onChange={(e) => setUserInput(e.target.value)}
                      placeholder="e.g., I enjoy helping others, love solving logical problems, and prefer remote work..."
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
                        fontFamily: 'inherit',
                        transition: 'border-color 150ms',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#d97706')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={loading}
                    style={{
                      width: '100%',
                      padding: '11px',
                      borderRadius: '10px',
                      background: loading ? '#fbbf24' : '#d97706',
                      color: '#fff',
                      fontSize: '13px',
                      fontWeight: 600,
                      border: 'none',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                    }}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />{' '}
                        Analyzing...
                      </>
                    ) : (
                      'Get My AI Insight →'
                    )}
                  </button>
                </form>
              ) : (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '16px',
                    }}
                  >
                    <Sparkles size={15} style={{ color: '#d97706' }} />
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1729' }}>
                      Your AI Career Insight
                    </p>
                  </div>
                  <div
                    style={{
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: '10px',
                      padding: '16px',
                      fontSize: '13px',
                      color: '#374151',
                      lineHeight: 1.7,
                      maxHeight: '300px',
                      overflowY: 'auto',
                    }}
                  >
                    {result}
                  </div>
                  <button
                    onClick={() => {
                      setResult(null);
                      setUserInput('');
                    }}
                    style={{
                      marginTop: '16px',
                      width: '100%',
                      padding: '10px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      background: '#fff',
                      fontSize: '13px',
                      cursor: 'pointer',
                      color: '#374151',
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
