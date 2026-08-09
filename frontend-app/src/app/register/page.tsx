'use client';
import Image from 'next/image';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, ArrowLeft, Shield } from 'lucide-react';
import { registerApi } from '@/api/authApi';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function Register() {
  const { isDark } = useTheme();
  const [name, setName]         = useState('');
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  // ── colour tokens ──────────────────────────────────────────
  const pageBg      = isDark ? '#0f1117' : '#f3f4f6';
  const cardBg      = isDark ? '#1a1f2e' : '#ffffff';
  const cardBorder  = isDark ? '#272d3d' : 'transparent';
  const titleColor  = isDark ? '#f1f5f9' : '#0f1729';
  const bodyColor   = isDark ? '#cbd5e1' : '#374151';
  const mutedColor  = isDark ? '#64748b' : '#6b7280';
  const inputBg     = isDark ? '#0f1117' : '#ffffff';
  const inputColor  = isDark ? '#e2e8f0' : '#0f1729';
  const inputBorder = isDark ? '#272d3d' : '#e5e7eb';
  const secNoteBg   = isDark ? '#0f1117' : '#f3f4f6';
  const divider     = isDark ? '#272d3d' : '#e5e7eb';
  const navColor    = isDark ? '#94a3b8' : '#374151';
  const brandColor  = isDark ? '#f1f5f9' : '#0f1729';

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: '8px',
    border: `1px solid ${inputBorder}`, fontSize: '13px',
    color: inputColor, background: inputBg,
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms',
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await registerApi(name, email, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Account created! Welcome to AiCareerNav.');
      router.push('/homepage');
    } catch (err) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      toast.error('Registration failed: ' + (e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: pageBg, display: 'flex', flexDirection: 'column', transition: 'background 300ms' }}>

      {/* ── Top bar ── */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: navColor, fontSize: '13px' }}>
          <ArrowLeft size={14} /> Back to home
        </Link>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}>
          <Image src="/assets/aicareernav-logo.png" alt="AiCareerNav" width={32} height={32} style={{ borderRadius: '8px', objectFit: 'contain' }} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: brandColor }}>AiCareerNav</span>
        </Link>
      </div>

      {/* ── Card ── */}
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: cardBg, borderRadius: '16px', padding: '40px 36px', boxShadow: isDark ? '0 4px 24px rgba(0,0,0,0.4)' : '0 4px 24px rgba(0,0,0,0.08)', border: `1px solid ${cardBorder}`, transition: 'background 300ms' }}>

          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: '#2255ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '20px' }}>N</span>
            </div>
          </div>

          <h1 style={{ fontSize: '22px', fontWeight: 700, color: titleColor, textAlign: 'center', marginBottom: '6px' }}>Create your account</h1>
          <p style={{ fontSize: '13px', color: mutedColor, textAlign: 'center', marginBottom: '28px' }}>Start your AI-powered career journey today</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {[
              { id: 'name',     label: 'Full name',      type: 'text',     placeholder: 'John Doe',          value: name,     set: setName },
              { id: 'email',    label: 'Email address',  type: 'email',    placeholder: 'you@example.com',   value: email,    set: setEmail },
            ].map((f) => (
              <div key={f.id}>
                <label htmlFor={f.id} style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: bodyColor, marginBottom: '6px' }}>{f.label}</label>
                <input id={f.id} type={f.type} placeholder={f.placeholder} value={f.value} onChange={(e) => f.set(e.target.value)} required style={inputStyle}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = inputBorder)} />
              </div>
            ))}

            <div>
              <label htmlFor="password" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: bodyColor, marginBottom: '6px' }}>Password</label>
              <div style={{ position: 'relative' }}>
                <input id="password" type={showPassword ? 'text' : 'password'} placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required
                  style={{ ...inputStyle, padding: '10px 40px 10px 12px' }}
                  onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                  onBlur={(e)  => (e.currentTarget.style.borderColor = inputBorder)} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: mutedColor, padding: '2px', display: 'flex', alignItems: 'center' }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" disabled={loading}
              style={{ width: '100%', padding: '11px', borderRadius: '10px', background: loading ? '#93a5f5' : '#2255ec', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', transition: 'background 150ms', marginTop: '4px' }}>
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          {/* Secure note */}
          <div style={{ marginTop: '20px', padding: '12px', borderRadius: '10px', background: secNoteBg, border: `1px solid ${divider}`, display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Shield size={15} style={{ color: '#2255ec', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: titleColor, marginBottom: '2px' }}>Secure &amp; private</p>
              <p style={{ fontSize: '11px', color: mutedColor }}>Your data is encrypted and only accessible to you.</p>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: mutedColor }}>
            Already have an account?{' '}
            <Link href="/login" style={{ fontWeight: 600, color: '#2255ec', textDecoration: 'none' }}>Sign in</Link>
          </p>
        </div>
      </div>

      <p style={{ textAlign: 'center', padding: '16px', fontSize: '11px', color: mutedColor }}>
        By creating an account, you agree to our{' '}
        <a href="#" style={{ color: '#2255ec', textDecoration: 'none' }}>Terms</a>{' '}and{' '}
        <a href="#" style={{ color: '#2255ec', textDecoration: 'none' }}>Privacy Policy</a>
      </p>
    </div>
  );
}
