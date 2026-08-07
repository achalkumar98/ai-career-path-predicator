'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Lock, ArrowLeft, Shield } from 'lucide-react';
import { loginApi, forgotPasswordApi } from '@/api/authApi';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await loginApi(email, password);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      router.push('/homepage');
    } catch (err) {
      const e = err as {
        response?: { data?: { msg?: string; message?: string } };
        message?: string;
      };
      alert('Login failed: ' + (e.response?.data?.msg || e.response?.data?.message || e.message));
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
    } catch (err) {
      const e = err as { response?: { data?: { msg?: string } } };
      alert(e.response?.data?.msg || 'Something went wrong');
    } finally {
      setForgotLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f3f4f6',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
        }}
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
          <ArrowLeft size={14} />
          Back to home
        </Link>
        <Link
          href="/"
          style={{ display: 'flex', alignItems: 'center', gap: '8px', textDecoration: 'none' }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#2255ec',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <span style={{ color: '#fff', fontWeight: 800, fontSize: '14px' }}>A</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '3px' }}>
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>AiCareerNav</span>
          </div>
        </Link>
      </div>

      {/* Card */}
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '24px',
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '420px',
            background: '#fff',
            borderRadius: '16px',
            padding: '40px 36px',
            boxShadow: '0 4px 24px rgba(0,0,0,0.08)',
          }}
        >
          {/* Logo */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: '#2255ec',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span style={{ color: '#fff', fontWeight: 800, fontSize: '20px' }}>N</span>
            </div>
          </div>

          <h1
            style={{
              fontSize: '22px',
              fontWeight: 700,
              color: '#0f1729',
              textAlign: 'center',
              marginBottom: '6px',
            }}
          >
            Welcome back
          </h1>
          <p
            style={{
              fontSize: '13px',
              color: '#6b7280',
              textAlign: 'center',
              marginBottom: '28px',
            }}
          >
            Sign in to your CareerNav account
          </p>

          <form
            onSubmit={handleSubmit}
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            <div>
              <label
                htmlFor="email"
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: 500,
                  color: '#374151',
                  marginBottom: '6px',
                }}
              >
                Email address
              </label>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '6px',
                }}
              >
                <label
                  htmlFor="password"
                  style={{ fontSize: '12px', fontWeight: 500, color: '#374151' }}
                >
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgot(true)}
                  style={{
                    fontSize: '12px',
                    color: '#2255ec',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: 0,
                  }}
                >
                  Forgot password?
                </button>
              </div>
              <div style={{ position: 'relative' }}>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 40px 10px 12px',
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
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#9ca3af',
                    padding: '2px',
                    display: 'flex',
                    alignItems: 'center',
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '11px',
                borderRadius: '10px',
                background: loading ? '#93a5f5' : '#2255ec',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: loading ? 'not-allowed' : 'pointer',
                transition: 'background 150ms',
                marginTop: '4px',
              }}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          {/* Secure note */}
          <div
            style={{
              marginTop: '20px',
              padding: '12px',
              borderRadius: '10px',
              background: '#f3f4f6',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '10px',
            }}
          >
            <Shield size={15} style={{ color: '#2255ec', flexShrink: 0, marginTop: '1px' }} />
            <div>
              <p
                style={{ fontSize: '12px', fontWeight: 600, color: '#0f1729', marginBottom: '2px' }}
              >
                Secure authentication
              </p>
              <p style={{ fontSize: '11px', color: '#6b7280' }}>
                Your data is private and only accessible to you.
              </p>
            </div>
          </div>

          <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: '#6b7280' }}>
            Don&apos;t have an account?{' '}
            <Link
              href="/register"
              style={{ fontWeight: 600, color: '#2255ec', textDecoration: 'none' }}
            >
              Create one
            </Link>
          </p>
        </div>
      </div>

      <p style={{ textAlign: 'center', padding: '16px', fontSize: '11px', color: '#9ca3af' }}>
        By signing in, you agree to our{' '}
        <a href="#" style={{ color: '#2255ec', textDecoration: 'none' }}>
          Terms
        </a>{' '}
        and{' '}
        <a href="#" style={{ color: '#2255ec', textDecoration: 'none' }}>
          Privacy Policy
        </a>
      </p>

      {/* Forgot Password Modal */}
      {showForgot && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,41,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
            padding: '24px',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              padding: '32px',
              width: '100%',
              maxWidth: '400px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            }}
          >
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}
            >
              <div
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '8px',
                  background: 'rgba(34,85,236,0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Lock size={16} style={{ color: '#2255ec' }} />
              </div>
              <h2 style={{ fontSize: '16px', fontWeight: 700, color: '#0f1729' }}>
                Forgot Password
              </h2>
            </div>

            {!forgotSent ? (
              <>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '20px' }}>
                  Enter your email and we&apos;ll send you reset instructions.
                </p>
                <form
                  onSubmit={handleForgot}
                  style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
                >
                  <input
                    type="email"
                    placeholder="you@example.com"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      borderRadius: '8px',
                      border: '1px solid #e5e7eb',
                      fontSize: '13px',
                      outline: 'none',
                      boxSizing: 'border-box',
                    }}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  />
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgot(false);
                        setForgotSent(false);
                        setForgotEmail('');
                      }}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        border: '1px solid #e5e7eb',
                        background: '#fff',
                        fontSize: '13px',
                        cursor: 'pointer',
                        color: '#374151',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={forgotLoading}
                      style={{
                        flex: 1,
                        padding: '10px',
                        borderRadius: '8px',
                        background: '#2255ec',
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      {forgotLoading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '16px 0' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>📧</div>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#374151',
                    marginBottom: '4px',
                    fontWeight: 600,
                  }}
                >
                  Check your email
                </p>
                <p style={{ fontSize: '12px', color: '#6b7280', marginBottom: '20px' }}>
                  Reset instructions sent to <strong>{forgotEmail}</strong>
                </p>
                <button
                  onClick={() => {
                    setShowForgot(false);
                    setForgotSent(false);
                    setForgotEmail('');
                  }}
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
