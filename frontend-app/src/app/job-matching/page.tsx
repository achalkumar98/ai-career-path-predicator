'use client';
import { useTheme } from '@/context/ThemeContext';
import { useState, useMemo, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Briefcase,
  MapPin,
  Building2,
  Clock,
  ExternalLink,
  Sparkles,
  Target,
  TrendingUp,
  X,
  ArrowRight,
  ArrowLeft,
  Loader2,
  Search,
  SlidersHorizontal,
  Filter,
  ChevronLeft,
  ChevronRight,
  CalendarDays,
  Check,
} from 'lucide-react';
import { findJobMatchesApi, JobFilterParams } from '@/api/jobMatchingApi';
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

type RecencyOption = 'all' | '1d' | '3d' | '7d' | '14d' | '30d';

interface FilterState {
  recency: RecencyOption;
  dateFrom: Date | null;
  dateTo: Date | null;
}

const ACCENT = '#2255ec';
const ACCENT_LIGHT = '#eef2ff';
const ACCENT_HOVER = '#1a44c8';

// ─── Parse LinkedIn relative date string → approximate Date ──────────────────
function parsePostedDate(raw: string): Date {
  const now = new Date();
  const lower = (raw || '').toLowerCase().trim();

  if (!lower || lower === 'recently posted' || lower === 'just now' || lower === 'today')
    return now;

  const num = parseInt(lower.match(/\d+/)?.[0] ?? '0', 10);

  if (lower.includes('minute') || lower.includes('hour')) return now;
  if (lower.includes('day')) {
    const d = new Date(now);
    d.setDate(d.getDate() - num);
    return d;
  }
  if (lower.includes('week')) {
    const d = new Date(now);
    d.setDate(d.getDate() - num * 7);
    return d;
  }
  if (lower.includes('month')) {
    const d = new Date(now);
    d.setMonth(d.getMonth() - num);
    return d;
  }
  if (lower.includes('year')) {
    const d = new Date(now);
    d.setFullYear(d.getFullYear() - num);
    return d;
  }
  return now;
}

// ─── Recency options config ──────────────────────────────────────────────────
const RECENCY_OPTIONS: { value: RecencyOption; label: string; days: number | null }[] = [
  { value: 'all', label: 'All time', days: null },
  { value: '1d', label: 'Last 24 hours', days: 1 },
  { value: '3d', label: 'Last 3 days', days: 3 },
  { value: '7d', label: 'Last 7 days', days: 7 },
  { value: '14d', label: 'Last 2 weeks', days: 14 },
  { value: '30d', label: 'Last 30 days', days: 30 },
];

