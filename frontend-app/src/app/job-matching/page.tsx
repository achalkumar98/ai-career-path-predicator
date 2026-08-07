'use client';
import { useState } from 'react';
import Link from 'next/link';
import {
  Briefcase, MapPin, Building2, Clock, ExternalLink,
  Sparkles, Target, TrendingUp, X, ArrowRight, ArrowLeft,
  Loader2, Search, SlidersHorizontal,
} from 'lucide-react';
import { findJobMatchesApi } from '@/api/jobMatchingApi';
import toast from 'react-hot-toast';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  postedDate: string;
  url: string;
  applyLink: string;
  locationMatch?: boolean;
}

interface SearchCriteria {
  keyword: string;
  location: string;
}

const ACCENT = '#2255ec';
const ACCENT_LIGHT = '#eef2ff';
const ACCENT_HOVER = '#1a44c8';

export default function JobMatching() {
  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [criteria, setCriteria] = useState<SearchCriteria | null>(null);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !location.trim()) {
      toast.error('Please enter both a keyword and a location.');
      return;
    }
    setLoading(true);
    try {
      const res = await findJobMatchesApi(keyword.trim(), location.trim());
      setJobs(res.data.data.jobs ?? []);
      setCriteria(res.data.data.searchCriteria);
      setSearched(true);
      setCurrentPage(1);
      setOpen(false);
      toast.success(`Found ${res.data.data.totalJobs} jobs!`);
    } catch {
      toast.error('Error: Make sure your server is running.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setJobs([]);
    setCriteria(null);
    setSearched(false);
    setKeyword('');
    setLocation('');
    setCurrentPage(1);
  };

  const highlights = [
    { icon: Target, label: 'Keyword Search', desc: 'Search by any role, skill, or technology' },
    { icon: TrendingUp, label: 'Live LinkedIn Jobs', desc: 'Fresh postings scraped in real time' },
    { icon: Sparkles, label: 'Location Filtered', desc: 'Target jobs in your preferred city' },
  ];

  const totalPages = Math.ceil(jobs.length / PAGE_SIZE);
  const pagedJobs = jobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const matchCount = jobs.filter(j => j.locationMatch).length;

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb' }}>

      {/* Back bar */}
      <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '12px 48px' }} className="back-bar">
        <Link href="/homepage" style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none', color: '#374151', fontSize: '13px' }}>
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>

      {/* Hero — hidden once results are loaded */}
      {!searched && (
      <div
        style={{ background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 60%)', borderBottom: '1px solid #e5e7eb', padding: '64px 48px', textAlign: 'center' }}
        className="inner-hero"
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(34,85,236,0.08)', border: '1px solid rgba(34,85,236,0.2)', fontSize: '12px', fontWeight: 600, color: ACCENT, marginBottom: '24px' }}>
          <Briefcase size={13} /> Live Job Matching
        </div>

        <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#0f1729', lineHeight: 1.15, marginBottom: '16px' }} className="hero-title">
          Find Real Jobs<br />
          <span style={{ color: ACCENT }}>From LinkedIn</span>
        </h1>

        <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '560px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          Search live LinkedIn job listings by keyword and location. Get fresh postings scraped in real time — no stale data, no sign-in required.
        </p>

        <button
          onClick={() => setOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', borderRadius: '10px', background: ACCENT, color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(34,85,236,0.3)', transition: 'background 150ms, transform 150ms' }}
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = ACCENT_HOVER; (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ACCENT; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
        >
          <Search size={15} /> Search Jobs
        </button>
      </div>
      )}

      {/* Results */}
      {searched && (
        <div style={{ padding: '40px 48px', maxWidth: '1100px', margin: '0 auto' }} className="page-pad">

          {/* Results header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h2 style={{ fontSize: '18px', fontWeight: 700, color: '#0f1729' }}>
                {jobs.length} Jobs Found
              </h2>
              {criteria && (
                <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
                  <p style={{ fontSize: '13px', color: '#6b7280', display: 'flex', alignItems: 'center', gap: '5px', margin: 0 }}>
                    <Search size={12} />
                    <strong style={{ color: '#374151' }}>{criteria.keyword}</strong>
                    &nbsp;·&nbsp;
                    <MapPin size={12} />
                    <strong style={{ color: '#374151' }}>{criteria.location}</strong>
                  </p>
                  {matchCount > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '9999px', background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '11px', fontWeight: 600, color: '#16a34a' }}>
                      <MapPin size={10} /> {matchCount} in {criteria.location}
                    </span>
                  )}
                  {jobs.length - matchCount > 0 && (
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', padding: '2px 8px', borderRadius: '9999px', background: '#fefce8', border: '1px solid #fde68a', fontSize: '11px', fontWeight: 600, color: '#92400e' }}>
                      {jobs.length - matchCount} nearby
                    </span>
                  )}
                </div>
              )}
            </div>            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                onClick={() => setOpen(true)}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: ACCENT_LIGHT, color: ACCENT, fontSize: '12px', fontWeight: 600, border: `1px solid rgba(34,85,236,0.2)`, cursor: 'pointer', transition: 'background 150ms' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#dde4fb')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = ACCENT_LIGHT)}
              >
                <SlidersHorizontal size={13} /> New Search
              </button>
              <button
                onClick={handleReset}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', background: '#fff', color: '#6b7280', fontSize: '12px', fontWeight: 500, border: '1px solid #e5e7eb', cursor: 'pointer', transition: 'background 150ms' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = '#f9fafb')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = '#fff')}
              >
                <X size={13} /> Clear
              </button>
            </div>
          </div>

          {/* Job cards grid */}
          {jobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: ACCENT_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Briefcase size={24} style={{ color: ACCENT }} />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 600, color: '#0f1729', marginBottom: '8px' }}>No jobs found</p>
              <p style={{ fontSize: '13px', color: '#6b7280', marginBottom: '24px' }}>Try a different keyword or location.</p>
              <button onClick={() => setOpen(true)} style={{ padding: '10px 24px', borderRadius: '8px', background: ACCENT, color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: 'pointer' }}>
                Try Again
              </button>
            </div>
          ) : (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }} className="job-cards-grid">
                {pagedJobs.map((job) => <JobCard key={job.id} job={job} searchLocation={criteria?.location ?? ''} />)}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '36px', flexWrap: 'wrap' }}>

                  {/* Prev */}
                  <button
                    onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === 1}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '12px', fontWeight: 500, color: currentPage === 1 ? '#d1d5db' : '#374151', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', transition: 'background 150ms' }}
                    onMouseEnter={e => { if (currentPage !== 1) (e.currentTarget as HTMLElement).style.background = '#f9fafb'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; }}
                  >
                    ← Prev
                  </button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter(p => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
                    .reduce<(number | '...')[]>((acc, p, idx, arr) => {
                      if (idx > 0 && typeof arr[idx - 1] === 'number' && (p as number) - (arr[idx - 1] as number) > 1) acc.push('...');
                      acc.push(p);
                      return acc;
                    }, [])
                    .map((p, i) =>
                      p === '...' ? (
                        <span key={`ellipsis-${i}`} style={{ fontSize: '12px', color: '#9ca3af', padding: '0 4px' }}>…</span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => { setCurrentPage(p as number); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                          style={{ width: '36px', height: '36px', borderRadius: '8px', border: currentPage === p ? 'none' : '1px solid #e5e7eb', background: currentPage === p ? ACCENT : '#fff', color: currentPage === p ? '#fff' : '#374151', fontSize: '12px', fontWeight: currentPage === p ? 700 : 400, cursor: 'pointer', transition: 'background 150ms' }}
                          onMouseEnter={e => { if (currentPage !== p) (e.currentTarget as HTMLElement).style.background = '#f9fafb'; }}
                          onMouseLeave={e => { if (currentPage !== p) (e.currentTarget as HTMLElement).style.background = '#fff'; }}
                        >
                          {p}
                        </button>
                      )
                    )
                  }

                  {/* Next */}
                  <button
                    onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    disabled={currentPage === totalPages}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #e5e7eb', background: '#fff', fontSize: '12px', fontWeight: 500, color: currentPage === totalPages ? '#d1d5db' : '#374151', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', transition: 'background 150ms' }}
                    onMouseEnter={e => { if (currentPage !== totalPages) (e.currentTarget as HTMLElement).style.background = '#f9fafb'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#fff'; }}
                  >
                    Next →
                  </button>
                </div>
              )}

              {/* Page info */}
              <p style={{ textAlign: 'center', marginTop: '12px', fontSize: '12px', color: '#9ca3af' }}>
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, jobs.length)} of {jobs.length} jobs
              </p>
            </>
          )}
        </div>
      )}

      {/* Highlights — pre-search only */}
      {!searched && (
        <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }} className="page-pad">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }} className="highlights-grid">
            {highlights.map(({ icon: Icon, label, desc }) => (
              <div
                key={label}
                style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', transition: 'box-shadow 200ms, transform 200ms' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
              >
                <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: ACCENT_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                  <Icon size={18} style={{ color: ACCENT }} />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f1729', marginBottom: '6px' }}>{label}</p>
                <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Search Modal */}
      {open && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,41,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '24px' }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false); }}
        >
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '480px', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', overflow: 'hidden' }}>

            {/* Modal header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: ACCENT_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Briefcase size={15} style={{ color: ACCENT }} />
                </div>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>Search Jobs</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af' }}>Live LinkedIn listings</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px', borderRadius: '6px' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = '#374151')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '#9ca3af')}
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '24px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>

                {/* Keyword */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    Job Field
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={keyword}
                      onChange={e => setKeyword(e.target.value)}
                      placeholder="e.g. Datascience, React Developer, AI Engineer"
                      required
                      style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#0f1729', outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms', fontFamily: 'inherit' }}
                      onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                      onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                    />
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 500, color: '#374151', marginBottom: '6px' }}>
                    Location
                  </label>
                  <div style={{ position: 'relative' }}>
                    <MapPin size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af', pointerEvents: 'none' }} />
                    <input
                      type="text"
                      value={location}
                      onChange={e => setLocation(e.target.value)}
                      placeholder="e.g. Noida, Bangalore, Mumbai"
                      required
                      style={{ width: '100%', padding: '10px 12px 10px 34px', borderRadius: '8px', border: '1px solid #e5e7eb', fontSize: '13px', color: '#0f1729', outline: 'none', boxSizing: 'border-box', transition: 'border-color 150ms', fontFamily: 'inherit' }}
                      onFocus={e => (e.currentTarget.style.borderColor = ACCENT)}
                      onBlur={e => (e.currentTarget.style.borderColor = '#e5e7eb')}
                    />
                  </div>
                </div>

                {/* Note */}
                <div style={{ display: 'flex', gap: '8px', padding: '10px 12px', borderRadius: '8px', background: ACCENT_LIGHT, border: `1px solid rgba(34,85,236,0.15)` }}>
                  <Sparkles size={13} style={{ color: ACCENT, flexShrink: 0, marginTop: '1px' }} />
                  <p style={{ fontSize: '11px', color: '#374151', lineHeight: 1.6 }}>
                    This search scrapes live LinkedIn listings — it may take 15–30 seconds. Please wait after clicking.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  style={{ width: '100%', padding: '11px', borderRadius: '10px', background: loading ? '#93a5f5' : ACCENT, color: '#fff', fontSize: '13px', fontWeight: 600, border: 'none', cursor: loading ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'background 150ms' }}
                  onMouseEnter={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = ACCENT_HOVER; }}
                  onMouseLeave={e => { if (!loading) (e.currentTarget as HTMLElement).style.background = ACCENT; }}
                >
                  {loading ? (
                    <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Searching LinkedIn...</>
                  ) : (
                    <>Search Jobs <ArrowRight size={14} /></>
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


function JobCard({ job, searchLocation }: { job: Job; searchLocation: string }) {
  const isLocationMatch = job.locationMatch ??
    job.location.toLowerCase().includes(searchLocation.toLowerCase());
  const initials = job.company
    .split(' ')
    .slice(0, 2)
    .map(w => w[0])
    .join('')
    .toUpperCase();

  return (
    <div
      style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '14px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', transition: 'box-shadow 200ms, transform 200ms', height: '100%' }}
      onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(34,85,236,0.1)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
    >
      {/* Card top */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        {/* Company avatar */}
        <div style={{ width: '42px', height: '42px', borderRadius: '10px', background: ACCENT_LIGHT, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '13px', fontWeight: 700, color: ACCENT }}>
          {initials || <Building2 size={16} style={{ color: ACCENT }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ fontSize: '13px', fontWeight: 700, color: '#0f1729', marginBottom: '3px', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {job.title}
          </p>
          <p style={{ fontSize: '12px', color: '#6b7280', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {job.company}
          </p>
        </div>
      </div>

      {/* Location + time */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '12px', color: '#6b7280' }}>
          <MapPin size={11} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{job.location}</span>
          {isLocationMatch ? (
            <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', gap: '3px', padding: '1px 6px', borderRadius: '9999px', background: '#f0fdf4', border: '1px solid #bbf7d0', fontSize: '10px', fontWeight: 600, color: '#16a34a' }}>
              ✓ Exact
            </span>
          ) : (
            <span style={{ flexShrink: 0, display: 'inline-flex', alignItems: 'center', padding: '1px 6px', borderRadius: '9999px', background: '#fefce8', border: '1px solid #fde68a', fontSize: '10px', fontWeight: 600, color: '#92400e' }}>
              Nearby
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: '#9ca3af' }}>
          <Clock size={11} style={{ flexShrink: 0 }} />
          {job.postedDate}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: '#f3f4f6' }} />

      {/* Apply button */}
      {job.applyLink ? (
        <a
          href={job.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '9px 14px', borderRadius: '8px', background: ACCENT, color: '#fff', fontSize: '12px', fontWeight: 600, textDecoration: 'none', transition: 'background 150ms' }}
          onMouseEnter={e => ((e.currentTarget as HTMLElement).style.background = ACCENT_HOVER)}
          onMouseLeave={e => ((e.currentTarget as HTMLElement).style.background = ACCENT)}
        >
          Apply on LinkedIn <ExternalLink size={11} />
        </a>
      ) : (
        <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '9px 14px', borderRadius: '8px', background: '#f3f4f6', color: '#9ca3af', fontSize: '12px', fontWeight: 500 }}>
          Link unavailable
        </div>
      )}
    </div>
  );
}
