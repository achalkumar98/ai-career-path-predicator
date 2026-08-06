'use client';
import { useState } from 'react';
import Link from 'next/link';
import { MessageCircle, Star, Send, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import api from '@/lib/axios';

export default function Feedback() {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const categories = ['general', 'bug', 'feature', 'design', 'performance'];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rating) { alert('Please select a rating'); return; }
    setLoading(true);
    setError('');
    try {
      const stored = localStorage.getItem('user');
      const user = stored ? JSON.parse(stored) : {};
      await api.post('/feedback', { name: user.name || 'Anonymous', email: user.email || '', rating, category, message });
      setSubmitted(true);
    } catch {
      setError('Failed to submit feedback. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ textAlign: 'center', padding: '48px' }}>
        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <CheckCircle size={28} style={{ color: '#059669' }} />
        </div>
        <h2 style={{ fontSize: '22px', fontWeight: 700, color: '#0f1729', marginBottom: '8px' }}>Thank you!</h2>
        <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '24px' }}>Your feedback helps us improve CareerNav for everyone.</p>
        <button onClick={() => { setSubmitted(false); setRating(0); setMessage(''); setCategory('general'); setError(''); }} style={{ padding: '10px 24px', borderRadius: '8px', background: '#2255ec', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
          Submit Another
        </button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb', padding: '40px 48px' }} className="page-pad">
      {/* Back bar */}
      <div style={{ maxWidth: '560px', margin: '0 auto 24px' }}>
        <Link href="/homepage" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#374151', fontSize: '13px' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>
      <div style={{ maxWidth: '560px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f1729', marginBottom: '6px' }}>My Feedback</h1>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Share your thoughts to help us improve CareerNav.</p>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '28px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <MessageCircle size={16} style={{ color: '#2255ec' }} />
            </div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f1729' }}>Share Your Experience</p>
          </div>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Rating */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '10px' }}>Overall Rating</label>
              <div style={{ display: 'flex', gap: '6px' }}>
                {[1, 2, 3, 4, 5].map(n => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    onMouseEnter={() => setHovered(n)}
                    onMouseLeave={() => setHovered(0)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '2px' }}
                  >
                    <Star size={28} style={{ color: n <= (hovered || rating) ? '#f59e0b' : '#e5e7eb', fill: n <= (hovered || rating) ? '#f59e0b' : 'none', transition: 'color 100ms' }} />
                  </button>
                ))}
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '8px' }}>Category</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {categories.map(c => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    style={{
                      padding: '6px 14px', borderRadius: '9999px', fontSize: '12px', fontWeight: 500,
                      border: `1px solid ${category === c ? '#2255ec' : '#e5e7eb'}`,
                      background: category === c ? '#eef2ff' : '#fff',
                      color: category === c ? '#2255ec' : '#374151',
                      cursor: 'pointer', transition: 'all 150ms', textTransform: 'capitalize',
                    }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div>
              <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>Your Feedback</label>
              <textarea
                rows={5}
                value={message}
                onChange={e => setMessage(e.target.value)}
                placeholder="Tell us what you think — what's working well, what could be better..."
                required
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#0f1729', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 150ms' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#2255ec')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
            </div>

            {error && <p style={{ fontSize: '12px', color: '#dc2626', background: '#fef2f2', padding: '10px 12px', borderRadius: '8px', border: '1px solid #fecaca' }}>{error}</p>}

            <button
              style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 24px', borderRadius: '10px', background: '#2255ec', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', width: 'fit-content' }}
            >
              {loading ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</> : <><Send size={13} /> Submit Feedback</>}
            </button>
          </form>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
