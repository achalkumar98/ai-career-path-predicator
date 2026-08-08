'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Lock,
  Bell,
  Shield,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Save,
  Loader2,
  CheckCircle,
  ArrowLeft,
} from 'lucide-react';
import { resetPasswordApi } from '@/api/authApi';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function AccountSettings() {
  const { theme, toggleTheme, isDark } = useTheme();

  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [emailNotif, setEmailNotif] = useState(true);

  // Dynamic colours that react to dark mode
  const bg = isDark ? '#141720' : '#f9fafb';
  const cardBg = isDark ? '#1a1f2e' : '#fff';
  const cardBorder = isDark ? '#272d3d' : '#e5e7eb';
  const dividerColor = isDark ? '#272d3d' : '#f3f4f6';
  const titleColor = isDark ? '#f1f5f9' : '#0f1729';
  const labelColor = isDark ? '#cbd5e1' : '#374151';
  const mutedColor = isDark ? '#64748b' : '#9ca3af';
  const descColor = isDark ? '#94a3b8' : '#6b7280';
  const inputBg = isDark ? '#0f1117' : '#fff';
  const inputColor = isDark ? '#e2e8f0' : '#0f1729';
  const inputBorder = isDark ? '#272d3d' : '#e5e7eb';
  const securityBg = isDark ? '#0f1117' : '#f9fafb';

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) {
      toast.error('New passwords do not match');
      return;
    }
    if (newPw.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }
    setSaving(true);
    try {
      await resetPasswordApi(currentPw, newPw);
      setSaved(true);
      setCurrentPw('');
      setNewPw('');
      setConfirmPw('');
      toast.success('Password updated successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const e = err as { response?: { data?: { msg?: string } } };
      toast.error(
        e.response?.data?.msg ||
          'Failed to update password. Make sure your current password is correct.',
      );
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '9px 40px 9px 12px',
    borderRadius: '8px',
    border: `1px solid ${inputBorder}`,
    fontSize: '13px',
    color: inputColor,
    background: inputBg,
    outline: 'none',
    boxSizing: 'border-box' as const,
    transition: 'border-color 150ms',
  };

  /** Reusable toggle switch */
  const Toggle = ({
    on,
    onToggle,
    accentOn = '#2255ec',
  }: {
    on: boolean;
    onToggle: () => void;
    accentOn?: string;
  }) => (
    <button
      type="button"
      onClick={onToggle}
      role="switch"
      aria-checked={on}
      style={{
        width: '44px',
        height: '24px',
        borderRadius: '12px',
        background: on ? accentOn : isDark ? '#374151' : '#e5e7eb',
        border: 'none',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 220ms',
        flexShrink: 0,
      }}
    >
      <span
        style={{
          position: 'absolute',
          top: '4px',
          left: on ? '23px' : '4px',
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: '#fff',
          transition: 'left 220ms',
          boxShadow: '0 1px 3px rgba(0,0,0,0.25)',
        }}
      />
    </button>
  );

  /** Reusable card section header */
  const CardHeader = ({
    icon: Icon,
    label,
    iconBg,
    iconColor,
  }: {
    icon: React.ElementType;
    label: string;
    iconBg: string;
    iconColor: string;
  }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        marginBottom: '20px',
        paddingBottom: '12px',
        borderBottom: `1px solid ${dividerColor}`,
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: iconBg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
        }}
      >
        <Icon size={14} style={{ color: iconColor }} />
      </div>
      <p style={{ fontSize: '13px', fontWeight: 600, color: titleColor }}>{label}</p>
    </div>
  );

  /** Reusable preference row */
  const PrefRow = ({
    label,
    desc,
    on,
    onToggle,
    accentOn,
    last = false,
  }: {
    label: string;
    desc: string;
    on: boolean;
    onToggle: () => void;
    accentOn?: string;
    last?: boolean;
  }) => (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '14px 0',
        borderBottom: last ? 'none' : `1px solid ${dividerColor}`,
      }}
    >
      <div>
        <p style={{ fontSize: '13px', fontWeight: 500, color: titleColor }}>{label}</p>
        <p style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>{desc}</p>
      </div>
      <Toggle on={on} onToggle={onToggle} accentOn={accentOn} />
    </div>
  );

  return (
    <div
      style={{ minHeight: 'calc(100vh - 56px)', background: bg, padding: '40px 48px' }}
      className="page-pad"
    >
      {/* Back bar */}
      <div style={{ marginBottom: '24px' }}>
        <Link
          href="/homepage"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            color: labelColor,
            fontSize: '13px',
          }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: titleColor, marginBottom: '6px' }}>
            <span className="gradient-text">Account Settings</span>
          </h1>
          <p style={{ fontSize: '13px', color: descColor }}>
            Manage your security, appearance, and notification preferences.
          </p>
        </div>

        {/* ── Change Password ──────────────────────────────────── */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <CardHeader icon={Lock} label="Change Password" iconBg={isDark ? '#1e2844' : '#eef2ff'} iconColor="#2255ec" />
          <form
            onSubmit={handlePasswordChange}
            style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
          >
            {[
              {
                label: 'Current Password',
                value: currentPw,
                set: setCurrentPw,
                show: showCurrent,
                toggle: () => setShowCurrent((v) => !v),
              },
              {
                label: 'New Password',
                value: newPw,
                set: setNewPw,
                show: showNew,
                toggle: () => setShowNew((v) => !v),
              },
              {
                label: 'Confirm New Password',
                value: confirmPw,
                set: setConfirmPw,
                show: showNew,
                toggle: () => setShowNew((v) => !v),
              },
            ].map(({ label, value, set, show, toggle }) => (
              <div key={label}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '12px',
                    fontWeight: 500,
                    color: labelColor,
                    marginBottom: '6px',
                  }}
                >
                  {label}
                </label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={show ? 'text' : 'password'}
                    value={value}
                    onChange={(e) => set(e.target.value)}
                    placeholder="••••••••"
                    required
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                    onBlur={(e) => (e.currentTarget.style.borderColor = inputBorder)}
                  />
                  <button
                    type="button"
                    onClick={toggle}
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: mutedColor,
                      display: 'flex',
                      alignItems: 'center',
                    }}
                  >
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}

            <button
              type="submit"
              disabled={saving}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '10px 20px',
                borderRadius: '8px',
                background: saved ? '#059669' : '#2255ec',
                color: '#fff',
                fontSize: '13px',
                fontWeight: 600,
                border: 'none',
                cursor: saving ? 'not-allowed' : 'pointer',
                width: 'fit-content',
                transition: 'background 200ms',
              }}
            >
              {saving ? (
                <>
                  <Loader2 size={13} className="spin" /> Saving…
                </>
              ) : saved ? (
                <>
                  <CheckCircle size={13} /> Updated!
                </>
              ) : (
                <>
                  <Save size={13} /> Update Password
                </>
              )}
            </button>
          </form>
        </div>

        {/* ── Notifications & Appearance ───────────────────────── */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '20px',
          }}
        >
          <CardHeader icon={Bell} label="Notifications & Appearance" iconBg={isDark ? '#1e2844' : '#eef2ff'} iconColor="#2255ec" />

          {/* Email notifications */}
          <PrefRow
            label="Email notifications"
            desc="Receive important updates via email"
            on={emailNotif}
            onToggle={() => setEmailNotif((v) => !v)}
          />

          {/* Dark / Light theme toggle */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '14px 0',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  background: isDark ? '#1e2844' : '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  transition: 'background 300ms',
                }}
              >
                {isDark ? (
                  <Moon size={14} style={{ color: '#818cf8' }} />
                ) : (
                  <Sun size={14} style={{ color: '#d97706' }} />
                )}
              </div>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: titleColor }}>
                  {isDark ? 'Dark Mode' : 'Light Mode'}
                </p>
                <p style={{ fontSize: '12px', color: mutedColor, marginTop: '2px' }}>
                  {isDark
                    ? 'Switch to a light, bright interface'
                    : 'Switch to a dark, easy-on-the-eyes interface'}
                </p>
              </div>
            </div>

            {/* Custom sun/moon toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              role="switch"
              aria-checked={isDark}
              aria-label="Toggle dark mode"
              title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
              style={{
                width: '56px',
                height: '28px',
                borderRadius: '14px',
                background: isDark
                  ? 'linear-gradient(135deg, #1e2844, #2255ec)'
                  : 'linear-gradient(135deg, #fbbf24, #f59e0b)',
                border: 'none',
                cursor: 'pointer',
                position: 'relative',
                transition: 'background 300ms',
                flexShrink: 0,
                boxShadow: isDark
                  ? '0 0 12px rgba(34,85,236,0.35)'
                  : '0 0 12px rgba(251,191,36,0.35)',
              }}
            >
              {/* Track icons */}
              <span
                style={{
                  position: 'absolute',
                  left: '7px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: isDark ? 0 : 1,
                  transition: 'opacity 200ms',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Sun size={11} style={{ color: '#fff' }} />
              </span>
              <span
                style={{
                  position: 'absolute',
                  right: '7px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  opacity: isDark ? 1 : 0,
                  transition: 'opacity 200ms',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <Moon size={11} style={{ color: '#fff' }} />
              </span>
              {/* Thumb */}
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  left: isDark ? '31px' : '4px',
                  width: '20px',
                  height: '20px',
                  borderRadius: '50%',
                  background: '#fff',
                  transition: 'left 260ms cubic-bezier(0.34,1.56,0.64,1)',
                  boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              />
            </button>
          </div>
        </div>

        {/* ── Security ─────────────────────────────────────────── */}
        <div
          style={{
            background: cardBg,
            border: `1px solid ${cardBorder}`,
            borderRadius: '12px',
            padding: '24px',
          }}
        >
          <CardHeader icon={Shield} label="Security" iconBg={isDark ? '#0d2218' : '#f0fdf4'} iconColor="#059669" />
          <div
            style={{
              background: securityBg,
              borderRadius: '8px',
              padding: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              border: `1px solid ${dividerColor}`,
            }}
          >
            <Shield size={14} style={{ color: '#059669', flexShrink: 0 }} />
            <p style={{ fontSize: '12px', color: descColor, lineHeight: 1.6 }}>
              Your account is secured with JWT authentication. Tokens expire after 7 days.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
