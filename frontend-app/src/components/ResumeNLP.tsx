'use client';
import { useState } from 'react';
import { uploadResumeApi } from '@/api/resumeApi';
import { FaUpload, FaFilePdf } from 'react-icons/fa';

interface ResumeResult {
  extractedSkills?: string[];
  experienceYears?: string[];
  rawText?: string;
}

export default function ResumeNLP() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<ResumeResult | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { alert('Please select a resume PDF first!'); return; }
    try {
      setLoading(true);
      const res = await uploadResumeApi(file);
      setResult(res.data);
    } catch (err) {
      console.error('Upload error:', err);
      alert('Failed to analyze resume.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
      <div className="glass" style={{ padding: 'var(--space-7)' }}>
        <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>

          {/* Drop zone */}
          <label
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              width: '100%', height: '140px',
              borderRadius: 'var(--radius-sm)',
              border: '2px dashed var(--color-border-default)',
              background: '#f9fafb',
              cursor: 'pointer',
              transition: `border-color var(--motion-instant), background var(--motion-instant)`,
            }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(34,85,236,0.4)'; (e.currentTarget as HTMLElement).style.background = 'rgba(34,85,236,0.03)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border-default)'; (e.currentTarget as HTMLElement).style.background = '#f9fafb'; }}
          >
            {file ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-4)' }}>
                <FaFilePdf size={24} style={{ color: '#dc2626' }} aria-hidden="true" />
                <div>
                  <p style={{ fontSize: 'var(--font-size-md)', fontWeight: 500, color: 'var(--color-text-primary)' }}>{file.name}</p>
                  <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)' }}>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ) : (
              <div style={{ textAlign: 'center' }}>
                <FaUpload size={20} style={{ color: 'var(--color-surface-raised)', margin: '0 auto var(--space-3)' }} aria-hidden="true" />
                <p style={{ fontSize: 'var(--font-size-md)', fontWeight: 500, color: 'var(--color-text-primary)' }}>Drop your PDF here</p>
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-2)' }}>or click to browse</p>
              </div>
            )}
            <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>

          <button type="submit" disabled={loading} className="btn-accent w-full" style={{ padding: 'var(--space-4) var(--space-6)' }}>
            {loading ? 'Analyzing...' : 'Analyze Resume →'}
          </button>
        </form>
      </div>

      {result && (
        <div className="glass" style={{ padding: 'var(--space-7)', display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
          <h3 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-surface-raised)', display: 'inline-block', flexShrink: 0 }} />
            Analysis Results
          </h3>

          <div style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xs)', background: 'rgba(34,85,236,0.04)', border: '1px solid rgba(34,85,236,0.12)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-surface-raised)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              🔍 Extracted Skills
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
              {result.extractedSkills?.length ? result.extractedSkills.map((s: string, i: number) => (
                <span
                  key={i}
                  style={{
                    fontSize: 'var(--font-size-xs)',
                    padding: `var(--space-2) var(--space-4)`,
                    borderRadius: 'var(--radius-lg)',
                    background: 'rgba(34,85,236,0.08)',
                    color: 'var(--color-surface-raised)',
                    border: '1px solid rgba(34,85,236,0.2)',
                  }}
                >
                  {s}
                </span>
              )) : <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-tertiary)' }}>None found.</p>}
            </div>
          </div>

          <div style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xs)', background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: '#7c3aed', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📆 Experience Years
            </p>
            <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>{result.experienceYears?.join(', ') || 'None found.'}</p>
          </div>

          <div style={{ padding: 'var(--space-6)', borderRadius: 'var(--radius-xs)', background: '#f9fafb', border: '1px solid var(--color-border-default)' }}>
            <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 600, color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              📜 Resume Snippet
            </p>
            <pre style={{ fontSize: 'var(--font-size-xs)', lineHeight: '1.7', maxHeight: '192px', overflowY: 'auto', whiteSpace: 'pre-wrap', color: 'var(--color-text-tertiary)' }}>
              {result.rawText}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
}
