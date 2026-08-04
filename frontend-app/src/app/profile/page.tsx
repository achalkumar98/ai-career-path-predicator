'use client';
import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, FileText, Save, Loader2, CheckCircle } from 'lucide-react';
import { getProfileApi, updateProfileApi } from '@/api/authApi';

export default function Profile() {
  const [form, setForm] = useState({ name: '', email: '', bio: '', phone: '', location: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getProfileApi()
      .then(res => {
        const u = res.data;
        setForm({ name: u.name || '', email: u.email || '', bio: u.bio || '', phone: u.phone || '', location: u.location || '' });
      })
      .catch(() => {
        const local = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null;
        if (local) setForm(f => ({ ...f, name: local.name || '', email: local.email || '' }));
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
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      alert(err.response?.data?.msg || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Full Name', icon: User, type: 'text', placeholder: 'Your full name' },
    { key: 'email', label: 'Email Address', icon: Mail, type: 'email', placeholder: 'you@example.com' },
    { key: 'phone', label: 'Phone Number', icon: Phone, type: 'text', placeholder: '+1 (555) 000-0000' },
    { key: 'location', label: 'Location', icon: MapPin, type: 'text', placeholder: 'City, Country' },
  ];

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 56px)', gap: '10px', color: '#9ca3af' }}>
      <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
      <span style={{ fontSize: '13px' }}>Loading profile...</span>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb', padding: '40px 48px' }}>
      <div style={{ maxWidth: '640px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#0f1729', marginBottom: '6px' }}>Profile</h1>
          <p style={{ fontSize: '13px', color: '#6b7280' }}>Manage your personal information and preferences.</p>
        </div>

        {/* Avatar */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#dde4fb', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', fontWeight: 700, color: '#2255ec', flexShrink: 0 }}>
            {form.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p style={{ fontSize: '16px', fontWeight: 600, color: '#0f1729' }}>{form.name || 'User'}</p>
            <p style={{ fontSize: '13px', color: '#6b7280' }}>{form.email}</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSave}>
          <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', marginBottom: '20px' }}>
            <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1729', marginBottom: '20px', paddingBottom: '12px', borderBottom: '1px solid #f3f4f6' }}>Personal Information</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              {fields.map(({ key, label, icon: Icon, type, placeholder }) => (
                <div key={key}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    <Icon size={12} style={{ color: '#9ca3af' }} />
                    {label}
                  </label>
                  <input
                    type={type}
                    value={(form as any)[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    placeholder={placeholder}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#0f1729', outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms' }}
                    onFocus={e => (e.currentTarget.style.borderColor = '#2255ec')}
                    onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                  />
                </div>
              ))}
            </div>

            <div style={{ marginTop: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                <FileText size={12} style={{ color: '#9ca3af' }} />
                Bio
              </label>
              <textarea
                rows={3}
                value={form.bio}
                onChange={e => setForm(f => ({ ...f, bio: e.target.value }))}
                placeholder="Tell us a bit about yourself..."
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#0f1729', outline: 'none', resize: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border-color 150ms' }}
                onFocus={e => (e.currentTarget.style.borderColor = '#2255ec')}
                onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '11px 24px', borderRadius: '10px', background: saved ? '#059669' : '#2255ec', color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 200ms' }}
          >
            {saving ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Saving...</> : saved ? <><CheckCircle size={14} /> Saved!</> : <><Save size={14} /> Save Changes</>}
          </button>
        </form>
      </div>
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
