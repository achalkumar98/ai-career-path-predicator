'use client';
import Image from 'next/image';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react';
import api from '@/lib/axios';
import { useTheme } from '@/context/ThemeContext';

export default function ContactPage() {
  const { isDark } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [loading, setLoading]   = useState(false);
  const [sent, setSent]         = useState(false);
  const [error, setError]       = useState('');

  const set = (k: string, v: string) => setForm((f) => ({ ...f, [k]: v }));

  // ── colour tokens ──────────────────────────────────────────
  const pageBg      = isDark ? '#0f1117' : '#f9fafb';
  const topbarBg    = isDark ? '#0f1117' : '#ffffff';
  const topbarBdr   = isDark ? '#272d3d' : '#e5e7eb';
  const heroBg      = isDark ? 'linear-gradient(160deg,#111827 0%,#141720 60%)' : 'linear-gradient(160deg,#f0f4ff 0%,#f9fafb 60%)';
  const cardBg      = isDark ? '#1a1f2e' : '#ffffff';
  const cardBorder  = isDark ? '#272d3d' : '#e5e7eb';
  const divider     = isDark ? '#272d3d' : '#f3f4f6';
  const titleColor  = isDark ? '#f1f5f9' : '#0f1729';
  const bodyColor   = isDark ? '#cbd5e1' : '#374151';
  const mutedColor  = isDark ? '#64748b' : '#9ca3af';
  const descColor   = isDark ? '#94a3b8' : '#6b7280';
  const inputBg     = isDark ? '#0f1117' : '#ffffff';
  const inputColor  = isDark ? '#e2e8f0' : '#0f1729';
  const inputBorder = isDark ? '#272d3d' : '#e5e7eb';
  const brandColor  = isDark ? '#f1f5f9' : '#0f1729';
  const navColor    = isDark ? '#94a3b8' : '#374151';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: `1px solid ${inputBorder}`, fontSize: '13px',
    color: inputColor, background: inputBg,
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms',
  };

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
    { icon: Mail,  label: 'Email us',      value: 'support@careernav.ai' },
    { icon: MapPin, label: 'Location',     value: 'Remote — Worldwide' },
    { icon: Clock, label: 'Response time', value: 'Within 24 hours' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: pageBg, fontFamily: 'Inter, sans-serif', transition: 'background 300ms' }}>

      {/* ── Top bar ── */}
      <div style={{ background: topbarBg, borderBottom: `1px solid ${topbarBdr}`, padding: '14px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 300ms' }} className="topbar-pad">
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: navColor, fontSize: '13px' }}>
          <ArrowLeft size={14} /> Back to home
        </Link>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Image src="/assets/aicareernav-logo.png" alt="AiCareerNav" width={30} height={30} style={{ borderRadius: '8px', objectFit: 'contain' }} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: brandColor }}>AiCareerNav</span>
        </Link>
      </div>

      {/* ── Hero ── */}
      <div style={{ background: heroBg, padding: '64px 48px 48px', textAlign: 'center', borderBottom: `1px solid ${topbarBdr}` }} className="hero-pad">
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(34,85,236,0.07)', border: '1px solid rgba(34,85,236,0.18)', fontSize: '12px', fontWeight: 600, color: '#2255ec', marginBottom: '20px' }}>
          ✦ We&apos;re here to help
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 800, color: titleColor, marginBottom: '12px' }} className="hero-title">
          Get in <span style={{ color: '#2255ec' }}>Touch</span>
        </h1>
        <p style={{ fontSize: '15px', color: descColor, maxWidth: '480px', margin: '0 auto', lineHeight: 1.7 }}>
          Have a question, feedback, or just want to say hello? We&apos;d love to hear from you.
        </p>
      </div>

      {/* ── Content grid ── */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '56px 48px', display: 'grid', gridTemplateColumns: '1fr 1.6fr', gap: '48px', alignItems: 'start' }} className="contact-grid page-pad">

        {/* Left — info */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: 700, color: titleColor, marginBottom: '8px' }}>Contact Information</h2>
          <p style={{ fontSize: '13px', color: descColor, marginBottom: '32px', lineHeight: 1.7 }}>
            Reach out through the form or use the details below. Our team responds within 24 hours.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {info.map(({ icon: Icon, label, value }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: isDark ? '#1e2844' : 'rgba(34,85,236,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Icon size={17} style={{ color: '#2255ec' }} />
                </div>
                <div>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: mutedColor, textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '2px' }}>{label}</p>
                  <p style={{ fontSize: '13px', color: titleColor, fontWeight: 500 }}>{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — form card */}
        <div style={{ background: cardBg, borderRadius: '16px', padding: '36px', boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.06)', border: `1px solid ${cardBorder}`, transition: 'background 300ms' }}>
          {sent ? (
            <div style={{ textAlign: 'center', padding: '32px 0' }}>
              <CheckCircle size={48} style={{ color: '#059669', margin: '0 auto 16px', display: 'block' }} />
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: titleColor, marginBottom: '8px' }}>Message sent!</h3>
              <p style={{ fontSize: '13px', color: descColor, marginBottom: '24px' }}>Thanks for reaching out. We&apos;ll get back to you within 24 hours.</p>
              <button onClick={() => setSent(false)} style={{ padding: '10px 24px', borderRadius: '8px', background: '#2255ec', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 700, color: titleColor, marginBottom: '4px' }}>Send us a message</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }} className="form-row">
                {[
                  { id: 'name',  label: 'Full name',     type: 'text',  placeholder: 'John Doe',        val: form.name,  key: 'name' },
                  { id: 'email', label: 'Email address', type: 'email', placeholder: 'you@example.com', val: form.email, key: 'email' },
                ].map((f) => (
                  <div key={f.id}>
                    <label htmlFor={f.id} style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: bodyColor, marginBottom: '6px' }}>{f.label}</label>
                    <input id={f.id} type={f.type} placeholder={f.placeholder} value={f.val} onChange={(e) => set(f.key, e.target.value)} required style={inputStyle}
                      onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                      onBlur={(e)  => (e.currentTarget.style.borderColor = inputBorder)} />
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="subject" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: bodyColor, marginBottom: '6px' }}>Subject</label>
                <input id="subject" type="text" placeholder="How can we help?" value={form.subject} onChange={(e) => set('subject', e.target.value)} required style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = inputBorder)} />
              </div>

              <div>
                <label htmlFor="message" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: bodyColor, marginBottom: '6px' }}>Message</label>
                <textarea id="message" placeholder="Tell us more about your question or feedback..." value={form.message} onChange={(e) => set('message', e.target.value)} required rows={5}
                  style={{ ...inputStyle, resize: 'vertical', fontFamily: 'inherit' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = inputBorder)} />
              </div>

              {error && (
                <p style={{ fontSize: '12px', color: '#dc2626', background: isDark ? '#2d1515' : '#fef2f2', padding: '10px 12px', borderRadius: '8px', border: `1px solid ${isDark ? '#7f1d1d' : '#fecaca'}` }}>
                  {error}
                </p>
              )}

              <button type="submit" disabled={loading}
                style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', width: '100%', padding: '12px', borderRadius: '10px', background: loading ? '#93a5f5' : '#2255ec', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 150ms' }}>
                {loading ? 'Sending...' : <><Send size={14} /> Send Message</>}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
