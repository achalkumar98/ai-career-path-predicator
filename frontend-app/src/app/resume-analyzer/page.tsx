'use client';
import { useTheme } from '@/context/ThemeContext';
import { useState } from 'react';
import Link from 'next/link';
import {
  FileText, Upload, Cpu, CheckCircle, X, ArrowLeft, Briefcase,
  MapPin, Building2, Clock, ExternalLink, Sparkles, Search,
  Loader2, ArrowRight, ChevronDown, SlidersHorizontal, BarChart2,
  Calendar, Hash,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadResumeApi } from '@/api/resumeApi';
import { findJobMatchesApi } from '@/api/jobMatchingApi';
import { FaUpload, FaFilePdf } from 'react-icons/fa';

// ─── types ────────────────────────────────────────────────────────────────────
interface ResumeResult {
  extractedSkills?: string[];
  experienceYears?: string[];
  rawText?: string;
}

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  postedDate: string;
  applyLink: string;
  locationMatch?: boolean;
}

// ─── design tokens ────────────────────────────────────────────────────────────
const PURPLE      = '#7c3aed';
const PURPLE_DIM  = 'rgba(124,58,237,0.12)';
const PURPLE_HVR  = '#6d28d9';
const BLUE        = '#2255ec';
const BLUE_DIM    = 'rgba(34,85,236,0.1)';
const BLUE_HVR    = '#1a44c8';
const GREEN       = '#16a34a';
const AMBER       = '#92400e';
const PAGE_SIZE   = 9;

// ─── theme helpers ────────────────────────────────────────────────────────────
function useTokens(isDark: boolean) {
  return {
    bg:        isDark ? '#0f1117' : '#f4f6fb',
    surface:   isDark ? '#181c27' : '#ffffff',
    surface2:  isDark ? '#1e2333' : '#f9fafb',
    border:    isDark ? '#272d3d' : '#e5e7eb',
    border2:   isDark ? '#2e3548' : '#f0f0f5',
    txt:       isDark ? '#f1f5f9' : '#0f1729',
    txt2:      isDark ? '#94a3b8' : '#6b7280',
    txt3:      isDark ? '#64748b' : '#9ca3af',
    accent:    isDark ? '#a78bfa' : PURPLE,
    accentDim: isDark ? 'rgba(167,139,250,0.14)' : PURPLE_DIM,
    blueDim:   isDark ? 'rgba(34,85,236,0.18)'   : 'rgba(34,85,236,0.07)',
  };
}

// ─── highlight card data ─────────────────────────────────────────────────────
const HIGHLIGHTS = [
  { icon: Upload,      label: 'PDF Upload',    desc: 'Drop any PDF resume for instant parsing' },
  { icon: Cpu,         label: 'NLP Analysis',  desc: 'AI extracts skills & experience keywords' },
  { icon: CheckCircle, label: 'ATS Ready',     desc: 'See if your resume passes ATS screening' },
];

