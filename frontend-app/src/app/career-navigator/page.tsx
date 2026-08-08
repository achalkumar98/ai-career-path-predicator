'use client';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import Link from 'next/link';
import {
  Compass,
  Sparkles,
  Target,
  TrendingUp,
  X,
  ArrowRight,
  Loader2,
  ArrowLeft,
} from 'lucide-react';
import { submitAssessmentApi } from '@/api/assessmentApi';
import toast from 'react-hot-toast';

export default function CareerNavigator() {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const cleanedSkills = skills
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const cleanedInterests = interests
      .split(',')
      .map((i) => i.trim())
      .filter(Boolean);
    if (!cleanedSkills.length || !cleanedInterests.length) {
      toast.error('Please enter at least one skill and one interest.');
      setLoading(false);
      return;
    }
    try {
      const res = await submitAssessmentApi(cleanedSkills, cleanedInterests);
      setResult(res.data.insight);
    } catch {
      toast.error("Error: Make sure you're logged in and your server is running.");
    } finally {
      setLoading(false);
    }
  };

  const highlights = [
    { icon: Target, label: 'Skill Matching', desc: 'AI maps your skills to real career paths' },
    { icon: TrendingUp, label: 'Market Trends', desc: 'See which roles are growing fastest' },
    { icon: Sparkles, label: 'Personalized', desc: 'Recommendations tailored to you' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: isDark ? '#141720' : '#f9fafb', transition: 'background 300ms' }}>
      {/* Back bar */}
      <div
        style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 48px' }}
        className="back-bar"
      >
        <Link
          href="/homepage"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            textDecoration: 'none',
            color: '#374151',
            fontSize: '13px',
          }}
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>
      {/* Hero */}
      <div
        style={{
          background: 'linear-gradient(135deg, #eef2ff 0%, #f9fafb 60%)',
          borderBottom: '1px solid #e5e7eb',
          padding: '64px 48px',
          textAlign: 'center',
        }}
        className="inner-hero"
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 14px',
            borderRadius: '9999px',
            background: 'rgba(34,85,236,0.08)',
            border: '1px solid rgba(34,85,236,0.2)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#2255ec',
            marginBottom: '24px',
          }}
        >
          <Compass size={13} />
          AI-Powered
        </div>

        <h1
          style={{
            fontSize: '42px',
            fontWeight: 800,
            color: '#0f1729',
            lineHeight: 1.15,
            marginBottom: '16px',
          }}
          className="hero-title"
        >
          AI-Powered
          <br />
          <span style={{ color: '#2255ec' }}>Career Navigator</span>
        </h1>

        <p
          style={{
            fontSize: '16px',
            color: '#6b7280',
            maxWidth: '560px',
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}
        >
          Discover your ideal career path using AI. Enter your skills and interests — get
          personalized career recommendations, growth roadmaps, and actionable next steps instantly.
        </p>

        <button
          onClick={() => {
            setOpen(true);
            setResult('');
          }}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 28px',
            borderRadius: '10px',
            background: '#2255ec',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(34,85,236,0.3)',
            transition: 'background 150ms, transform 150ms',
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#1a44c8';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = '#2255ec';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          Get Career Suggestions
          <ArrowRight size={15} />
        </button>
      </div>

      {/* Highlights */}
      <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }} className="page-pad">
        <div
          style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}
          className="highlights-grid"
        >
          {highlights.map(({ icon: Icon, label, desc }) => (
            <div
              key={label}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '24px',
                transition: 'box-shadow 200ms, transform 200ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <div
                style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '10px',
                  background: '#eef2ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <Icon size={18} style={{ color: '#2255ec' }} />
              </div>
              <p
                style={{ fontSize: '14px', fontWeight: 600, color: '#0f1729', marginBottom: '6px' }}
              >
                {label}
              </p>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {open && (() => {
        const mBg  = isDark ? '#1a1f2e' : '#ffffff';
        const mBdr = isDark ? '#272d3d' : '#f3f4f6';
        const mTxt = isDark ? '#f1f5f9' : '#0f1729';
        const mSub = isDark ? '#64748b' : '#9ca3af';
        const mBody= isDark ? '#cbd5e1' : '#374151';
        const iBg  = isDark ? '#0f1117' : '#ffffff';
        const iClr = isDark ? '#e2e8f0' : '#0f1729';
        const iBdr = isDark ? '#272d3d' : '#e5e7eb';
        const resBg= isDark ? '#0f1117' : '#f9fafb';
        const rBdr = isDark ? '#272d3d' : '#e5e7eb';
        const taStyle: React.CSSProperties = { width:'100%', padding:'10px 12px', borderRadius:'8px', border:`1px solid ${iBdr}`, fontSize:'13px', color:iClr, background:iBg, outline:'none', resize:'none', boxSizing:'border-box', transition:'border-color 150ms', fontFamily:'inherit' };
        return (
        <div style={{ position:'fixed', inset:0, background:'rgba(15,23,41,0.55)', backdropFilter:'blur(4px)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:200, padding:'24px' }}
          onClick={() => setOpen(false)}>
          <div style={{ background:mBg, borderRadius:'16px', width:'100%', maxWidth:'520px', boxShadow: isDark ? '0 20px 40px rgba(0,0,0,0.5)' : '0 20px 40px rgba(0,0,0,0.15)', overflow:'hidden', border:`1px solid ${mBdr}` }}
            onClick={(e) => e.stopPropagation()}>
            {/* header */}
            <div style={{ padding:'20px 24px', borderBottom:`1px solid ${mBdr}`, display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
                <div style={{ width:'32px', height:'32px', borderRadius:'8px', background: isDark ? '#1e2844' : '#eef2ff', display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <Compass size={15} style={{ color:'#2255ec' }} />
                </div>
                <div>
                  <p style={{ fontSize:'14px', fontWeight:700, color:mTxt }}>Career Navigator</p>
                  <p style={{ fontSize:'11px', color:mSub }}>AI-powered career suggestions</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background:'none', border:'none', cursor:'pointer', color:mSub, padding:'4px' }}><X size={18} /></button>
            </div>
            {/* body */}
            <div style={{ padding:'24px' }}>
              {!result ? (
                <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:'16px' }}>
                  {[
                    { label:'Your Skills', hint:'(comma separated)', val:skills, set:setSkills, ph:'e.g. JavaScript, React, Machine Learning' },
                    { label:'Your Interests', hint:'(comma separated)', val:interests, set:setInterests, ph:'e.g. AI, Web Development, Finance' },
                  ].map(({ label, hint, val, set: s, ph }) => (
                    <div key={label}>
                      <label style={{ display:'block', fontSize:'12px', fontWeight:500, color:mBody, marginBottom:'6px' }}>
                        {label} <span style={{ color:mSub, fontWeight:400 }}>{hint}</span>
                      </label>
                      <textarea rows={3} value={val} onChange={(e) => s(e.target.value)} placeholder={ph} required style={taStyle}
                        onFocus={(e) => (e.currentTarget.style.borderColor='#2255ec')}
                        onBlur={(e)  => (e.currentTarget.style.borderColor=iBdr)} />
                    </div>
                  ))}
                  <button type="submit" disabled={loading} style={{ width:'100%', padding:'11px', borderRadius:'10px', background:loading?'#93a5f5':'#2255ec', color:'#fff', fontSize:'13px', fontWeight:600, border:'none', cursor:loading?'not-allowed':'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:'8px' }}>
                    {loading ? <><Loader2 size={14} className="spin" /> Analyzing...</> : 'Get Career Suggestions →'}
                  </button>
                </form>
              ) : (
                <div>
                  <div style={{ display:'flex', alignItems:'center', gap:'8px', marginBottom:'16px' }}>
                    <Sparkles size={15} style={{ color:'#2255ec' }} />
                    <p style={{ fontSize:'13px', fontWeight:600, color:mTxt }}>AI Recommendations</p>
                  </div>
                  <div style={{ background:resBg, border:`1px solid ${rBdr}`, borderRadius:'10px', padding:'16px', fontSize:'13px', color:mBody, lineHeight:1.7, maxHeight:'300px', overflowY:'auto' }}>
                    {result}
                  </div>
                  <button onClick={() => { setResult(''); setSkills(''); setInterests(''); }}
                    style={{ marginTop:'16px', width:'100%', padding:'10px', borderRadius:'8px', border:`1px solid ${rBdr}`, background: isDark?'#0f1117':'#fff', fontSize:'13px', cursor:'pointer', color:mBody }}>
                    Try Again
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        );
      })()}

    </div>
  );
}
