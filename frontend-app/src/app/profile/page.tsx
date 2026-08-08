'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { User, Mail, Phone, MapPin, FileText, Save, Loader2, CheckCircle, ArrowLeft } from 'lucide-react';
import { getProfileApi, updateProfileApi } from '@/api/authApi';
import { useTheme } from '@/context/ThemeContext';
import toast from 'react-hot-toast';

export default function Profile() {
  const { isDark } = useTheme();
  const [form, setForm] = useState({ name: '', email: '', bio: '', phone: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

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

  useEffect(() => {
    getProfileApi()
      .then((res) => {
        const u = res.data;
        setForm({ name: u.name || '', email: u.email || '', bio: u.bio || '', phone: u.phone || '', location: u.location || '' });
      })
      .catch(() => {
        const local = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
        if (local) setForm((f) => ({ ...f, name: local.name || '', email: local.email || '' }));
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateProfileApi(form);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      setSaved(true);
      toast.success('Profile updated successfully!');
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      const e = err as { response?: { data?: { msg?: string } } };
      toast.error(e.response?.data?.msg || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '9px 12px', borderRadius: '8px',
    border: `1px solid ${inputBorder}`, fontSize: '13px',
    color: inputColor, background: inputBg,
    outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms',
  };

  const fields = [
    { key: 'name',     label: 'Full Name',      icon: User,    type: 'text',  placeholder: 'Your full name' },
    { key: 'email',    label: 'Email Address',  icon: Mail,    type: 'email', placeholder: 'you@example.com' },
    { key: 'phone',    label: 'Phone Number',   icon: Phone,   type: 'text',  placeholder: '+1 (555) 000-0000' },
    { key: 'location', label: 'Location',       icon: MapPin,  type: 'text',  placeholder: 'City, Country' },
  ];

  if (loading)
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 56px)', gap: '10px', background: pageBg, color: mutedColor }}>
        <Loader2 size={18} className="spin" />
        <span style={{ fontSize: '13px' }}>Loading profile…</span>
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
            <span className="gradient-text">Profile</span>
          </h1>
          <p style={{ fontSize: '13px', color: descColor }}>Manage your personal information and preferences.</p>
        </div>

        {/* Avatar card */}
        <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px', transition: 'background 300ms, border-color 300ms' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: isDark ? '#1e2844' : '#dde4fb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#2255ec', flexShrink: 0 }}>
            {form.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: titleColor }}>{form.name || 'User'}</p>
            <p style={{ fontSize: '13px', color: descColor }}>{form.email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave}>
          <div style={{ background: cardBg, border: `1px solid ${cardBorder}`, borderRadius: '12px', padding: '24px', marginBottom: '20px', transition: 'background 300ms, border-color 300ms' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: titleColor, marginBottom: '20px', paddingBottom: '12px', borderBottom: `1px solid ${divider}` }}>
              Personal Information
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="form-row">
              {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: labelColor, marginBottom: '6px' }}>
                    <Icon size={12} style={{ color: mutedColor }} />
                    {label}
                  </label>
                  <input
                    type={type}
                    value={(form as Record<string, string>)[key]}
                    onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={inputStyle}
                    onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                    onBlur={(e)  => (e.currentTarget.style.borderColor = inputBorder)}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: labelColor, marginBottom: '6px' }}>
                <FileText size={12} style={{ color: mutedColor }} />
                Bio
              </label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={(e) => setForm((f) => ({ ...f, bio: e.target.value }))}
                placeholder="Tell us a bit about yourself…"
                style={{ ...inputStyle, resize: 'none', fontFamily: 'inherit' }}
                onFocus={(e) => (e.currentTarget.style.borderColor = '#2255ec')}
                onBlur={(e)  => (e.currentTarget.style.borderColor = inputBorder)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{
              display: 'flex', alignItems: 'center', gap: '8px',
              padding: '11px 24px', borderRadius: '10px',
              background: saved ? '#059669' : '#2255ec',
              color: '#fff', fontSize: '13px', fontWeight: 600,
              border: 'none', cursor: saving ? 'not-allowed' : 'pointer',
              transition: 'background 200ms',
            }}
          >
            {saving ? <><Loader2 size={14} className="spin" /> Saving…</>
              : saved ? <><CheckCircle size={14} /> Saved!</>
              : <><Save size={14} /> Save Changes</>}
          </button>
        </form>
      </div>
    </div>
  );
}
