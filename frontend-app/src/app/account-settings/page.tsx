'use client';
import { useState } from 'react';
import { Lock, Bell, Shield, Eye, EyeOff, Save, Loader2, CheckCircle } from 'lucide-react';
import { resetPasswordApi } from '@/api/authApi';

export default function AccountSettings() {
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState({ email: true, updates: true, tips: false });

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPw !== confirmPw) { alert('New passwords do not match'); return; }
    if (newPw.length < 6) { alert('Password must be at least 6 characters'); return; }
    setSaving(true);
    try {
      // Uses current password as token for demo — in production use a proper flow
      await resetPasswordApi(currentPw, newPw);
      setSaved(true);
      setCurrentPw(''); setNewPw(''); setConfirmPw('');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const e = err as { response?: { data?: { msg?: string } } };
      alert(e.response?.data?.msg || 'Failed to update password. Make sure your current password is correct.');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '9px 40px 9px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#0f1729', outline: 'none', boxSizing: 'border-box' as const, transition: 'border-color 150ms' };

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb', padding: '40px 48px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f1729', marginBottom: '6px' }}>Account Settings</h1>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Manage your security and notification preferences.</p>
        </div>

        {/* Password */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Lock size={14} style={{ color: '#2255ec' }} />
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1729' }}>Change Password</p>
          </div>
          <form onSubmit={handlePasswordChange} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {[
              { label: 'Current Password', value: currentPw, set: setCurrentPw, show: showCurrent, toggle: () => setShowCurrent(!showCurrent) },
              { label: 'New Password', value: newPw, set: setNewPw, show: showNew, toggle: () => setShowNew(!showNew) },
              { label: 'Confirm New Password', value: confirmPw, set: setConfirmPw, show: showNew, toggle: () => setShowNew(!showNew) },
            ].map(({ label, value, set, show, toggle }) => (
              <div key={label}>
                <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>{label}</label>
                <div style={{ position: 'relative' }}>
                  <input type={show ? 'text' : 'password'} value={value} onChange={e => set(e.target.value)} placeholder="••••••••" required style={inputStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = '#2255ec')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')} />
                  <button type="button" onClick={toggle} style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', display: 'flex', alignItems: 'center' }}>
                    {show ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
            ))}
            <button type="submit" disabled={saving} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '8px', background: saved ? '#059669' : '#2255ec', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', width: 'fit-content', transition: 'background 200ms' }}>
              {saving ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : saved ? <><CheckCircle size={13} /> Updated!</> : <><Save size={13} /> Update Password</>}
            </button>
          </form>
        </div>

        {/* Notifications */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Bell size={14} style={{ color: '#2255ec' }} />
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1729' }}>Notifications</p>
          </div>
          {[
            { key: 'email', label: 'Email notifications', desc: 'Receive updates via email' },
            { key: 'updates', label: 'Product updates', desc: 'New features and improvements' },
            { key: 'tips', label: 'Career tips', desc: 'Weekly career advice and insights' },
          ].map(({ key, label, desc }) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid #f9fafb' }}>
              <div>
                <p style={{ fontSize: '13px', fontWeight: 500, color: '#0f1729' }}>{label}</p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>{desc}</p>
              </div>
              <button
                onClick={() => setNotifications(n => ({ ...n, [key]: !n[key as keyof typeof n] }))}
                style={{
                  width: '40px', height: '22px', borderRadius: '11px',
                  background: notifications[key as keyof typeof notifications] ? '#2255ec' : '#e5e7eb',
                  border: 'none', cursor: 'pointer', position: 'relative', transition: 'background 200ms', flexShrink: 0,
                }}
              >
                <span style={{
                  position: 'absolute', top: '3px',
                  left: notifications[key as keyof typeof notifications] ? '21px' : '3px',
                  width: '16px', height: '16px', borderRadius: '50%', background: '#fff',
                  transition: 'left 200ms', boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                }} />
              </button>
            </div>
          ))}
        </div>

        {/* Security */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Shield size={14} style={{ color: '#059669' }} />
            </div>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1729' }}>Security</p>
          </div>
          <div style={{ background: '#f9fafb', borderRadius: '8px', padding: '14px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Shield size={14} style={{ color: '#059669', flexShrink: 0 }} />
            <p style={{ fontSize: '12px', color: '#6b7280' }}>Your account is secured with JWT authentication. Tokens expire after 7 days.</p>
          </div>
        </div>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