// ─── Mini calendar helpers ───────────────────────────────────────────────────
const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const DAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
function stripTime(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

// ─── Mini Calendar component ─────────────────────────────────────────────────
function MiniCalendar({
  value,
  onChange,
  minDate,
  maxDate,
  isDark,
}: {
  value: Date | null;
  onChange: (d: Date) => void;
  minDate?: Date | null;
  maxDate?: Date | null;
  isDark: boolean;
}) {
  const today = stripTime(new Date());
  const init = value ? stripTime(value) : today;
  const [viewYear, setViewYear] = useState(init.getFullYear());
  const [viewMonth, setViewMonth] = useState(init.getMonth());

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstWeekDay = getFirstDayOfMonth(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstWeekDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const bg = isDark ? '#0f1117' : '#fff';
  const bdr = isDark ? '#272d3d' : '#e5e7eb';
  const txt = isDark ? '#f1f5f9' : '#0f1729';
  const mute = isDark ? '#475569' : '#9ca3af';
  const hov = isDark ? '#1e2844' : '#eef2ff';

  return (
    <div
      style={{
        background: bg,
        border: `1px solid ${bdr}`,
        borderRadius: '12px',
        padding: '16px',
        width: '272px',
        userSelect: 'none',
      }}
    >
      {/* nav row */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '12px',
        }}
      >
        <button
          onClick={() => {
            if (viewMonth === 0) {
              setViewMonth(11);
              setViewYear((y) => y - 1);
            } else setViewMonth((m) => m - 1);
          }}
          style={{
            background: 'none',
            border: `1px solid ${bdr}`,
            borderRadius: '7px',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            color: mute,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={14} />
        </button>
        <span style={{ fontSize: '13px', fontWeight: 700, color: txt }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button
          onClick={() => {
            if (viewMonth === 11) {
              setViewMonth(0);
              setViewYear((y) => y + 1);
            } else setViewMonth((m) => m + 1);
          }}
          style={{
            background: 'none',
            border: `1px solid ${bdr}`,
            borderRadius: '7px',
            width: '28px',
            height: '28px',
            cursor: 'pointer',
            color: mute,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronRight size={14} />
        </button>
      </div>
      {/* weekday headers */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,1fr)',
          gap: '2px',
          marginBottom: '6px',
        }}
      >
        {DAYS.map((d) => (
          <div
            key={d}
            style={{
              textAlign: 'center',
              fontSize: '10px',
              fontWeight: 700,
              color: mute,
              padding: '4px 0',
            }}
          >
            {d}
          </div>
        ))}
      </div>
      {/* day cells */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px' }}>
        {cells.map((day, i) => {
          if (!day) return <div key={`e${i}`} />;
          const date = new Date(viewYear, viewMonth, day);
          const stripped = stripTime(date);
          const selected = value ? isSameDay(stripped, stripTime(value)) : false;
          const isToday = isSameDay(stripped, today);
          const disabled =
            (minDate && stripped < stripTime(minDate)) ||
            (maxDate && stripped > stripTime(maxDate));
          return (
            <button
              key={day}
              disabled={!!disabled}
              onClick={() => !disabled && onChange(date)}
              style={{
                height: '34px',
                borderRadius: '8px',
                fontSize: '12px',
                border: 'none',
                cursor: disabled ? 'not-allowed' : 'pointer',
                fontWeight: selected || isToday ? 700 : 400,
                background: selected
                  ? ACCENT
                  : isToday
                    ? isDark
                      ? '#1e2844'
                      : ACCENT_LIGHT
                    : 'transparent',
                color: selected
                  ? '#fff'
                  : disabled
                    ? isDark
                      ? '#2d3748'
                      : '#d1d5db'
                    : isToday
                      ? ACCENT
                      : txt,
                transition: 'background 120ms',
              }}
              onMouseEnter={(e) => {
                if (!disabled && !selected) (e.currentTarget as HTMLElement).style.background = hov;
              }}
              onMouseLeave={(e) => {
                if (!selected)
                  (e.currentTarget as HTMLElement).style.background = isToday
                    ? isDark
                      ? '#1e2844'
                      : ACCENT_LIGHT
                    : 'transparent';
              }}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── Filter Panel (slide-in drawer) ─────────────────────────────────────────
function FilterPanel({
  open,
  onClose,
  filter,
  onApply,
  totalJobs,
  filteredCount,
  isDark,
  isLoading,
}: {
  open: boolean;
  onClose: () => void;
  filter: FilterState;
  onApply: (f: FilterState) => void;
  totalJobs: number;
  filteredCount: number;
  isDark: boolean;
  isLoading: boolean;
}) {
  const [local, setLocal] = useState<FilterState>(filter);
  const [fromOpen, setFromOpen] = useState(false);
  const [toOpen, setToOpen] = useState(false);

  // sync whenever panel opens
  useEffect(() => {
    if (open) setLocal(filter);
  }, [open, filter]);

  const panelBg = isDark ? '#1a1f2e' : '#ffffff';
  const bdr = isDark ? '#272d3d' : '#e5e7eb';
  const txt = isDark ? '#f1f5f9' : '#0f1729';
  const sub = isDark ? '#64748b' : '#9ca3af';
  const body = isDark ? '#cbd5e1' : '#374151';
  const sectionBg = isDark ? '#0f1117' : '#f9fafb';
  const chipBg = isDark ? '#0f1117' : '#f3f4f6';
  const chipBdr = isDark ? '#272d3d' : '#e5e7eb';

  const hasActiveFilter = local.recency !== 'all' || local.dateFrom || local.dateTo;

  const handleReset = () => setLocal({ recency: 'all', dateFrom: null, dateTo: null });

  const formatDate = (d: Date | null) =>
    d ? d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '';

  return (
    <>
      {/* backdrop */}
      {open && (
        <div
          onClick={() => {
            if (!isLoading) onClose();
          }}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(15,23,41,0.45)',
            backdropFilter: 'blur(3px)',
            zIndex: 299,
          }}
        />
      )}

      {/* drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          height: '100vh',
          width: '380px',
          maxWidth: '95vw',
          background: panelBg,
          borderLeft: `1px solid ${bdr}`,
          boxShadow: isDark ? '-16px 0 48px rgba(0,0,0,0.5)' : '-16px 0 48px rgba(0,0,0,0.12)',
          zIndex: 300,
          display: 'flex',
          flexDirection: 'column',
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 280ms cubic-bezier(0.4,0,0.2,1)',
        }}
      >
        {/* header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: `1px solid ${bdr}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '34px',
                height: '34px',
                borderRadius: '9px',
                background: isDark ? '#1e2844' : ACCENT_LIGHT,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Filter size={15} style={{ color: ACCENT }} />
            </div>
            <div>
              <p style={{ fontSize: '14px', fontWeight: 700, color: txt }}>Filter Jobs</p>
              <p style={{ fontSize: '11px', color: sub }}>
                {filteredCount} of {totalJobs} jobs match
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (!isLoading) onClose();
            }}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: sub,
              padding: '4px',
              borderRadius: '6px',
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', position: 'relative' }}>
          {/* loading overlay — sits on top of content while fetching */}
          {isLoading && (
            <div
              style={{
                position: 'absolute',
                inset: 0,
                zIndex: 10,
                background: isDark ? 'rgba(15,17,23,0.75)' : 'rgba(255,255,255,0.8)',
                backdropFilter: 'blur(3px)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '14px',
              }}
            >
              <div
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '14px',
                  background: isDark ? '#1e2844' : ACCENT_LIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 4px 16px rgba(34,85,236,0.25)',
                }}
              >
                <Loader2
                  size={22}
                  style={{ color: ACCENT, animation: 'spin 1s linear infinite' }}
                />
              </div>
              <div style={{ textAlign: 'center' }}>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: 700,
                    color: isDark ? '#f1f5f9' : '#0f1729',
                    marginBottom: '4px',
                  }}
                >
                  Fetching jobs…
                </p>
                <p style={{ fontSize: '11px', color: isDark ? '#64748b' : '#9ca3af' }}>
                  Scraping LinkedIn with your filter
                </p>
              </div>
            </div>
          )}

          {/* ── Recency quick-pick ─────────────────────────────── */}
          <div style={{ marginBottom: '28px' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}
            >
              <Clock size={13} style={{ color: ACCENT }} />
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: body,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Posted Within
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              {RECENCY_OPTIONS.map((opt) => {
                const active = local.recency === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() =>
                      setLocal((s) => ({ ...s, recency: opt.value, dateFrom: null, dateTo: null }))
                    }
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '10px 14px',
                      borderRadius: '9px',
                      border: `1px solid ${active ? ACCENT : chipBdr}`,
                      background: active ? (isDark ? '#1e2844' : ACCENT_LIGHT) : chipBg,
                      cursor: 'pointer',
                      transition: 'all 150ms',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        fontWeight: active ? 600 : 400,
                        color: active ? ACCENT : body,
                      }}
                    >
                      {opt.label}
                    </span>
                    {active && (
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          borderRadius: '50%',
                          background: ACCENT,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}
                      >
                        <Check size={10} style={{ color: '#fff' }} />
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* ── Custom date range ──────────────────────────────── */}
          <div style={{ marginBottom: '8px' }}>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}
            >
              <CalendarDays size={13} style={{ color: ACCENT }} />
              <p
                style={{
                  fontSize: '12px',
                  fontWeight: 700,
                  color: body,
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                }}
              >
                Custom Date Range
              </p>
            </div>

            <p style={{ fontSize: '11px', color: sub, marginBottom: '12px', lineHeight: 1.6 }}>
              Select a date range to show jobs posted between those dates. Overrides the quick-pick
              above.
            </p>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '10px',
                marginBottom: '14px',
              }}
            >
              {/* From */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: sub,
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  From
                </label>
                <button
                  onClick={() => {
                    setFromOpen((o) => !o);
                    setToOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${local.dateFrom ? ACCENT : chipBdr}`,
                    background: local.dateFrom ? (isDark ? '#1e2844' : ACCENT_LIGHT) : chipBg,
                    fontSize: '12px',
                    color: local.dateFrom ? ACCENT : sub,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: local.dateFrom ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CalendarDays size={12} />
                  {local.dateFrom ? formatDate(local.dateFrom) : 'Pick date'}
                </button>
              </div>
              {/* To */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontSize: '11px',
                    fontWeight: 600,
                    color: sub,
                    marginBottom: '6px',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  To
                </label>
                <button
                  onClick={() => {
                    setToOpen((o) => !o);
                    setFromOpen(false);
                  }}
                  style={{
                    width: '100%',
                    padding: '9px 12px',
                    borderRadius: '8px',
                    border: `1px solid ${local.dateTo ? ACCENT : chipBdr}`,
                    background: local.dateTo ? (isDark ? '#1e2844' : ACCENT_LIGHT) : chipBg,
                    fontSize: '12px',
                    color: local.dateTo ? ACCENT : sub,
                    cursor: 'pointer',
                    textAlign: 'left',
                    fontWeight: local.dateTo ? 600 : 400,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <CalendarDays size={12} />
                  {local.dateTo ? formatDate(local.dateTo) : 'Pick date'}
                </button>
              </div>
            </div>

            {/* From calendar */}
            {fromOpen && (
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                <MiniCalendar
                  isDark={isDark}
                  value={local.dateFrom}
                  maxDate={local.dateTo ?? new Date()}
                  onChange={(d) => {
                    setLocal((s) => ({ ...s, dateFrom: d, recency: 'all' }));
                    setFromOpen(false);
                  }}
                />
              </div>
            )}

            {/* To calendar */}
            {toOpen && (
              <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center' }}>
                <MiniCalendar
                  isDark={isDark}
                  value={local.dateTo}
                  minDate={local.dateFrom ?? undefined}
                  maxDate={new Date()}
                  onChange={(d) => {
                    setLocal((s) => ({ ...s, dateTo: d, recency: 'all' }));
                    setToOpen(false);
                  }}
                />
              </div>
            )}

            {/* Range summary pill */}
            {(local.dateFrom || local.dateTo) && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  borderRadius: '8px',
                  background: isDark ? '#1e2844' : ACCENT_LIGHT,
                  border: `1px solid rgba(34,85,236,0.2)`,
                }}
              >
                <span style={{ fontSize: '12px', color: ACCENT, fontWeight: 500 }}>
                  {local.dateFrom ? formatDate(local.dateFrom) : '—'} →{' '}
                  {local.dateTo ? formatDate(local.dateTo) : 'today'}
                </span>
                <button
                  onClick={() => setLocal((s) => ({ ...s, dateFrom: null, dateTo: null }))}
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: ACCENT,
                    padding: '0 0 0 8px',
                    fontSize: '11px',
                    fontWeight: 600,
                  }}
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* active filter info */}
          {hasActiveFilter && (
            <div
              style={{
                marginTop: '20px',
                padding: '10px 14px',
                borderRadius: '9px',
                background: sectionBg,
                border: `1px solid ${bdr}`,
              }}
            >
              <p
                style={{
                  fontSize: '12px',
                  color: body,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <Sparkles size={12} style={{ color: ACCENT }} />
                Filter active · showing&nbsp;
                <strong style={{ color: ACCENT }}>{filteredCount}</strong>
                &nbsp;of {totalJobs} jobs
              </p>
            </div>
          )}
        </div>

        {/* sticky footer */}
        <div
          style={{
            padding: '16px 24px',
            borderTop: `1px solid ${bdr}`,
            display: 'flex',
            gap: '10px',
            flexShrink: 0,
            background: panelBg,
          }}
        >
          <button
            onClick={handleReset}
            style={{
              flex: 1,
              padding: '10px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              border: `1px solid ${bdr}`,
              background: 'transparent',
              color: body,
              transition: 'background 150ms',
              opacity: isLoading ? 0.45 : 1,
            }}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) e.currentTarget.style.background = isDark ? '#272d3d' : '#f3f4f6';
            }}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            Reset
          </button>
          <button
            onClick={() => {
              onApply(local);
              onClose();
            }}
            style={{
              flex: 2,
              padding: '10px',
              borderRadius: '9px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: isLoading ? 'not-allowed' : 'pointer',
              border: 'none',
              background: isLoading ? '#93a5f5' : ACCENT,
              color: '#fff',
              transition: 'background 150ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '7px',
              opacity: isLoading ? 0.85 : 1,
            }}
            disabled={isLoading}
            onMouseEnter={(e) => {
              if (!isLoading) (e.currentTarget as HTMLElement).style.background = ACCENT_HOVER;
            }}
            onMouseLeave={(e) => {
              if (!isLoading)
                (e.currentTarget as HTMLElement).style.background = isLoading ? '#93a5f5' : ACCENT;
            }}
          >
            {isLoading ? (
              <>
                <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />
                Fetching jobs…
              </>
            ) : (
              'Apply Filters'
            )}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────
export default function JobMatching() {
  const { isDark } = useTheme();
  const [open, setOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [criteria, setCriteria] = useState<SearchCriteria | null>(null);
  const [searched, setSearched] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 12;

  const DEFAULT_FILTER: FilterState = { recency: 'all', dateFrom: null, dateTo: null };
  const [appliedFilter, setAppliedFilter] = useState<FilterState>(DEFAULT_FILTER);

  // ── Convert FilterState → JobFilterParams (dates → ISO strings) ────────────
  const toApiFilter = (f: FilterState): JobFilterParams => ({
    recency: f.recency,
    dateFrom: f.dateFrom ? f.dateFrom.toISOString().split('T')[0] : null,
    dateTo: f.dateTo ? f.dateTo.toISOString().split('T')[0] : null,
  });

  // ── Shared fetch helper — called by both first search and Apply Filters ─────
  const fetchJobs = async (
    kw: string,
    loc: string,
    filter: FilterState,
    opts: { resetFilter?: boolean } = {},
  ) => {
    setLoading(true);
    try {
      const res = await findJobMatchesApi(kw.trim(), loc.trim(), toApiFilter(filter));
      setJobs(res.data.data.jobs ?? []);
      setCriteria(res.data.data.searchCriteria);
      setSearched(true);
      setCurrentPage(1);
      if (opts.resetFilter) setAppliedFilter(DEFAULT_FILTER);
      else setAppliedFilter(filter);
      toast.success(`Found ${res.data.data.totalJobs} jobs!`);
    } catch {
      toast.error('Error: Make sure your server is running.');
    } finally {
      setLoading(false);
    }
  };

  // ── derived: jobs after filter ──────────────────────────────────────────────
  const filteredJobs = useMemo(() => {
    const { recency, dateFrom, dateTo } = appliedFilter;
    if (recency === 'all' && !dateFrom && !dateTo) return jobs;

    const now = new Date();

    return jobs.filter((job) => {
      const posted = parsePostedDate(job.postedDate);

      // Custom date range takes priority over recency chip
      if (dateFrom || dateTo) {
        const from = dateFrom ? stripTime(dateFrom) : null;
        const to = dateTo ? new Date(stripTime(dateTo).getTime() + 86399999) : null;
        if (from && posted < from) return false;
        if (to && posted > to) return false;
        return true;
      }

      // Recency chip
      const opt = RECENCY_OPTIONS.find((o) => o.value === recency);
      if (!opt || opt.days === null) return true;
      const cutoff = new Date(now);
      cutoff.setDate(cutoff.getDate() - opt.days);
      return posted >= cutoff;
    });
  }, [jobs, appliedFilter]);

  const isFilterActive =
    appliedFilter.recency !== 'all' ||
    appliedFilter.dateFrom !== null ||
    appliedFilter.dateTo !== null;

  const totalPages = Math.ceil(filteredJobs.length / PAGE_SIZE);
  const pagedJobs = filteredJobs.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  const matchCount = filteredJobs.filter((j) => j.locationMatch).length;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!keyword.trim() || !location.trim()) {
      toast.error('Please enter both a keyword and a location.');
      return;
    }
    // Close modal immediately so user sees the page loader
    setOpen(false);
    // First search always resets the filter to 'all'
    await fetchJobs(keyword, location, DEFAULT_FILTER, { resetFilter: true });
  };

  const handleReset = () => {
    setJobs([]);
    setCriteria(null);
    setSearched(false);
    setKeyword('');
    setLocation('');
    setCurrentPage(1);
    setAppliedFilter(DEFAULT_FILTER);
  };

  const highlights = [
    { icon: Target, label: 'Keyword Search', desc: 'Search by any role, skill, or technology' },
    { icon: TrendingUp, label: 'Live LinkedIn Jobs', desc: 'Fresh postings scraped in real time' },
    { icon: Sparkles, label: 'Location Filtered', desc: 'Target jobs in your preferred city' },
  ];

  // dark-mode colour tokens for results header
  const hTxt = isDark ? '#f1f5f9' : '#0f1729';
  const hSub = isDark ? '#94a3b8' : '#6b7280';
  const hStr = isDark ? '#e2e8f0' : '#374151';

  return (
    <div
      style={{
        minHeight: 'calc(100vh - 56px)',
        background: isDark ? '#141720' : '#f9fafb',
        transition: 'background 300ms',
      }}
    >
      {/* ── Full-page loading overlay ─────────────────────────────────────── */}
      {loading && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 400,
          background: isDark ? 'rgba(10,12,18,0.82)' : 'rgba(249,250,251,0.88)',
          backdropFilter: 'blur(6px)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '20px',
        }}>
          {/* spinner ring */}
          <div style={{ position: 'relative', width: '72px', height: '72px' }}>
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: `3px solid ${isDark ? '#1e2844' : '#e0e7ff'}`,
            }} />
            <div style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '3px solid transparent',
              borderTopColor: ACCENT,
              animation: 'spin 0.8s linear infinite',
            }} />
            <div style={{
              position: 'absolute', inset: '14px', borderRadius: '50%',
              background: isDark ? '#1e2844' : ACCENT_LIGHT,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Briefcase size={18} style={{ color: ACCENT }} />
            </div>
          </div>

          {/* text */}
          <div style={{ textAlign: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 700,
                        color: isDark ? '#f1f5f9' : '#0f1729', marginBottom: '6px' }}>
              Fetching Jobs…
            </p>
            <p style={{ fontSize: '13px', color: isDark ? '#64748b' : '#9ca3af', lineHeight: 1.6 }}>
              Scraping live LinkedIn listings
              {isFilterActive ? ' with your filter applied' : ''}
              <br />This may take 15–30 seconds
            </p>
          </div>

          {/* animated dots */}
          <div style={{ display: 'flex', gap: '6px' }}>
            {[0, 1, 2].map(i => (
              <span key={i} style={{
                width: '8px', height: '8px', borderRadius: '50%',
                background: ACCENT, display: 'inline-block',
                animation: `loadBounce 1.2s ${i * 0.2}s ease-in-out infinite`,
              }} />
            ))}
          </div>
        </div>
      )}
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

      {/* Hero — hidden once results are loaded */}
      {!searched && (
        <div
          style={{
            background: 'linear-gradient(135deg, #eef2ff 0%, #f0fdf4 60%)',
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
              color: ACCENT,
              marginBottom: '24px',
            }}
          >
            <Briefcase size={13} /> Live Job Matching
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
            Find Real Jobs
            <br />
            <span style={{ color: ACCENT }}>From LinkedIn</span>
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
            Search live LinkedIn job listings by keyword and location. Get fresh postings scraped in
            real time — no stale data, no sign-in required.
          </p>
          <button
            onClick={() => setOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '13px 28px',
              borderRadius: '10px',
              background: ACCENT,
              color: '#fff',
              fontSize: '14px',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(34,85,236,0.3)',
              transition: 'background 150ms, transform 150ms',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = ACCENT_HOVER;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = ACCENT;
              (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
            }}
          >
            <Search size={15} /> Search Jobs
          </button>
        </div>
      )}

      {/* Results */}
      {searched && (
        <div
          style={{ padding: '40px 48px', maxWidth: '1100px', margin: '0 auto' }}
          className="page-pad"
        >
          {/* Results header */}
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
            {/* Left: count + criteria */}
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <h2 style={{ fontSize: '18px', fontWeight: 700, color: hTxt }}>
                  {filteredJobs.length} Jobs
                  {isFilterActive && (
                    <span
                      style={{ fontSize: '13px', fontWeight: 400, color: hSub, marginLeft: '6px' }}
                    >
                      (filtered from {jobs.length})
                    </span>
                  )}
                </h2>
              </div>
              {criteria && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    alignItems: 'center',
                    gap: '8px',
                    marginTop: '6px',
                  }}
                >
                  <p
                    style={{
                      fontSize: '13px',
                      color: hSub,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '5px',
                      margin: 0,
                    }}
                  >
                    <Search size={12} />
                    <strong style={{ color: hStr }}>{criteria.keyword}</strong>
                    &nbsp;·&nbsp;
                    <MapPin size={12} />
                    <strong style={{ color: hStr }}>{criteria.location}</strong>
                  </p>
                  {matchCount > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: '#f0fdf4',
                        border: '1px solid #bbf7d0',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#16a34a',
                      }}
                    >
                      <MapPin size={10} /> {matchCount} in {criteria.location}
                    </span>
                  )}
                  {filteredJobs.length - matchCount > 0 && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: '#fefce8',
                        border: '1px solid #fde68a',
                        fontSize: '11px',
                        fontWeight: 600,
                        color: '#92400e',
                      }}
                    >
                      {filteredJobs.length - matchCount} nearby
                    </span>
                  )}
                  {/* active filter badge */}
                  {isFilterActive && (
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '2px 8px',
                        borderRadius: '9999px',
                        background: isDark ? '#1e2844' : ACCENT_LIGHT,
                        border: `1px solid rgba(34,85,236,0.25)`,
                        fontSize: '11px',
                        fontWeight: 600,
                        color: ACCENT,
                      }}
                    >
                      <Filter size={9} /> Filter on
                      <button
                        onClick={() =>
                          fetchJobs(keyword, location, DEFAULT_FILTER, { resetFilter: true })
                        }
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: ACCENT,
                          padding: '0 0 0 4px',
                          fontSize: '11px',
                          fontWeight: 700,
                          lineHeight: 1,
                        }}
                      >
                        ✕
                      </button>
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Right: action buttons */}
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {/* Filter button */}
              <button
                onClick={() => setFilterOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: isFilterActive ? ACCENT : isDark ? '#1a1f2e' : '#fff',
                  color: isFilterActive ? '#fff' : isDark ? '#94a3b8' : '#374151',
                  fontSize: '12px',
                  fontWeight: 600,
                  border: `1px solid ${isFilterActive ? ACCENT : isDark ? '#272d3d' : '#e5e7eb'}`,
                  cursor: 'pointer',
                  transition: 'all 150ms',
                  boxShadow: isFilterActive ? '0 2px 8px rgba(34,85,236,0.3)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isFilterActive) {
                    (e.currentTarget as HTMLElement).style.background = isDark
                      ? '#272d3d'
                      : '#f3f4f6';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isFilterActive) {
                    (e.currentTarget as HTMLElement).style.background = isDark ? '#1a1f2e' : '#fff';
                  }
                }}
              >
                <Filter size={13} />
                Filter
                {isFilterActive && (
                  <span
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      background: 'rgba(255,255,255,0.25)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '10px',
                      fontWeight: 700,
                    }}
                  >
                    1
                  </span>
                )}
              </button>

              {/* New Search */}
              <button
                onClick={() => setOpen(true)}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: ACCENT_LIGHT,
                  color: ACCENT,
                  fontSize: '12px',
                  fontWeight: 600,
                  border: `1px solid rgba(34,85,236,0.2)`,
                  cursor: 'pointer',
                  transition: 'background 150ms',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = '#dde4fb')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = ACCENT_LIGHT)
                }
              >
                <SlidersHorizontal size={13} /> New Search
              </button>

              {/* Clear */}
              <button
                onClick={handleReset}
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '8px',
                  background: isDark ? '#1a1f2e' : '#fff',
                  color: isDark ? '#94a3b8' : '#6b7280',
                  fontSize: '12px',
                  fontWeight: 500,
                  border: `1px solid ${isDark ? '#272d3d' : '#e5e7eb'}`,
                  cursor: 'pointer',
                  transition: 'background 150ms',
                }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = isDark
                    ? '#272d3d'
                    : '#f9fafb')
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLElement).style.background = isDark ? '#1a1f2e' : '#fff')
                }
              >
                <X size={13} /> Clear
              </button>
            </div>
          </div>

          {/* Job cards grid */}
          {filteredJobs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '14px',
                  background: ACCENT_LIGHT,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}
              >
                <Briefcase size={24} style={{ color: ACCENT }} />
              </div>
              <p style={{ fontSize: '16px', fontWeight: 600, color: hTxt, marginBottom: '8px' }}>
                {isFilterActive ? 'No jobs match your filter' : 'No jobs found'}
              </p>
              <p style={{ fontSize: '13px', color: hSub, marginBottom: '24px' }}>
                {isFilterActive
                  ? 'Try a wider date range or reset the filter.'
                  : 'Try a different keyword or location.'}
              </p>
              {isFilterActive ? (
                <button
                  onClick={() =>
                    fetchJobs(keyword, location, DEFAULT_FILTER, { resetFilter: true })
                  }
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    background: ACCENT,
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Reset Filter
                </button>
              ) : (
                <button
                  onClick={() => setOpen(true)}
                  style={{
                    padding: '10px 24px',
                    borderRadius: '8px',
                    background: ACCENT,
                    color: '#fff',
                    fontSize: '13px',
                    fontWeight: 600,
                    border: 'none',
                    cursor: 'pointer',
                  }}
                >
                  Try Again
                </button>
              )}
            </div>
          ) : (
            <>
              <div
                style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px' }}
                className="job-cards-grid"
              >
                {pagedJobs.map((job) => (
                  <JobCard
                    key={job.id}
                    job={job}
                    searchLocation={criteria?.location ?? ''}
                    isDark={isDark}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    marginTop: '36px',
                    flexWrap: 'wrap',
                  }}
                >
                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.max(1, p - 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === 1}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${isDark ? '#272d3d' : '#e5e7eb'}`,
                      background: isDark ? '#1a1f2e' : '#fff',
                      fontSize: '12px',
                      fontWeight: 500,
                      color:
                        currentPage === 1
                          ? isDark
                            ? '#374151'
                            : '#d1d5db'
                          : isDark
                            ? '#cbd5e1'
                            : '#374151',
                      cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    }}
                  >
                    ← Prev
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - currentPage) <= 1)
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
                        <span
                          key={`ellipsis-${i}`}
                          style={{ fontSize: '12px', color: '#9ca3af', padding: '0 4px' }}
                        >
                          …
                        </span>
                      ) : (
                        <button
                          key={p}
                          onClick={() => {
                            setCurrentPage(p as number);
                            window.scrollTo({ top: 0, behavior: 'smooth' });
                          }}
                          style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '8px',
                            border:
                              currentPage === p
                                ? 'none'
                                : `1px solid ${isDark ? '#272d3d' : '#e5e7eb'}`,
                            background: currentPage === p ? ACCENT : isDark ? '#1a1f2e' : '#fff',
                            color: currentPage === p ? '#fff' : isDark ? '#cbd5e1' : '#374151',
                            fontSize: '12px',
                            fontWeight: currentPage === p ? 700 : 400,
                            cursor: 'pointer',
                            transition: 'background 150ms',
                          }}
                        >
                          {p}
                        </button>
                      ),
                    )}

                  <button
                    onClick={() => {
                      setCurrentPage((p) => Math.min(totalPages, p + 1));
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    disabled={currentPage === totalPages}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${isDark ? '#272d3d' : '#e5e7eb'}`,
                      background: isDark ? '#1a1f2e' : '#fff',
                      fontSize: '12px',
                      fontWeight: 500,
                      color:
                        currentPage === totalPages
                          ? isDark
                            ? '#374151'
                            : '#d1d5db'
                          : isDark
                            ? '#cbd5e1'
                            : '#374151',
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
                  marginTop: '12px',
                  fontSize: '12px',
                  color: isDark ? '#475569' : '#9ca3af',
                }}
              >
                Showing {(currentPage - 1) * PAGE_SIZE + 1}–
                {Math.min(currentPage * PAGE_SIZE, filteredJobs.length)} of {filteredJobs.length}{' '}
                jobs
              </p>
            </>
          )}
        </div>
      )}

      {/* Highlights — pre-search only */}
      {!searched && (
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
                    background: ACCENT_LIGHT,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '14px',
                  }}
                >
                  <Icon size={18} style={{ color: ACCENT }} />
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

      {/* Filter Panel */}
      <FilterPanel
        open={filterOpen}
        onClose={() => {
          if (!loading) setFilterOpen(false);
        }}
        filter={appliedFilter}
        onApply={async (f) => {
          setFilterOpen(false);
          await fetchJobs(keyword, location, f);
        }}
        totalJobs={jobs.length}
        filteredCount={filteredJobs.length}
        isDark={isDark}
        isLoading={loading}
      />

      {/* Search Modal */}
      {open &&
        (() => {
          const mBg = isDark ? '#1a1f2e' : '#ffffff';
          const mBdr = isDark ? '#272d3d' : '#f3f4f6';
          const mTxt = isDark ? '#f1f5f9' : '#0f1729';
          const mSub = isDark ? '#64748b' : '#9ca3af';
          const mBody = isDark ? '#cbd5e1' : '#374151';
          const iBg = isDark ? '#0f1117' : '#ffffff';
          const iClr = isDark ? '#e2e8f0' : '#0f1729';
          const iBdr = isDark ? '#272d3d' : '#e5e7eb';
          const noteBg = isDark ? 'rgba(34,85,236,0.12)' : ACCENT_LIGHT;
          return (
            <div
              style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(15,23,41,0.55)',
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
                  background: mBg,
                  borderRadius: '16px',
                  width: '100%',
                  maxWidth: '480px',
                  boxShadow: isDark
                    ? '0 20px 40px rgba(0,0,0,0.5)'
                    : '0 20px 40px rgba(0,0,0,0.15)',
                  overflow: 'hidden',
                  border: `1px solid ${mBdr}`,
                }}
              >
                {/* Modal header */}
                <div
                  style={{
                    padding: '20px 24px',
                    borderBottom: `1px solid ${mBdr}`,
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
                        background: isDark ? '#1e2844' : ACCENT_LIGHT,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Briefcase size={15} style={{ color: ACCENT }} />
                    </div>
                    <div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: mTxt }}>Search Jobs</p>
                      <p style={{ fontSize: '11px', color: mSub }}>Live LinkedIn listings</p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: mSub,
                      padding: '4px',
                      borderRadius: '6px',
                    }}
                    aria-label="Close"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Modal body */}
                <div style={{ padding: '24px' }}>
                  <form
                    onSubmit={handleSubmit}
                    style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}
                  >
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: mBody,
                          marginBottom: '6px',
                        }}
                      >
                        Job Field
                      </label>
                      <div style={{ position: 'relative' }}>
                        <Search
                          size={14}
                          style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: mSub,
                            pointerEvents: 'none',
                          }}
                        />
                        <input
                          type="text"
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                          placeholder="e.g. Datascience, React Developer, AI Engineer"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 34px',
                            borderRadius: '8px',
                            border: `1px solid ${iBdr}`,
                            fontSize: '13px',
                            color: iClr,
                            background: iBg,
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 150ms',
                            fontFamily: 'inherit',
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = iBdr)}
                        />
                      </div>
                    </div>
                    <div>
                      <label
                        style={{
                          display: 'block',
                          fontSize: '12px',
                          fontWeight: 500,
                          color: mBody,
                          marginBottom: '6px',
                        }}
                      >
                        Location
                      </label>
                      <div style={{ position: 'relative' }}>
                        <MapPin
                          size={14}
                          style={{
                            position: 'absolute',
                            left: '12px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            color: mSub,
                            pointerEvents: 'none',
                          }}
                        />
                        <input
                          type="text"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          placeholder="e.g. Noida, Bangalore, Mumbai"
                          required
                          style={{
                            width: '100%',
                            padding: '10px 12px 10px 34px',
                            borderRadius: '8px',
                            border: `1px solid ${iBdr}`,
                            fontSize: '13px',
                            color: iClr,
                            background: iBg,
                            outline: 'none',
                            boxSizing: 'border-box',
                            transition: 'border-color 150ms',
                            fontFamily: 'inherit',
                          }}
                          onFocus={(e) => (e.currentTarget.style.borderColor = ACCENT)}
                          onBlur={(e) => (e.currentTarget.style.borderColor = iBdr)}
                        />
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        gap: '8px',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: noteBg,
                        border: `1px solid rgba(34,85,236,0.15)`,
                      }}
                    >
                      <Sparkles
                        size={13}
                        style={{ color: ACCENT, flexShrink: 0, marginTop: '1px' }}
                      />
                      <p style={{ fontSize: '11px', color: mBody, lineHeight: 1.6 }}>
                        This search scrapes live LinkedIn listings — it may take 15–30 seconds.
                        Please wait after clicking.
                      </p>
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        width: '100%',
                        padding: '11px',
                        borderRadius: '10px',
                        background: loading ? '#93a5f5' : ACCENT,
                        color: '#fff',
                        fontSize: '13px',
                        fontWeight: 600,
                        border: 'none',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'background 150ms',
                      }}
                      onMouseEnter={(e) => {
                        if (!loading)
                          (e.currentTarget as HTMLElement).style.background = ACCENT_HOVER;
                      }}
                      onMouseLeave={(e) => {
                        if (!loading) (e.currentTarget as HTMLElement).style.background = ACCENT;
                      }}
                    >
                      {loading ? (
                        <>
                          <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} />{' '}
                          Searching LinkedIn...
                        </>
                      ) : (
                        <>
                          Search Jobs <ArrowRight size={14} />
                        </>
                      )}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          );
        })()}

      <style>{`
        @keyframes spin       { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes loadBounce { 0%,80%,100% { transform: translateY(0); opacity: 0.4; } 40% { transform: translateY(-8px); opacity: 1; } }
      `}</style>
    </div>
  );
}

// ─── Job Card ────────────────────────────────────────────────────────────────
function JobCard({
  job,
  searchLocation,
  isDark,
}: {
  job: Job;
  searchLocation: string;
  isDark: boolean;
}) {
  const isLocationMatch =
    job.locationMatch ?? job.location.toLowerCase().includes(searchLocation.toLowerCase());
  const initials = job.company
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();

  const cardBg = isDark ? '#1a1f2e' : '#ffffff';
  const cardBdr = isDark ? '#272d3d' : '#e5e7eb';
  const titleC = isDark ? '#f1f5f9' : '#0f1729';
  const subC = isDark ? '#94a3b8' : '#6b7280';
  const muteC = isDark ? '#475569' : '#9ca3af';
  const divC = isDark ? '#272d3d' : '#f3f4f6';

  return (
    <div
      style={{
        background: cardBg,
        border: `1px solid ${cardBdr}`,
        borderRadius: '14px',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        transition: 'box-shadow 200ms, transform 200ms',
        height: '100%',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(34,85,236,0.1)';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.boxShadow = 'none';
        (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
      }}
    >
      {/* Card top */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
        <div
          style={{
            width: '42px',
            height: '42px',
            borderRadius: '10px',
            background: isDark ? '#1e2844' : ACCENT_LIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
            fontSize: '13px',
            fontWeight: 700,
            color: ACCENT,
          }}
        >
          {initials || <Building2 size={16} style={{ color: ACCENT }} />}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p
            style={{
              fontSize: '13px',
              fontWeight: 700,
              color: titleC,
              marginBottom: '3px',
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
              fontSize: '12px',
              color: subC,
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {job.company}
          </p>
        </div>
      </div>

      {/* Location + time */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '12px',
            color: subC,
          }}
        >
          <MapPin size={11} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {job.location}
          </span>
          {isLocationMatch ? (
            <span
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                padding: '1px 6px',
                borderRadius: '9999px',
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                fontSize: '10px',
                fontWeight: 600,
                color: '#16a34a',
              }}
            >
              ✓ Exact
            </span>
          ) : (
            <span
              style={{
                flexShrink: 0,
                display: 'inline-flex',
                alignItems: 'center',
                padding: '1px 6px',
                borderRadius: '9999px',
                background: '#fefce8',
                border: '1px solid #fde68a',
                fontSize: '10px',
                fontWeight: 600,
                color: '#92400e',
              }}
            >
              Nearby
            </span>
          )}
        </div>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            color: muteC,
          }}
        >
          <Clock size={11} style={{ flexShrink: 0 }} />
          {job.postedDate}
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: '1px', background: divC }} />

      {/* Apply button */}
      {job.applyLink ? (
        <a
          href={job.applyLink}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            padding: '9px 14px',
            borderRadius: '8px',
            background: ACCENT,
            color: '#fff',
            fontSize: '12px',
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'background 150ms',
          }}
          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = ACCENT_HOVER)}
          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = ACCENT)}
        >
          Apply on LinkedIn <ExternalLink size={11} />
        </a>
      ) : (
        <div
          style={{
            marginTop: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '9px 14px',
            borderRadius: '8px',
            background: isDark ? '#0f1117' : '#f3f4f6',
            color: isDark ? '#475569' : '#9ca3af',
            fontSize: '12px',
            fontWeight: 500,
          }}
        >
          Link unavailable
        </div>
      )}
    </div>
  );
}