// ─── main page ────────────────────────────────────────────────────────────────
export default function ResumeAnalyzer() {
  const { isDark } = useTheme();
  const t = useTokens(isDark);

  const [open,          setOpen]          = useState(false);
  const [file,          setFile]          = useState<File | null>(null);
  const [resumeResult,  setResumeResult]  = useState<ResumeResult | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  const [jobLocation,   setJobLocation]   = useState('');
  const [jobKeyword,    setJobKeyword]    = useState('');
  const [jobLoading,    setJobLoading]    = useState(false);
  const [jobs,          setJobs]          = useState<Job[]>([]);
  const [jobSearched,   setJobSearched]   = useState(false);
  const [currentPage,   setCurrentPage]   = useState(1);
  const [showJobSearch, setShowJobSearch] = useState(false);

  // ── upload ─────────────────────────────────────────────────────────────────
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) { toast.error('Please select a resume PDF first!'); return; }
    setResumeLoading(true);
    try {
      const res = await uploadResumeApi(file);
      setResumeResult(res.data);
      toast.success('Resume analyzed successfully!');
      const firstSkill = res.data?.extractedSkills?.[0];
      if (firstSkill) setJobKeyword(firstSkill);
      setShowJobSearch(true);
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to analyze resume.');
    } finally {
      setResumeLoading(false);
    }
  };

  // ── job search ─────────────────────────────────────────────────────────────
  const handleJobSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobKeyword.trim() || !jobLocation.trim()) {
      toast.error('Please enter both a keyword and a location.');
      return;
    }
    setJobLoading(true);
    try {
      const res = await findJobMatchesApi(jobKeyword.trim(), jobLocation.trim());
      setJobs(res.data.data.jobs ?? []);
      setJobSearched(true);
      setCurrentPage(1);
      toast.success(`Found ${res.data.data.totalJobs} matching jobs!`);
    } catch {
      toast.error('Job search failed. Make sure your server is running.');
    } finally {
      setJobLoading(false);
    }
  };

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE);
  const pagedJobs  = jobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const matchCount = jobs.filter((j) => j.locationMatch).length;
  const uniqueYears = [...new Set(resumeResult?.experienceYears ?? [])].sort();

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: t.bg, transition: 'background 300ms' }}>

      {/* ── Back bar ────────────────────────────────────────────────────────── */}
      <div style={{ background: t.surface, borderBottom: `1px solid ${t.border}`, padding: '12px 48px' }}>
        <Link href="/homepage" style={{
          display: 'inline-flex', alignItems: 'center', gap: '6px',
          textDecoration: 'none', color: t.txt2, fontSize: '13px', fontWeight: 500,
        }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      {/* ── Hero (only before analysis) ─────────────────────────────────────── */}
      {!resumeResult && (
        <div style={{
          background: isDark
            ? 'linear-gradient(135deg, #14182a 0%, #0f1117 100%)'
            : 'linear-gradient(135deg, #faf5ff 0%, #f4f6fb 100%)',
          borderBottom: `1px solid ${t.border}`,
          padding: '72px 48px 64px',
          textAlign: 'center',
        }}>
          {/* badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '6px',
            padding: '5px 14px', borderRadius: '9999px', marginBottom: '24px',
            background: t.accentDim, border: `1px solid rgba(124,58,237,0.22)`,
            fontSize: '12px', fontWeight: 600, color: t.accent,
          }}>
            <FileText size={12} /> NLP-Powered Analysis
          </div>

          <h1 style={{ fontSize: '48px', fontWeight: 800, color: t.txt, lineHeight: 1.1, marginBottom: '16px' }}>
            Resume <span style={{ color: t.accent }}>Analyzer</span>
          </h1>
          <p style={{ fontSize: '16px', color: t.txt2, maxWidth: '500px', margin: '0 auto 36px', lineHeight: 1.75 }}>
            Upload your PDF and get AI-powered skill extraction, keyword scoring,
            and ATS compatibility — then find matching jobs instantly.
          </p>
          <button onClick={() => setOpen(true)} style={{
            display: 'inline-flex', alignItems: 'center', gap: '8px',
            padding: '14px 30px', borderRadius: '12px', background: t.accent,
            color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none',
            cursor: 'pointer', boxShadow: '0 6px 20px rgba(124,58,237,0.35)',
            transition: 'background 150ms, transform 150ms',
          }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = PURPLE_HVR; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = t.accent;   (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
          >
            <Upload size={16} /> Analyze My Resume
          </button>
        </div>
      )}

      {/* ── Highlight cards (pre-analysis) ──────────────────────────────────── */}
      {!resumeResult && (
        <div style={{ padding: '56px 48px', maxWidth: '960px', margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '20px' }} className="highlights-grid">
            {HIGHLIGHTS.map(({ icon: Icon, label, desc }) => (
              <div key={label} style={{
                background: t.surface, border: `1px solid ${t.border}`, borderRadius: '14px',
                padding: '28px 24px', transition: 'box-shadow 200ms, transform 200ms',
              }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = isDark ? '0 8px 28px rgba(0,0,0,0.4)' : '0 8px 28px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{
                  width: '44px', height: '44px', borderRadius: '12px', background: t.accentDim,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '16px',
                }}>
                  <Icon size={20} style={{ color: t.accent }} />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: t.txt, marginBottom: '8px' }}>{label}</p>
                <p style={{ fontSize: '13px', color: t.txt2, lineHeight: 1.65 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Analysis Results ────────────────────────────────────────────────── */}
      {resumeResult && (
        <div style={{ padding: '40px 48px', maxWidth: '1060px', margin: '0 auto' }} className="page-pad">

          {/* Header row */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '20px', fontWeight: 800, color: t.txt }}>Analysis Results</h2>
              <p style={{ fontSize: '13px', color: t.txt2, marginTop: '4px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <FaFilePdf style={{ color: '#dc2626' }} /> {file?.name}
                <span style={{ color: t.border }}> · </span>
                <span style={{ color: t.accent, fontWeight: 600 }}>{resumeResult.extractedSkills?.length ?? 0} skills found</span>
              </p>
            </div>
            <button onClick={() => setOpen(true)} style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              padding: '9px 16px', borderRadius: '9px', background: t.accentDim,
              color: t.accent, fontSize: '12px', fontWeight: 600,
              border: `1px solid rgba(124,58,237,0.2)`, cursor: 'pointer', transition: 'background 150ms',
            }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(124,58,237,0.22)' : '#ede9fe')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = t.accentDim)}
            >
              <Upload size={13} /> Re-analyze
            </button>
          </div>

          {/* ── Three stat cards ─────────────────────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '20px' }} className="stat-cards">
            {/* Skills count */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: t.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Hash size={18} style={{ color: t.accent }} />
              </div>
              <div>
                <p style={{ fontSize: '26px', fontWeight: 800, color: t.txt, lineHeight: 1 }}>{resumeResult.extractedSkills?.length ?? 0}</p>
                <p style={{ fontSize: '12px', color: t.txt2, marginTop: '3px' }}>Skills Detected</p>
              </div>
            </div>
            {/* Years span */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: isDark ? 'rgba(34,85,236,0.18)' : 'rgba(34,85,236,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Calendar size={18} style={{ color: BLUE }} />
              </div>
              <div>
                <p style={{ fontSize: '26px', fontWeight: 800, color: t.txt, lineHeight: 1 }}>
                  {uniqueYears.length > 0 ? `${uniqueYears[0]}–${uniqueYears[uniqueYears.length - 1]}` : '—'}
                </p>
                <p style={{ fontSize: '12px', color: t.txt2, marginTop: '3px' }}>Experience Range</p>
              </div>
            </div>
            {/* ATS Score */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '18px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
              <div style={{ width: '42px', height: '42px', borderRadius: '11px', background: isDark ? 'rgba(22,163,74,0.18)' : 'rgba(22,163,74,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <BarChart2 size={18} style={{ color: GREEN }} />
              </div>
              <div>
                <p style={{ fontSize: '26px', fontWeight: 800, color: t.txt, lineHeight: 1 }}>
                  {resumeResult.extractedSkills && resumeResult.extractedSkills.length >= 5 ? 'Good' : 'Fair'}
                </p>
                <p style={{ fontSize: '12px', color: t.txt2, marginTop: '3px' }}>ATS Readiness</p>
              </div>
            </div>
          </div>

          {/* ── Skills + Snippet side by side ──────────────────────────────── */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }} className="resume-results-grid">

            {/* Skills card */}
            <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '22px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: t.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={14} style={{ color: t.accent }} />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: t.txt, flex: 1 }}>Extracted Skills</p>
                <span style={{ fontSize: '11px', fontWeight: 700, color: t.accent, background: t.accentDim, padding: '3px 9px', borderRadius: '9999px', border: `1px solid rgba(124,58,237,0.2)` }}>
                  {resumeResult.extractedSkills?.length ?? 0}
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '7px', marginBottom: '12px' }}>
                {resumeResult.extractedSkills?.length ? (
                  resumeResult.extractedSkills.map((s, i) => (
                    <span key={i} onClick={() => setJobKeyword(s)} title="Click to search jobs with this skill"
                      style={{
                        fontSize: '12px', padding: '5px 12px', borderRadius: '9999px',
                        background: jobKeyword === s ? t.accent : t.accentDim,
                        color: jobKeyword === s ? '#fff' : t.accent,
                        border: `1px solid ${jobKeyword === s ? t.accent : 'rgba(124,58,237,0.2)'}`,
                        cursor: 'pointer', transition: 'all 150ms', fontWeight: 500,
                      }}
                      onMouseEnter={(e) => { if (jobKeyword !== s) { (e.currentTarget as HTMLElement).style.background = isDark ? 'rgba(124,58,237,0.22)' : '#ede9fe'; } }}
                      onMouseLeave={(e) => { if (jobKeyword !== s) { (e.currentTarget as HTMLElement).style.background = t.accentDim; } }}
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p style={{ fontSize: '13px', color: t.txt3 }}>No skills detected.</p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', padding: '8px 10px', borderRadius: '8px', background: t.surface2, border: `1px solid ${t.border}` }}>
                <Sparkles size={11} style={{ color: t.accent, flexShrink: 0 }} />
                <p style={{ fontSize: '11px', color: t.txt2, lineHeight: 1.5 }}>
                  Click any skill to use it as a job search keyword
                </p>
              </div>
            </div>

            {/* Snippet + Experience stacked */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

              {/* Experience years */}
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '22px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: isDark ? 'rgba(34,85,236,0.18)' : 'rgba(34,85,236,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Calendar size={14} style={{ color: BLUE }} />
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: t.txt }}>Experience Years</p>
                </div>
                {uniqueYears.length > 0 ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {uniqueYears.map((yr) => (
                      <span key={yr} style={{
                        fontSize: '12px', padding: '4px 10px', borderRadius: '7px',
                        background: isDark ? 'rgba(34,85,236,0.14)' : 'rgba(34,85,236,0.07)',
                        color: isDark ? '#93b4ff' : BLUE,
                        border: `1px solid rgba(34,85,236,0.18)`, fontWeight: 600,
                      }}>{yr}</span>
                    ))}
                  </div>
                ) : (
                  <p style={{ fontSize: '13px', color: t.txt3 }}>Not detected</p>
                )}
              </div>

              {/* Resume snippet */}
              <div style={{ background: t.surface, border: `1px solid ${t.border}`, borderRadius: '14px', padding: '22px', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: t.surface2, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <FileText size={14} style={{ color: t.txt2 }} />
                  </div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: t.txt }}>Resume Snippet</p>
                </div>
                <div style={{ flex: 1, background: t.surface2, borderRadius: '10px', border: `1px solid ${t.border2}`, padding: '14px', maxHeight: '130px', overflowY: 'auto' }}>
                  <pre style={{ fontSize: '11.5px', lineHeight: 1.75, whiteSpace: 'pre-wrap', color: t.txt2, margin: 0, fontFamily: 'ui-monospace, "Cascadia Code", Consolas, monospace' }}>
                    {resumeResult.rawText?.slice(0, 450)}{(resumeResult.rawText?.length ?? 0) > 450 ? '\n…' : ''}
                  </pre>
                </div>
              </div>
            </div>
          </div>

          {/* ── Job Matching Banner ─────────────────────────────────────────── */}
          <div style={{
            background: isDark
              ? 'linear-gradient(135deg, rgba(34,85,236,0.14) 0%, rgba(124,58,237,0.1) 100%)'
              : 'linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%)',
            border: `1px solid ${isDark ? 'rgba(34,85,236,0.25)' : 'rgba(34,85,236,0.15)'}`,
            borderRadius: '16px', padding: '24px', marginBottom: '20px',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '46px', height: '46px', borderRadius: '12px', background: BLUE, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 4px 14px rgba(34,85,236,0.3)' }}>
                  <Briefcase size={20} style={{ color: '#fff' }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: t.txt }}>Find Jobs Matching Your Resume</p>
                  <p style={{ fontSize: '12px', color: t.txt2, marginTop: '2px' }}>
                    We detected <strong style={{ color: BLUE }}>{resumeResult.extractedSkills?.length ?? 0} skills</strong>{' '}
                    — search live LinkedIn jobs pre-filled with your top skill.
                  </p>
                </div>
              </div>
              <button onClick={() => setShowJobSearch((s) => !s)} style={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                padding: '10px 20px', borderRadius: '10px', background: BLUE,
                color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none',
                cursor: 'pointer', transition: 'background 150ms', flexShrink: 0,
              }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = BLUE_HVR)}
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = BLUE)}
              >
                {showJobSearch ? 'Hide' : 'Search Jobs'}
                <ChevronDown size={14} style={{ transform: showJobSearch ? 'rotate(180deg)' : 'none', transition: 'transform 200ms' }} />
              </button>
            </div>

            {/* Inline search form */}
            {showJobSearch && (
              <form onSubmit={handleJobSearch} style={{
                marginTop: '20px', paddingTop: '20px',
                borderTop: `1px solid ${isDark ? 'rgba(34,85,236,0.2)' : 'rgba(34,85,236,0.12)'}`,
                display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'flex-end',
              }}>
                {[
                  { label: 'Job Field', placeholder: 'e.g. React Developer', icon: Search, value: jobKeyword, onChange: setJobKeyword },
                  { label: 'Location',  placeholder: 'e.g. Bangalore, Mumbai', icon: MapPin,  value: jobLocation, onChange: setJobLocation },
                ].map(({ label, placeholder, icon: Icon, value, onChange }) => (
                  <div key={label} style={{ flex: '1 1 200px', minWidth: '160px' }}>
                    <label style={{ display: 'block', fontSize: '10px', fontWeight: 700, color: t.txt2, marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</label>
                    <div style={{ position: 'relative' }}>
                      <Icon size={13} style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: t.txt3, pointerEvents: 'none' }} />
                      <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} required
                        style={{ width: '100%', padding: '10px 10px 10px 32px', borderRadius: '9px', border: `1px solid ${isDark ? '#2e3548' : '#dde4fb'}`, fontSize: '13px', color: t.txt, outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', background: t.surface, transition: 'border-color 150ms' }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                        onBlur={(e)  => (e.currentTarget.style.borderColor = isDark ? '#2e3548' : '#dde4fb')}
                      />
                    </div>
                  </div>
                ))}
                <button type="submit" disabled={jobLoading} style={{
                  padding: '10px 22px', borderRadius: '9px', background: jobLoading ? '#93a5f5' : BLUE,
                  color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none',
                  cursor: jobLoading ? 'not-allowed' : 'pointer', display: 'inline-flex',
                  alignItems: 'center', gap: '7px', transition: 'background 150ms', flexShrink: 0,
                }}
                  onMouseEnter={(e) => { if (!jobLoading) (e.currentTarget as HTMLElement).style.background = BLUE_HVR; }}
                  onMouseLeave={(e) => { if (!jobLoading) (e.currentTarget as HTMLElement).style.background = BLUE; }}
                >
                  {jobLoading
                    ? <><Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} /> Searching…</>
                    : <><ArrowRight size={13} /> Find Jobs</>}
                </button>
              </form>
            )}
          </div>

          {/* ── Job Results ─────────────────────────────────────────────────── */}
          {jobSearched && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: t.txt }}>{jobs.length} Jobs Found</h3>
                  <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                    <p style={{ fontSize: '12px', color: t.txt2, margin: 0, display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Search size={11} /> <strong style={{ color: t.txt }}>{jobKeyword}</strong>
                      <span style={{ color: t.border }}>·</span>
                      <MapPin size={11} /> <strong style={{ color: t.txt }}>{jobLocation}</strong>
                    </p>
                    {matchCount > 0 && (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '2px 8px', borderRadius: '9999px', background: isDark ? 'rgba(22,163,74,0.14)' : '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '11px', fontWeight: 600, color: GREEN }}>
                        <MapPin size={9} /> {matchCount} exact
                      </span>
                    )}
                    {jobs.length - matchCount > 0 && (
                      <span style={{ padding: '2px 8px', borderRadius: '9999px', background: isDark ? 'rgba(146,64,14,0.14)' : '#fefce8', border: '1px solid #fde68a', fontSize: '11px', fontWeight: 600, color: AMBER }}>
                        {jobs.length - matchCount} nearby
                      </span>
                    )}
                  </div>
                </div>
                <button onClick={() => { setJobSearched(false); setJobs([]); }} style={{
                  display: 'inline-flex', alignItems: 'center', gap: '5px', padding: '8px 14px',
                  borderRadius: '8px', background: t.surface, color: t.txt2, fontSize: '12px',
                  border: `1px solid ${t.border}`, cursor: 'pointer', fontWeight: 500,
                }}>
                  <SlidersHorizontal size={12} /> New search
                </button>
              </div>

              {jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '14px', background: t.surface2, border: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                    <Search size={22} style={{ color: t.txt3 }} />
                  </div>
                  <p style={{ fontSize: '15px', fontWeight: 700, color: t.txt, marginBottom: '6px' }}>No jobs found</p>
                  <p style={{ fontSize: '13px', color: t.txt2 }}>Try a different keyword or location.</p>
                </div>
              ) : (
                <>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px' }} className="job-cards-grid">
                    {pagedJobs.map((job) => (
                      <ResumeJobCard key={job.id} job={job} searchLocation={jobLocation} isDark={isDark} t={t} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', marginTop: '28px', flexWrap: 'wrap' }}>
                      <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                        style={{ padding: '7px 14px', borderRadius: '8px', border: `1px solid ${t.border}`, background: t.surface, fontSize: '12px', color: currentPage === 1 ? t.txt3 : t.txt, cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}>
                        ← Prev
                      </button>
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                        .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                          if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                          acc.push(p); return acc;
                        }, [])
                        .map((p, i) => p === '...'
                          ? <span key={`e${i}`} style={{ fontSize: '12px', color: t.txt3 }}>…</span>
                          : <button key={p} onClick={() => setCurrentPage(p as number)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: currentPage === p ? 'none' : `1px solid ${t.border}`, background: currentPage === p ? BLUE : t.surface, color: currentPage === p ? '#fff' : t.txt, fontSize: '12px', fontWeight: currentPage === p ? 700 : 400, cursor: 'pointer' }}>{p}</button>
                        )}
                      <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                        style={{ padding: '7px 14px', borderRadius: '8px', border: `1px solid ${t.border}`, background: t.surface, fontSize: '12px', color: currentPage === totalPages ? t.txt3 : t.txt, cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}>
                        Next →
                      </button>
                    </div>
                  )}
                  <p style={{ textAlign: 'center', marginTop: '10px', fontSize: '11px', color: t.txt3 }}>
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, jobs.length)} of {jobs.length} jobs
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Upload Modal ─────────────────────────────────────────────────────── */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(10,13,22,0.65)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '24px' }}
          onClick={(e) => { if (e.target === e.currentTarget) setOpen(false); }}>
          <div style={{ background: t.surface, borderRadius: '18px', width: '100%', maxWidth: '460px', boxShadow: isDark ? '0 24px 60px rgba(0,0,0,0.6)' : '0 24px 60px rgba(0,0,0,0.18)', overflow: 'hidden', border: `1px solid ${t.border}` }}>

            {/* Modal header */}
            <div style={{ padding: '20px 24px', borderBottom: `1px solid ${t.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: t.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <FileText size={16} style={{ color: t.accent }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: t.txt }}>Resume Analyzer</p>
                  <p style={{ fontSize: '11px', color: t.txt3 }}>AI-powered skill extraction</p>
                </div>
              </div>
              <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.txt2, padding: '6px', borderRadius: '7px', display: 'flex' }} aria-label="Close">
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px' }}>
              <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <label style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  width: '100%', height: '148px', borderRadius: '12px',
                  border: `2px dashed ${file ? t.accent : t.border}`,
                  background: file ? t.accentDim : t.surface2, cursor: 'pointer', transition: 'all 150ms',
                }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = t.accent; (e.currentTarget as HTMLElement).style.background = t.accentDim; }}
                  onMouseLeave={(e) => { if (!file) { (e.currentTarget as HTMLElement).style.borderColor = t.border; (e.currentTarget as HTMLElement).style.background = t.surface2; } }}
                >
                  {file ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '0 16px' }}>
                      <FaFilePdf size={26} style={{ color: '#dc2626', flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 600, color: t.txt }}>{file.name}</p>
                        <p style={{ fontSize: '11px', color: t.txt3, marginTop: '3px' }}>{(file.size / 1024).toFixed(1)} KB · PDF</p>
                      </div>
                      <button type="button" onClick={(e) => { e.preventDefault(); setFile(null); }}
                        style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: t.txt3, flexShrink: 0 }}>
                        <X size={14} />
                      </button>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: t.accentDim, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <FaUpload size={18} style={{ color: t.accent }} />
                      </div>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: t.txt }}>Drop your PDF here</p>
                      <p style={{ fontSize: '11px', color: t.txt3, marginTop: '4px' }}>or click to browse files</p>
                    </div>
                  )}
                  <input type="file" accept=".pdf" style={{ display: 'none' }} onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
                </label>

                <div style={{ display: 'flex', gap: '8px', padding: '10px 12px', borderRadius: '9px', background: t.accentDim, border: `1px solid rgba(124,58,237,0.18)` }}>
                  <Sparkles size={13} style={{ color: t.accent, flexShrink: 0, marginTop: '1px' }} />
                  <p style={{ fontSize: '11px', color: t.txt2, lineHeight: 1.65 }}>
                    After analysis, your top skill auto-fills the job search so you can find matches instantly.
                  </p>
                </div>

                <button type="submit" disabled={resumeLoading} style={{
                  width: '100%', padding: '12px', borderRadius: '11px',
                  background: resumeLoading ? '#c4b5fd' : t.accent,
                  color: '#fff', fontSize: '14px', fontWeight: 700, border: 'none',
                  cursor: resumeLoading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  transition: 'background 150ms',
                }}
                  onMouseEnter={(e) => { if (!resumeLoading) (e.currentTarget as HTMLElement).style.background = PURPLE_HVR; }}
                  onMouseLeave={(e) => { if (!resumeLoading) (e.currentTarget as HTMLElement).style.background = t.accent; }}
                >
                  {resumeLoading
                    ? <><Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> Analyzing…</>
                    : <><Sparkles size={15} /> Analyze Resume</>}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .highlights-grid, .resume-results-grid, .stat-cards, .job-cards-grid { grid-template-columns: 1fr !important; }
          .page-pad { padding: 24px 20px !important; }
        }
        @media (max-width: 560px) {
          .page-pad { padding: 20px 16px !important; }
        }
      `}</style>
    </div>
  );
}

// ─── Job card component ───────────────────────────────────────────────────────
type Tokens = ReturnType<typeof useTokens>;

function ResumeJobCard({ job, searchLocation, isDark, t }: { job: Job; searchLocation: string; isDark: boolean; t: Tokens }) {
  const isMatch = job.locationMatch ?? job.location.toLowerCase().includes(searchLocation.toLowerCase());
  const initials = job.company.split(' ').slice(0, 2).map((w) => w[0]).join('').toUpperCase();

  return (
    <div style={{
      background: t.surface, border: `1px solid ${t.border}`, borderRadius: '14px',
      padding: '18px', display: 'flex', flexDirection: 'column', gap: '12px',
      transition: 'box-shadow 200ms, transform 200ms',
    }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = isDark ? '0 8px 28px rgba(34,85,236,0.2)' : '0 6px 20px rgba(34,85,236,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-3px)'; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      {/* Company + title */}
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: isDark ? 'rgba(34,85,236,0.18)' : 'rgba(34,85,236,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 800, color: isDark ? '#93b4ff' : BLUE }}>
          {initials || <Building2 size={15} style={{ color: isDark ? '#93b4ff' : BLUE }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '12px', fontWeight: 700, color: t.txt, lineHeight: 1.45, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.title}
          </p>
          <p style={{ fontSize: '11px', color: t.txt2, marginTop: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {job.company}
          </p>
        </div>
      </div>

      {/* Location + date */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '11px', color: t.txt2 }}>
          <MapPin size={10} style={{ flexShrink: 0 }} />
          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}>{job.location}</span>
          <span style={{ flexShrink: 0, padding: '2px 6px', borderRadius: '9999px', fontSize: '10px', fontWeight: 700,
            ...(isMatch
              ? { background: isDark ? 'rgba(22,163,74,0.14)' : '#f0fdf4', border: '1px solid #bbf7d0', color: GREEN }
              : { background: isDark ? 'rgba(146,64,14,0.14)' : '#fefce8',  border: '1px solid #fde68a', color: AMBER }),
          }}>
            {isMatch ? '✓ Exact' : 'Nearby'}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px', color: t.txt3 }}>
          <Clock size={9} style={{ flexShrink: 0 }} /> {job.postedDate}
        </div>
      </div>

      <div style={{ height: '1px', background: t.border }} />

      {job.applyLink ? (
        <a href={job.applyLink} target="_blank" rel="noopener noreferrer" style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px',
          padding: '8px', borderRadius: '8px', background: BLUE, color: '#fff',
          fontSize: '11px', fontWeight: 700, textDecoration: 'none', marginTop: 'auto',
          transition: 'background 150ms',
        }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = BLUE_HVR)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = BLUE)}
        >
          Apply on LinkedIn <ExternalLink size={10} />
        </a>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '8px', borderRadius: '8px', background: t.surface2, color: t.txt3, fontSize: '11px', marginTop: 'auto' }}>
          Link unavailable
        </div>
      )}
    </div>
  );
}
