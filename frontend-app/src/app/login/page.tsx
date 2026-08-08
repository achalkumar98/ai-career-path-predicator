'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, ArrowLeft, Shield } from 'lucide-react';
import { loginApi, forgotPasswordApi } from '@/api/authApi';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function Login() {
  const { isDark } = useTheme();
  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading]       = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
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
  const secNoteBg   = isDark ? '#0f1117'  : '#f3f4f6';
  const navColor    = isDark ? '#94a3b8' : '#374151';
  const brandColor  = isDark ? '#f1f5f9' : '#0f1729';
  const divider     = isDark ? '#272d3d' : '#e5e7eb';

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
      const res = await loginApi(email, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      toast.success('Welcome back! Signing you in...');
      router.push('/homepage');
    } catch (err) {
      const e = err as { response?: { data?: { msg?: string; message?: string } }; message?: string };
      toast.error('Login failed: ' + (e.response?.data?.msg || e.response?.data?.message || e.message));
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotLoading(true);
    try {
      await forgotPasswordApi(forgotEmail);
      setForgotSent(true);
      toast.success('Reset link sent! Check your inbox.');
    } catch (err) {
      const e = err as { response?: { data?: { msg?: string } } };
      toast.error(e.response?.data?.msg || 'Something went wrong');
    } finally {
      setForgotLoading(false);
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
          <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#2255ec', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px' }}>A</span>
          </div>
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

          <h1 style={{ fontSize: '22px', fontWeight: 700, color: titleColor, textAlign: 'center', marginBottom: '6px' }}>Welcome back</h1>
          <p style={{ fontSize: '13px', color: mutedColor, textAlign: 'center', marginBottom: '28px' }}>Sign in to your CareerNav account</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="email" style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: bodyColor, marginBottom: '6px' }}>Email address</label>
              <input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required style={inputStyle}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                onBlur={(e)  => (e.currentTarget.style.borderColor = inputBorder)} />
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label htmlFor="password" style={{ fontSize: '12px', fontWeight: 500, color: bodyColor }}>Password</label>
                <button type="button" onClick={() => setShowForgot(true)} style={{ fontSize: '12px', color: '#2255ec', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Forgot password?</button>
              </div>
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
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Secure note */}
          <div style={{ marginTop: '20px', padding: '12px', borderRadius: '10px', background: secNoteBg, border: `1px solid ${divider}`, display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
            <Shield size={15} style={{ color: '#2255ec', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p style={{ fontSize: '12px', fontWeight: 600, color: titleColor, marginBottom: '2px' }}>Secure authentication</p>
              <p style={{ fontSize: '11px', color: mutedColor }}>Your data is private and only accessible to you.</p>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: mutedColor }}>
            Don&apos;t have an account?{' '}
            <Link href="/register" style={{ fontWeight: 600, color: '#2255ec', textDecoration: 'none' }}>Create one</Link>
          </p>
        </div>
      </div>

      <p style={{ textAlign: 'center', padding: '16px', fontSize: '11px', color: mutedColor }}>
        By signing in, you agree to our{' '}
        <a href="#" style={{ color: '#2255ec', textDecoration: 'none' }}>Terms</a>{' '}and{' '}
        <a href="#" style={{ color: '#2255ec', textDecoration: 'none' }}>Privacy Policy</a>
      </p>

      {/* ── Forgot Password Modal ── */}
      {showForgot && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,41,0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: '24px' }}
          onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}>
          <div style={{ background: cardBg, borderRadius: '16px', padding: '32px', width: '100%', maxWidth: '400px', boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.15)', border: `1px solid ${cardBorder}` }}
            onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
              <div style={{ width: '36px', height: '36px', borderRadius: '8px', background: isDark ? '#1e2844' : 'rgba(34,85,236,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={16} style={{ color: '#2255ec' }} />
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: titleColor }}>Forgot Password</h2>
            </div>

            {!forgotSent ? (
              <>
                <p style={{ fontSize: '12px', color: mutedColor, marginBottom: '20px' }}>Enter your email and we&apos;ll send you reset instructions.</p>
                <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <input type="email" placeholder="you@example.com" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} required
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = inputBorder)} />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button type="button" onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', border: `1px solid ${divider}`, background: isDark ? '#0f1117' : '#fff', fontSize: '13px', cursor: 'pointer', color: bodyColor }}>
                      Cancel
                    </button>
                    <button type="submit" disabled={forgotLoading}
                      style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#2255ec', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                      {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📧</div>
                <p style={{ fontSize: '13px', color: titleColor, marginBottom: '4px', fontWeight: 600 }}>Check your email</p>
                <p style={{ fontSize: '12px', color: mutedColor, marginBottom: '20px' }}>
                  Reset instructions sent to <strong style={{ color: titleColor }}>{forgotEmail}</strong>
                </p>
                <button onClick={() => { setShowForgot(false); setForgotSent(false); setForgotEmail(''); }}
                  style={{ padding: '10px 24px', borderRadius: '8px', background: '#2255ec', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
