'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await api.post('/contact', form);
      setSent(true);
      setForm({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      const e = err as { response?: { data?: { errors?: { msg: string }[]; msg?: string } } };
      setError(e.response?.data?.errors?.[0]?.msg || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const info = [
    { icon: Mail, label: 'Email us', value: 'support@careernav.ai' },
    { icon: MapPin, label: 'Location', value: 'Remote — Worldwide' },
    { icon: Clock, label: 'Response time', value: 'Within 24 hours' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f9fafb', fontFamily: 'Inter, sans-serif' }}>
      {/* Top bar */}
      <div
        style={{
          background: '#fff',
          borderBottom: '1px solid #e5e7eb',
          padding: '14px 48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        className="topbar-pad"
      >
        <Link
          href="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            color: '#374151',
            fontSize: '13px',
          }}
        >
          <ArrowLeft size={14} /> Back to home
        </Link>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
        >
          <div
            style={{
              width: '30px',
              height: '30px',
              borderRadius: '8px',
              background: '#2255ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '13px' }}>A</span>
          </div>
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>AiCareerNav</span>
        </Link>
      </div>

      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(160deg,#f0f4ff 0%,#f9fafb 60%)',
          padding: '64px 48px 48px',
          textAlign: 'center',
          borderBottom: '1px solid #e5e7eb',
        }}
        className="hero-pad"
      >
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
            marginBottom: '20px',
          }}
        >
          ✦ We&apos;re here to help
        </div>
        <h1
          style={{ fontSize: '42px', fontWeight: 800, color: '#0f1729', marginBottom: '12px' }}
          className="hero-title"
        >
          Get in <span style={{ color: '#2255ec' }}>Touch</span>
        </h1>
        <p
          style={{
            fontSize: '15px',
            color: '#6b7280',
            maxWidth: '480px',
            margin: '0 auto',
            lineHeight: 1.7,
          }}
        >
          Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      {/* Content */}
      <div
        style={{
          maxWidth: '1000px',
          margin: '0 auto',
          padding: '56px 48px',
          display: 'grid',
          gridTemplateColumns: '1fr 1.6fr',
          gap: '48px',
          alignItems: 'start',
        }}
        className="contact-grid page-pad"
      >
        {/* Left — info */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1729', marginBottom: '8px' }}>
            Contact Information
          </h2>
          <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '32px', lineHeight: 1.7 }}>
            Reach out through the form or use the details below. Our team responds within 24 hours.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: 'rgba(34,85,236,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Icon size={17} style={{ color: '#2255ec' }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                      marginBottom: '2px',
                    }}
                  >
                    {label}
                  </p>
                  <p style={{ fontSize: '13px', color: '#0f1729', fontWeight: 500 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form */}
        <div
          style={{
            background: '#fff',
            borderRadius: '16px',
            padding: '36px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
            border: '1px solid #e5e7eb',
          }}
        >
          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <CheckCircle size={48} style={{ color: '#059669', margin: '0 auto 16px' }} />
              <h3
                style={{ fontSize: '18px', fontWeight: 700, color: '#0f1729', marginBottom: '8px' }}
              >
                Message sent!
              </h3>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>
                Thanks for reaching out. We&apos;ll get back to you within 24 hours.
              </p>
              <button
                onClick={() => setSent(false)}
                style={{
                  padding: '10px 24px',
                  borderRadius: '8px',
                  background: '#2255ec',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                }}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
            >
              <h3
                style={{ fontSize: '16px', fontWeight: 700, color: '#0f1729', marginBottom: '4px' }}
              >
                Send us a message
              </h3>

              <div
                style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}
                className="form-row"
              >
                {[
                  {
                    id: 'name',
                    label: 'Full name',
                    type: 'text',
                    placeholder: 'John Doe',
                    val: form.name,
                    key: 'name',
                  },
                  {
                    id: 'email',
                    label: 'Email address',
                    type: 'email',
                    placeholder: 'you@example.com',
                    val: form.email,
                    key: 'email',
                  },
                ].map((f) => (
                  <div key={f.id}>
                    <label
                      htmlFor={f.id}
                      style={{
                        display: 'block',
                        fontSize: '12px',
                        fontWeight: 500,
                        color: '#374151',
                        marginBottom: '6px',
                      }}
                    >
                      {f.label}
                    </label>
                    <input
                      id={f.id}
                      type={f.type}
                      placeholder={f.placeholder}
                      value={f.val}
                      onChange={(e) => set(f.key, e.target.value)}
                      required
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        fontSize: '13px',
                        color: '#0f1729',
                        outline: 'none',
                        boxSizing: 'border-box',
                        transition: 'border-color 150ms',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                    />
                  </div>
                ))}
              </div>

              <div>
                <label
                  htmlFor="subject"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  Subject
                </label>
                <input
                  id="subject"
                  type="text"
                  placeholder="How can we help?"
                  value={form.subject}
                  onChange={(e) => set('subject', e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '13px',
                    color: '#0f1729',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 150ms',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>

              <div>
                <label
                  htmlFor="message"
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: '#374151',
                    marginBottom: '6px',
                  }}
                >
                  Message
                </label>
                <textarea
                  id="message"
                  placeholder="Tell us more about your question or feedback..."
                  value={form.message}
                  onChange={(e) => set('message', e.target.value)}
                  required
                  rows={5}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #e5e7eb',
                    fontSize: '13px',
                    color: '#0f1729',
                    outline: 'none',
                    boxSizing: 'border-box',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                    transition: 'border-color 150ms',
                  }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                  onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                />
              </div>

              {error && (
                <p
                  style={{
                    fontSize: '12px',
                    color: '#dc2626',
                    background: '#fef2f2',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    border: '1px solid #fecaca',
                  }}
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  width: '100%',
                  padding: '12px',
                  borderRadius: '10px',
                  background: loading ? '#93a5f5' : '#2255ec',
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'background 150ms',
                }}
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send size={14} /> Send Message
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
