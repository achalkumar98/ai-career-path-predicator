'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  Upload,
  Cpu,
  CheckCircle,
  X,
  ArrowLeft,
  Briefcase,
  MapPin,
  Building2,
  Clock,
  ExternalLink,
  Sparkles,
  Search,
  Loader2,
  ArrowRight,
  ChevronDown,
  SlidersHorizontal,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadResumeApi } from '@/api/resumeApi';
import { findJobMatchesApi } from '@/api/jobMatchingApi';
import { FaUpload, FaFilePdf } from 'react-icons/fa';

// ─── types ───────────────────────────────────────────────────────────────────
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

// ─── colours ─────────────────────────────────────────────────────────────────
const PURPLE = '#7c3aed';
const PURPLE_LIGHT = '#faf5ff';
const PURPLE_HOVER = '#6d28d9';
const BLUE = '#2255ec';
const BLUE_LIGHT = '#eef2ff';
const BLUE_HOVER = '#1a44c8';
const PAGE_SIZE = 9;

// ─── main page ───────────────────────────────────────────────────────────────
export default function ResumeAnalyzer() {
  // upload modal
  const [open, setOpen] = useState(false);

  // resume analysis
  const [file, setFile] = useState<File | null>(null);
  const [resumeResult, setResumeResult] = useState<ResumeResult | null>(null);
  const [resumeLoading, setResumeLoading] = useState(false);

  // job search
  const [jobLocation, setJobLocation] = useState('');
  const [jobKeyword, setJobKeyword] = useState('');
  const [jobLoading, setJobLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [jobSearched, setJobSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showJobSearch, setShowJobSearch] = useState(false);

  // ── resume upload ──────────────────────────────────────────────────────────
  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error('Please select a resume PDF first!');
      return;
    }
    setResumeLoading(true);
    try {
      const res = await uploadResumeApi(file);
      setResumeResult(res.data);
      toast.success('Resume analyzed successfully!');
      // pre-fill keyword from first extracted skill
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
  const pagedJobs = jobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const matchCount = jobs.filter((j) => j.locationMatch).length;

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
   {!resumeResult &&<div
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
            color: PURPLE,
            marginBottom: '24px',
          }}
        >
          <FileText size={13} /> NLP Analysis
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
          <span style={{ color: PURPLE }}>Analyzer</span>
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
          compatibility feedback — then instantly find jobs that match your profile.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '13px 28px',
            borderRadius: '10px',
            background: PURPLE,
            color: '#fff',
            fontSize: '14px',
            fontWeight: 600,
            border: 'none',
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(124,58,237,0.3)',
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = PURPLE_HOVER)}
          onMouseLeave={(e) => (e.currentTarget.style.background = PURPLE)}
        >
          Analyze My Resume <Upload size={15} />
        </button>
      </div>}

      {/* Highlights — visible until first analysis */}
      {!resumeResult && (
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
                    background: PURPLE_LIGHT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <Icon size={18} style={{ color: PURPLE }} />
                </div>
                <p
                  style={{
                    fontSize: '14px',
                    fontWeight: 600,
                    color: '#0f1729',
                    marginBottom: '6px',
                  }}
                >
                  {label}
                </p>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Resume Results (inline) ─────────────────────────────────────────── */}
      {resumeResult && (
        <div
          style={{ padding: '40px 48px', maxWidth: '1000px', margin: '0 auto' }}
          className="page-pad"
        >
          {/* Section header */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '24px',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1729' }}>
                Analysis Results
              </h2>
              <p style={{ fontSize: '13px', color: '#6b7280', marginTop: '4px' }}>
                {file?.name} · {resumeResult.extractedSkills?.length ?? 0} skills found
              </p>
            </div>
            <button
              onClick={() => setOpen(true)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 14px',
                borderRadius: '8px',
                background: PURPLE_LIGHT,
                color: PURPLE,
                fontSize: '12px',
                fontWeight: 600,
                border: '1px solid rgba(124,58,237,0.2)',
                cursor: 'pointer',
                transition: 'background 150ms',
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#ede9fe')}
              onMouseLeave={(e) =>
                ((e.currentTarget as HTMLElement).style.background = PURPLE_LIGHT)
              }
            >
              <Upload size={13} /> Re-analyze
            </button>
          </div>

          {/* Two-column result cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '16px',
              marginBottom: '16px',
            }}
            className="resume-results-grid"
          >
            {/* Skills */}
            <div
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: '12px',
                padding: '20px',
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '7px',
                    background: 'rgba(124,58,237,0.08)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Sparkles size={13} style={{ color: PURPLE }} />
                </div>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1729' }}>
                  Extracted Skills
                </p>
                <span
                  style={{
                    marginLeft: 'auto',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: PURPLE,
                    background: PURPLE_LIGHT,
                    padding: '2px 8px',
                    borderRadius: '9999px',
                  }}
                >
                  {resumeResult.extractedSkills?.length ?? 0}
                </span>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {resumeResult.extractedSkills?.length ? (
                  resumeResult.extractedSkills.map((s, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '12px',
                        padding: '3px 10px',
                        borderRadius: '9999px',
                        background: 'rgba(124,58,237,0.07)',
                        color: PURPLE,
                        border: '1px solid rgba(124,58,237,0.18)',
                        cursor: 'pointer',
                        transition: 'background 150ms',
                      }}
                      onClick={() => setJobKeyword(s)}
                      title="Click to use as job keyword"
                    >
                      {s}
                    </span>
                  ))
                ) : (
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>None found.</p>
                )}
              </div>
              <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '10px' }}>
                Click any skill to use it as a job keyword
              </p>
            </div>

            {/* Experience + Snippet */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '7px',
                      background: 'rgba(124,58,237,0.08)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <CheckCircle size={13} style={{ color: PURPLE }} />
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1729' }}>
                    Experience Years
                  </p>
                </div>
                <p style={{ fontSize: '13px', color: '#374151' }}>
                  {resumeResult.experienceYears?.join(', ') || 'Not detected'}
                </p>
              </div>
              <div
                style={{
                  background: '#fff',
                  border: '1px solid #e5e7eb',
                  borderRadius: '12px',
                  padding: '20px',
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '12px',
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '7px',
                      background: '#f3f4f6',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <FileText size={13} style={{ color: '#6b7280' }} />
                  </div>
                  <p style={{ fontSize: '13px', fontWeight: 600, color: '#0f1729' }}>
                    Resume Snippet
                  </p>
                </div>
                <pre
                  style={{
                    fontSize: '11px',
                    lineHeight: 1.7,
                    maxHeight: '120px',
                    overflowY: 'auto',
                    whiteSpace: 'pre-wrap',
                    color: '#6b7280',
                    margin: 0,
                  }}
                >
                  {resumeResult.rawText?.slice(0, 400)}
                  {(resumeResult.rawText?.length ?? 0) > 400 ? '…' : ''}
                </pre>
              </div>
            </div>
          </div>

          {/* ── Job Matching Banner ─────────────────────────────────────────────── */}
          <div
            style={{
              background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 100%)',
              border: '1px solid rgba(34,85,236,0.15)',
              borderRadius: '14px',
              padding: '24px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '16px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    borderRadius: '12px',
                    background: BLUE,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    boxShadow: '0 4px 12px rgba(34,85,236,0.25)',
                  }}
                >
                  <Briefcase size={20} style={{ color: '#fff' }} />
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: 700,
                      color: '#0f1729',
                      marginBottom: '3px',
                    }}
                  >
                    Find Jobs Matching Your Resume
                  </p>
                  <p style={{ fontSize: '12px', color: '#6b7280' }}>
                    We detected{' '}
                    <strong style={{ color: BLUE }}>
                      {resumeResult.extractedSkills?.length ?? 0} skills
                    </strong>{' '}
                    — search live LinkedIn jobs pre-filled with your top skill.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowJobSearch((s) => !s)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '9px 18px',
                  borderRadius: '9px',
                  background: BLUE,
                  color: '#fff',
                  fontSize: '13px',
                  fontWeight: 600,
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = BLUE_HOVER)
                }
                onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = BLUE)}
              >
                {showJobSearch ? 'Hide' : 'Search Jobs'}
                <ChevronDown
                  size={14}
                  style={{
                    transform: showJobSearch ? 'rotate(180deg)' : 'rotate(0)',
                    transition: 'transform 200ms',
                  }}
                />
              </button>
            </div>

            {/* ── Inline Job Search Form ─────────────────────────────────────── */}
            {showJobSearch && (
              <form
                onSubmit={handleJobSearch}
                style={{
                  marginTop: '20px',
                  paddingTop: '20px',
                  borderTop: '1px solid rgba(34,85,236,0.12)',
                  display: 'flex',
                  gap: '10px',
                  flexWrap: 'wrap',
                  alignItems: 'flex-end',
                }}
              >
                <div style={{ flex: '1 1 200px', minWidth: '160px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Job field
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Search
                      size={13}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      type="text"
                      value={jobKeyword}
                      onChange={(e) => setJobKeyword(e.target.value)}
                      placeholder="e.g. React Developer"
                      required
                      style={{
                        width: '100%',
                        padding: '9px 10px 9px 30px',
                        borderRadius: '8px',
                        border: '1px solid #dde4fb',
                        fontSize: '13px',
                        color: '#0f1729',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                        background: '#fff',
                        transition: 'border-color 150ms',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#dde4fb')}
                    />
                  </div>
                </div>
                <div style={{ flex: '1 1 200px', minWidth: '160px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontSize: '11px',
                      fontWeight: 600,
                      color: '#374151',
                      marginBottom: '5px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Location
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin
                      size={13}
                      style={{
                        position: 'absolute',
                        left: '10px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        color: '#9ca3af',
                        pointerEvents: 'none',
                      }}
                    />
                    <input
                      type="text"
                      value={jobLocation}
                      onChange={(e) => setJobLocation(e.target.value)}
                      placeholder="e.g. Bangalore, Mumbai"
                      required
                      style={{
                        width: '100%',
                        padding: '9px 10px 9px 30px',
                        borderRadius: '8px',
                        border: '1px solid #dde4fb',
                        fontSize: '13px',
                        color: '#0f1729',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'inherit',
                        background: '#fff',
                        transition: 'border-color 150ms',
                      }}
                      onFocus={(e) => (e.currentTarget.style.borderColor = BLUE)}
                      onBlur={(e) => (e.currentTarget.style.borderColor = '#dde4fb')}
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  disabled={jobLoading}
                  style={{
                    padding: '9px 20px',
                    borderRadius: '8px',
                    background: jobLoading ? '#93a5f5' : BLUE,
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: jobLoading ? 'not-allowed' : 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '7px',
                    transition: 'background 150ms',
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    if (!jobLoading) (e.currentTarget as HTMLElement).style.background = BLUE_HOVER;
                  }}
                  onMouseLeave={(e) => {
                    if (!jobLoading) (e.currentTarget as HTMLElement).style.background = BLUE;
                  }}
                >
                  {jobLoading ? (
                    <>
                      <Loader2 size={13} style={{ animation: 'spin 1s linear infinite' }} />{' '}
                      Searching...
                    </>
                  ) : (
                    <>
                      <ArrowRight size={13} /> Find Jobs
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* ── Job Results ─────────────────────────────────────────────────── */}
          {jobSearched && (
            <>
              {/* Jobs header */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '16px',
                  flexWrap: 'wrap',
                  gap: '10px',
                }}
              >
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#0f1729' }}>
                    {jobs.length} Jobs Found
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      alignItems: 'center',
                      gap: '6px',
                      marginTop: '4px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#6b7280',
                        margin: 0,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <Search size={11} />{' '}
                      <strong style={{ color: '#374151' }}>{jobKeyword}</strong>
                      &nbsp;·&nbsp;
                      <MapPin size={11} />{' '}
                      <strong style={{ color: '#374151' }}>{jobLocation}</strong>
                    </p>
                    {matchCount > 0 && (
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '3px',
                          padding: '1px 7px',
                          borderRadius: '9999px',
                          background: '#f0fdf4',
                          border: '1px solid #bbf7d0',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#16a34a',
                        }}
                      >
                        <MapPin size={9} /> {matchCount} in {jobLocation}
                      </span>
                    )}
                    {jobs.length - matchCount > 0 && (
                      <span
                        style={{
                          display: 'inline-flex',
                          padding: '1px 7px',
                          borderRadius: '9999px',
                          background: '#fefce8',
                          border: '1px solid #fde68a',
                          fontSize: '11px',
                          fontWeight: 600,
                          color: '#92400e',
                        }}
                      >
                        {jobs.length - matchCount} nearby
                      </span>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => {
                    setJobSearched(false);
                    setJobs([]);
                  }}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                    padding: '7px 12px',
                    borderRadius: '7px',
                    background: '#fff',
                    color: '#6b7280',
                    fontSize: '12px',
                    border: '1px solid #e5e7eb',
                    cursor: 'pointer',
                  }}
                >
                  <SlidersHorizontal size={12} /> New search
                </button>
              </div>

              {jobs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '48px 0' }}>
                  <p
                    style={{
                      fontSize: '14px',
                      fontWeight: 600,
                      color: '#0f1729',
                      marginBottom: '6px',
                    }}
                  >
                    No jobs found
                  </p>
                  <p style={{ fontSize: '13px', color: '#6b7280' }}>
                    Try a different keyword or location.
                  </p>
                </div>
              ) : (
                <>
                  <div
                    style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '14px' }}
                    className="job-cards-grid"
                  >
                    {pagedJobs.map((job) => (
                      <ResumeJobCard key={job.id} job={job} searchLocation={jobLocation} />
                    ))}
                  </div>

                  {totalPages > 1 && (
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        marginTop: '28px',
                        flexWrap: 'wrap',
                      }}
                    >
                      <button
                        onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                        disabled={currentPage === 1}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '7px',
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          fontSize: '12px',
                          color: currentPage === 1 ? '#d1d5db' : '#374151',
                          cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                        }}
                      >
                        ← Prev
                      </button>

                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(
                          (p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1,
                        )
                        .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                          if (
                            idx > 0 &&
                            typeof arr[idx - 1] === 'number' &&
                            (p as number) - (arr[idx - 1] as number) > 1
                          )
                            acc.push('...');
                          acc.push(p);
                          return acc;
                        }, [])
                        .map((p, i) =>
                          p === '...' ? (
                            <span key={`e${i}`} style={{ fontSize: '12px', color: '#9ca3af' }}>
                              …
                            </span>
                          ) : (
                            <button
                              key={p}
                              onClick={() => setCurrentPage(p as number)}
                              style={{
                                width: '32px',
                                height: '32px',
                                borderRadius: '7px',
                                border: currentPage === p ? 'none' : '1px solid #e5e7eb',
                                background: currentPage === p ? BLUE : '#fff',
                                color: currentPage === p ? '#fff' : '#374151',
                                fontSize: '12px',
                                fontWeight: currentPage === p ? 700 : 400,
                                cursor: 'pointer',
                              }}
                            >
                              {p}
                            </button>
                          ),
                        )}

                      <button
                        onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                        disabled={currentPage === totalPages}
                        style={{
                          padding: '7px 14px',
                          borderRadius: '7px',
                          border: '1px solid #e5e7eb',
                          background: '#fff',
                          fontSize: '12px',
                          color: currentPage === totalPages ? '#d1d5db' : '#374151',
                          cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                        }}
                      >
                        Next →
                      </button>
                    </div>
                  )}
                  <p
                    style={{
                      textAlign: 'center',
                      marginTop: '10px',
                      fontSize: '11px',
                      color: '#9ca3af',
                    }}
                  >
                    Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                    {Math.min(currentPage * PAGE_SIZE, jobs.length)} of {jobs.length} jobs
                  </p>
                </>
              )}
            </>
          )}
        </div>
      )}

      {/* ── Upload Modal ─────────────────────────────────────────────────────── */}
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
          onClick={(e) => {
            if (e.target === e.currentTarget) setOpen(false);
          }}
        >
          <div
            style={{
              background: '#fff',
              borderRadius: '16px',
              width: '100%',
              maxWidth: '480px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
              overflow: 'hidden',
            }}
          >
            {/* header */}
            <div
              style={{
                padding: '20px 24px',
                borderBottom: '1px solid #f3f4f6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div
                  style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '8px',
                    background: PURPLE_LIGHT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <FileText size={15} style={{ color: PURPLE }} />
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
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* body */}
            <div style={{ padding: '24px' }}>
              <form
                onSubmit={handleUpload}
                style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
              >
                {/* Drop zone */}
                <label
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '140px',
                    borderRadius: '10px',
                    border: '2px dashed #e5e7eb',
                    background: '#f9fafb',
                    cursor: 'pointer',
                    transition: 'border-color 150ms, background 150ms',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = 'rgba(124,58,237,0.4)';
                    (e.currentTarget as HTMLElement).style.background = 'rgba(124,58,237,0.03)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLElement).style.borderColor = '#e5e7eb';
                    (e.currentTarget as HTMLElement).style.background = '#f9fafb';
                  }}
                >
                  {file ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <FaFilePdf size={22} style={{ color: '#dc2626' }} />
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: 500, color: '#0f1729' }}>
                          {file.name}
                        </p>
                        <p style={{ fontSize: '11px', color: '#6b7280' }}>
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div style={{ textAlign: 'center' }}>
                      <FaUpload size={20} style={{ color: PURPLE, margin: '0 auto 8px' }} />
                      <p style={{ fontSize: '13px', fontWeight: 500, color: '#0f1729' }}>
                        Drop your PDF here
                      </p>
                      <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '4px' }}>
                        or click to browse
                      </p>
                    </div>
                  )}
                  <input
                    type="file"
                    accept=".pdf"
                    style={{ display: 'none' }}
                    onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  />
                </label>

                {/* tip */}
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    padding: '10px 12px',
                    borderRadius: '8px',
                    background: PURPLE_LIGHT,
                    border: '1px solid rgba(124,58,237,0.15)',
                  }}
                >
                  <Sparkles size={13} style={{ color: PURPLE, flexShrink: 0, marginTop: '1px' }} />
                  <p style={{ fontSize: '11px', color: '#374151', lineHeight: 1.6 }}>
                    After analysis, we&apos;ll auto-fill your top skill to help you find matching
                    jobs instantly.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={resumeLoading}
                  style={{
                    width: '100%',
                    padding: '11px',
                    borderRadius: '10px',
                    background: resumeLoading ? '#c4b5fd' : PURPLE,
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: resumeLoading ? 'not-allowed' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    transition: 'background 150ms',
                  }}
                  onMouseEnter={(e) => {
                    if (!resumeLoading)
                      (e.currentTarget as HTMLElement).style.background = PURPLE_HOVER;
                  }}
                  onMouseLeave={(e) => {
                    if (!resumeLoading) (e.currentTarget as HTMLElement).style.background = PURPLE;
                  }}
                >
                  {resumeLoading ? (
                    <>
                      <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />{' '}
                      Analyzing...
                    </>
                  ) : (
                    <>
                      Analyze Resume <ArrowRight size={14} />
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// ─── job card (compact version for this page) ────────────────────────────────
function ResumeJobCard({ job, searchLocation }: { job: Job; searchLocation: string }) {
  const isMatch =
    job.locationMatch ?? job.location.toLowerCase().includes(searchLocation.toLowerCase());
  const initials = job.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      style={{
        background: '#fff',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '16px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px',
        transition: 'box-shadow 200ms, transform 200ms',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 6px 20px rgba(34,85,236,0.1)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '8px',
            background: BLUE_LIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '12px',
            fontWeight: 700,
            color: BLUE,
          }}
        >
          {initials || <Building2 size={14} style={{ color: BLUE }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: '12px',
              fontWeight: 700,
              color: '#0f1729',
              lineHeight: 1.4,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {job.title}
          </p>
          <p
            style={{
              fontSize: '11px',
              color: '#6b7280',
              marginTop: '2px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {job.company}
          </p>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '11px',
            color: '#6b7280',
          }}
        >
          <MapPin size={10} style={{ flexShrink: 0 }} />
          <span
            style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', flex: 1 }}
          >
            {job.location}
          </span>
          <span
            style={{
              flexShrink: 0,
              padding: '1px 5px',
              borderRadius: '9999px',
              fontSize: '10px',
              fontWeight: 600,
              ...(isMatch
                ? { background: '#f0fdf4', border: '1px solid #bbf7d0', color: '#16a34a' }
                : { background: '#fefce8', border: '1px solid #fde68a', color: '#92400e' }),
            }}
          >
            {isMatch ? '✓ Exact' : 'Nearby'}
          </span>
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            fontSize: '10px',
            color: '#9ca3af',
          }}
        >
          <Clock size={9} style={{ flexShrink: 0 }} />
          {job.postedDate}
        </div>
      </div>

      <div style={{ height: '1px', background: '#f3f4f6' }} />

      {job.applyLink ? (
        <a
          href={job.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '5px',
            padding: '7px',
            borderRadius: '7px',
            background: BLUE,
            color: '#fff',
            fontSize: '11px',
            fontWeight: 600,
            textDecoration: 'none',
            marginTop: 'auto',
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = BLUE_HOVER)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = BLUE)}
        >
          Apply on LinkedIn <ExternalLink size={10} />
        </a>
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '7px',
            borderRadius: '7px',
            background: '#f3f4f6',
            color: '#9ca3af',
            fontSize: '11px',
            marginTop: 'auto',
          }}
        >
          Link unavailable
        </div>
      )}
    </div>
  );
}
