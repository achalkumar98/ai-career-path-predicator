'use client';
import { useState } from 'react';
import { uploadResumeApi } from '@/api/resumeApi';
import { FaUpload, FaFilePdf } from 'react-icons/fa';

export default function ResumeNLP() {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<any>(null);
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
    <div className="space-y-6">
      <div className="glass p-6">
        <form onSubmit={handleUpload} className="space-y-5">
          {/* Drop zone */}
          <label
            className="flex flex-col items-center justify-center w-full h-36 rounded-xl cursor-pointer transition-all duration-200"
            style={{ border: '2px dashed rgba(0,212,255,0.25)', background: 'rgba(0,212,255,0.03)' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.5)')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,212,255,0.25)')}
          >
            {file ? (
              <div className="flex items-center gap-3">
                <FaFilePdf size={28} style={{ color: '#f87171' }} />
                <div>
                  <p className="text-sm font-medium text-white">{file.name}</p>
                  <p className="text-xs" style={{ color: 'var(--text-muted)' }}>{(file.size / 1024).toFixed(1)} KB</p>
                </div>
              </div>
            ) : (
              <div className="text-center">
                <FaUpload size={24} className="mx-auto mb-2" style={{ color: 'var(--accent)' }} />
                <p className="text-sm font-medium text-white">Drop your PDF here</p>
                <p className="text-xs mt-1" style={{ color: 'var(--text-muted)' }}>or click to browse</p>
              </div>
            )}
            <input type="file" accept=".pdf" className="hidden" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
          </label>

          <button type="submit" disabled={loading} className="btn-accent w-full py-3">
            {loading ? 'Analyzing...' : 'Analyze Resume →'}
          </button>
        </form>
      </div>

      {result && (
        <div className="glass p-6 space-y-5">
          <h3 className="text-lg font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
            Analysis Results
          </h3>

          <div className="p-4 rounded-lg" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>🔍 EXTRACTED SKILLS</p>
            <div className="flex flex-wrap gap-2">
              {result.extractedSkills?.length ? result.extractedSkills.map((s: string, i: number) => (
                <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.2)' }}>{s}</span>
              )) : <p className="text-sm" style={{ color: 'var(--text-muted)' }}>None found.</p>}
            </div>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>📆 EXPERIENCE YEARS</p>
            <p className="text-sm text-white">{result.experienceYears?.join(', ') || 'None found.'}</p>
          </div>

          <div className="p-4 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--text-muted)' }}>📜 RESUME SNIPPET</p>
            <pre className="text-xs leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap" style={{ color: 'var(--text-muted)' }}>{result.rawText}</pre>
          </div>
        </div>
      )}
    </div>
  );
}
