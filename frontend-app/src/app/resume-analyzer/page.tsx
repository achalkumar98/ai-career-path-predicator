'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FileText, Upload, Cpu, CheckCircle, X, ArrowLeft } from 'lucide-react';
import ResumeNLP from '@/components/ResumeNLP';

export default function ResumeAnalyzer() {
  const [open, setOpen] = useState(false);

  const highlights = [
    { icon: Upload, label: 'PDF Upload', desc: 'Upload your resume PDF for instant analysis' },
    { icon: Cpu, label: 'NLP Analysis', desc: 'AI extracts skills, experience, and keywords' },
    { icon: CheckCircle, label: 'ATS Ready', desc: 'Check if your resume passes ATS filters' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb' }}>
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
          background: 'linear-gradient(135deg, #faf5ff 0%, #f9fafb 60%)',
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
            background: 'rgba(124,58,237,0.08)',
            border: '1px solid rgba(124,58,237,0.2)',
            fontSize: '12px',
            fontWeight: 600,
            color: '#7c3aed',
            marginBottom: '24px',
          }}
        >
          <FileText size={13} />
          NLP Analysis
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
          Resume
          <br />
          <span style={{ color: '#7c3aed' }}>Analyzer</span>
        </h1>
        <p
          style={{
            fontSize: '16px',
            color: '#6b7280',
            maxWidth: '520px',
            margin: '0 auto 32px',
            lineHeight: 1.7,
          }}
        >
          Upload your PDF resume and get AI-powered skill extraction, keyword analysis, and ATS
          compatibility feedback in seconds.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 28px',
            borderRadius: '10px',
            background: '#7c3aed',
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = '#6d28d9')}
          onMouseLeave={(e) => (e.currentTarget.style.background = '#7c3aed')}
        >
          Analyze My Resume
          <Upload size={15} />
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
                  background: '#faf5ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '14px',
                }}
              >
                <Icon size={18} style={{ color: '#7c3aed' }} />
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
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,41,0.5)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 200,
            padding: '24px',
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '560px',
              maxHeight: '85vh',
              display: 'flex',
              flexDirection: 'column',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexShrink: 0,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: '#faf5ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={15} style={{ color: '#7c3aed' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>
                    Resume Analyzer
                  </p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>AI-powered skill extraction</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#9ca3af',
                  padding: '4px',
                }}
              >
                <X size={18} />
              </button>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              <ResumeNLP />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
