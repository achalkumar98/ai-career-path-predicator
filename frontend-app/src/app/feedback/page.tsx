'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Star, Send, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function Feedback() {
  const { isDark } = useTheme();
  const [rating,    setRating]    = useState(0);
  const [hovered,   setHovered]   = useState(0);
  const [category,  setCategory]  = useState('general');
  const [message,   setMessage]   = useState('');
  const [loading,   setLoading]   = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error,     setError]     = useState('');

  const categories = ['general', 'bug', 'feature', 'design', 'performance'];

  // ── colour tokens ──────────────────────────────────────────
  const pageBg      = isDark ? '#141720' : '#f9fafb';
  const cardBg      = isDark ? '#1a1f2e' : '#ffffff';
  const cardBorder  = isDark ? '#272d3d' : '#e5e7eb';
  const divider     = isDark ? '#272d3d' : '#f3f4f6';
  const titleColor  = isDark ? '#f1f5f9' : '#0f1729';
  const labelColor  = isDark ? '#cbd5e1' : '#374151';
  const descColor   = isDark ? '#94a3b8' : '#6b7280';
  const mutedColor  = isDark ? '#64748b' : '#9ca3af';
  const inputBg     = isDark ? '#0f1117' : '#ffffff';
  const inputColor  = isDark ? '#e2e8f0' : '#0f1729';
  const inputBorder = isDark ? '#272d3d' : '#e5e7eb';
  const starEmpty   = isDark ? '#374151' : '#e5e7eb';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { toast.error('Please select a rating'); return; }
    setLoading(true);
    setError('');
    try {
      const stored = localStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : {};
      await api.post('/feedback', { name: user.name || 'Anonymous', email: user.email || '', rating, category, message });
      setSubmitted(true);
      toast.success('Feedback submitted — thank you!');
    } catch {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted)
    return (
      <div style={{ minHeight: 'calc(100vh - 56px)', background: pageBg, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 300ms' }}>
        <div style={{ textAlign: 'center', padding: '48px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isDark ? '#0d2218' : '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <CheckCircle size={28} style={{ color: '#059669' }} />
          </div>
          <h2 style={{ fontSize: '22px', fontWeight: 700, color: titleColor, marginBottom: '8px' }}>Thank you!</h2>
          <p style={{ fontSize: '14px', color: descColor, marginBottom: '24px' }}>Your feedback helps us improve CareerNav for everyone.</p>
          <button
            onClick={() => { setSubmitted(false); setRating(0); setMessage(''); setCategory('general'); setError(''); }}
            style={{ padding: '10px 24px', borderRadius: '8px', background: '#2255ec', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}
          >
            Submit Another
          </button>
        </div>
      </div>
    );

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: pageBg, padding: '40px 48px', transition: 'background 300ms' }} className="page-pad">

      {/* Back */}
      <div style={{ marginBottom: '24px' }}>
        <Link href="/homepage" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: labelColor, fontSize: '13px' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>

        {/* Heading */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: titleColor, marginBottom: '6px' }}>
            <span className="gradient-text">My Feedback</span>
          </h1>
          <p style={{ fontSize: '13px', color: descColor }}>Share your thoughts to help us improve CareerNav.</p>
        </div>

        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '28px', transition: 'background 300ms, border-color 300ms' }}>

          {/* Card header */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: `1px solid ${divider}` }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isDark ? '#1e2844' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={16} style={{ color: '#2255ec' }} />
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: titleColor }}>Share Your Experience</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

            {/* Rating */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: labelColor, marginBottom: '10px' }}>Overall Rating</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setRating(n)} onMouseEnter={() => setHovered(n)} onMouseLeave={() => setHovered(0)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}>
                    <Star size={28} style={{ color: n <= (hovered || rating) ? '#f59e0b' : starEmpty, fill: n <= (hovered || rating) ? '#f59e0b' : 'none', transition: 'color 100ms' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: labelColor, marginBottom: '8px' }}>Category</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map((c) => (
                  <button
                    key={c} type="button" onClick={() => setCategory(c)}
                    style={{
                      padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500, cursor: 'pointer',
                      border: `1px solid ${category === c ? '#2255ec' : cardBorder}`,
                      background: category === c ? (isDark ? '#1e2844' : '#eef2ff') : (isDark ? '#0f1117' : '#ffffff'),
                      color: category === c ? '#2255ec' : labelColor,
                      transition: 'all 150ms', textTransform: 'capitalize',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: labelColor, marginBottom: '6px' }}>Your Feedback</label>
              <textarea
                rows={5} value={message} onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us what you think — what's working well, what could be better…"
                required
                style={{
                  width: '100%', padding: '10px 12px', borderRadius: '8px',
                  border: `1px solid ${inputBorder}`, fontSize: '13px',
                  color: inputColor, background: inputBg,
                  outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit',
                  transition: 'border-color 150ms',
                }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                onBlur={(e)  => (e.currentTarget.style.borderColor = inputBorder)}
              />
            </div>

            {error && (
              <p style={{ fontSize: '12px', color: '#dc2626', background: isDark ? '#2d1515' : '#fef2f2', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}` }}>
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              style={{
                display: 'flex', alignItems: 'center', gap: '8px',
                padding: '11px 24px', borderRadius: '10px',
                background: '#2255ec', color: '#fff',
                fontSize: '13px', fontWeight: 600, border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer', width: 'fit-content',
              }}
            >
              {loading ? <><Loader2 size={14} className="spin" /> Submitting…</> : <><Send size={13} /> Submit Feedback</>}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
