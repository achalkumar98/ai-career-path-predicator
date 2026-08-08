'use client';

import { useEffect, useState } from 'react';
import {
  BrainCircuit,
  BriefcaseBusiness,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import Link from 'next/link';
import { DashboardAnalytics, getDashboardAnalyticsApi } from '@/api/dashboardApi';
import ActivityLineChart from '@/components/charts/ActivityLineChart';
import SkillsBarChart from '@/components/charts/SkillsBarChart';
import AssessmentColumnChart from '@/components/charts/AssessmentColumnChart';
import InterestsDonutChart from '@/components/charts/InterestsDonutChart';

const emptyAnalytics: DashboardAnalytics = {
  activity: [],
  skills: [],
  interests: [],
  careers: [],
  assessmentCoverage: [],
  updatedAt: '',
  summary: { assessments: 0, insights: 0, skillsTracked: 0, interestsTracked: 0, careerPaths: 0 },
};

export default function Homepage() {
  const [user, setUser] = useState<{ name?: string } | null>(null);
  const [analytics, setAnalytics] = useState<DashboardAnalytics>(emptyAnalytics);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadAnalytics = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      setAnalytics((await getDashboardAnalyticsApi()).data);
    } catch (error) {
      console.error('Dashboard analytics error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    setUser(JSON.parse(localStorage.getItem('user') || 'null'));
    loadAnalytics();
  }, []);

  const metrics = [
    {
      label: 'Assessments',
      value: analytics.summary.assessments,
      icon: BriefcaseBusiness,
      color: '#f78b47',
      tint: '#fff4ed',
      trend: 'All time',
    },
    {
      label: 'AI Insights',
      value: analytics.summary.insights,
      icon: Sparkles,
      color: '#c758e4',
      tint: '#faf0fd',
      trend: 'Generated',
    },
    {
      label: 'Skills Tracked',
      value: analytics.summary.skillsTracked,
      icon: BrainCircuit,
      color: '#4f9de8',
      tint: '#edf6ff',
      trend: 'Unique skills',
    },
    {
      label: 'Career Interests',
      value: analytics.summary.interestsTracked,
      icon: Target,
      color: '#64b979',
      tint: '#edfaf0',
      trend: 'Identified',
    },
  ];

  const quickLinks = [
    { label: 'Start Assessment', href: '/career-navigator', color: '#5b5ce2', bg: '#eef0fe' },
    { label: 'Analyse Resume', href: '/resume-analyzer', color: '#f78b47', bg: '#fff4ed' },
    { label: 'Chat with AI', href: '/chatbot', color: '#64b979', bg: '#edfaf0' },
    { label: 'View Insights', href: '/insights', color: '#c758e4', bg: '#faf0fd' },
  ];

  const updatedLabel = analytics.updatedAt
    ? `Live · Updated ${new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(analytics.updatedAt))}`
    : 'Live · Data appears after your first assessment';

  return (
    <div className="dash-page">

      {/* ── Page header ──────────────────────────────────────── */}
      <div className="dash-header">
        <div>
          <h1 className="dash-title">
            Welcome back,{' '}
            <span className="gradient-text">{user?.name ?? '…'}</span>
          </h1>
          <p className="dash-subtitle">
            Track your career momentum — assessments, skills, and the interests driving your next move.
          </p>
        </div>

        {/* Quick-action links */}
        <div className="quick-links">
          {quickLinks.map(({ label, href, color, bg }) => (
            <Link key={href} href={href} className="quick-link" style={{ '--ql-color': color, '--ql-bg': bg } as React.CSSProperties}>
              {label}
              <ArrowRight size={12} />
            </Link>
          ))}
        </div>
      </div>

      {/* ── Toolbar ──────────────────────────────────────────── */}
      <div className="dash-toolbar">
        <div className="toolbar-left">
          <TrendingUp size={14} strokeWidth={2.5} style={{ color: '#5b5ce2' }} />
          <span>Career analytics</span>
        </div>
        <div className="toolbar-right">
          <span className="live-badge">● Live</span>
          <button
            className="refresh-btn"
            onClick={() => loadAnalytics(true)}
            disabled={refreshing}
            aria-label="Refresh analytics"
          >
            <RefreshCw size={13} className={refreshing ? 'spin' : ''} />
            {refreshing ? 'Refreshing…' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* ── Metric cards ─────────────────────────────────────── */}
      <section className="metric-grid" aria-label="Career summary">
        {metrics.map(({ label, value, icon: Icon, color, tint, trend }) => (
          <article key={label} className="metric-card">
            <div className="metric-icon" style={{ color, background: tint }}>
              <Icon size={20} strokeWidth={1.8} />
            </div>
            <div className="metric-body">
              <p className="metric-label">{label}</p>
              <strong className="metric-value">{loading ? '—' : value}</strong>
              <span className="metric-sub">{trend}</span>
            </div>
          </article>
        ))}
      </section>

      {/* ── Charts grid ──────────────────────────────────────── */}
      <section className="charts-grid" aria-label="Career analytics charts">

        {/* Activity trend — wide left */}
        <article className="chart-card chart-wide">
          <div className="chart-card-head">
            <div>
              <p className="chart-eyebrow">LAST 7 DAYS</p>
              <h2 className="chart-title">Career activity trend</h2>
              <p className="chart-desc">Assessments and AI insights generated over time.</p>
            </div>
            <span className="live-pill">Live</span>
          </div>
          {loading
            ? <ChartLoader />
            : <ActivityLineChart data={analytics.activity} />}
        </article>

        {/* Interests donut — right */}
        <article className="chart-card chart-narrow">
          <div className="chart-card-head">
            <div>
              <p className="chart-eyebrow">YOUR DIRECTION</p>
              <h2 className="chart-title">Career interests</h2>
              <p className="chart-desc">The interests shaping your next career move.</p>
            </div>
            <span className="live-pill">Live</span>
          </div>
          {loading
            ? <ChartLoader />
            : <InterestsDonutChart data={analytics.interests} />}
        </article>

        {/* Top skills — horizontal bar */}
        <article className="chart-card chart-half">
          <div className="chart-card-head">
            <div>
              <p className="chart-eyebrow">YOUR PROFILE</p>
              <h2 className="chart-title">Top skills</h2>
              <p className="chart-desc">Skills appearing most in your assessments.</p>
            </div>
            <span className="live-pill">Live</span>
          </div>
          {loading
            ? <ChartLoader />
            : <SkillsBarChart data={analytics.skills} />}
        </article>

        {/* Skills per assessment — vertical bar */}
        <article className="chart-card chart-half">
          <div className="chart-card-head">
            <div>
              <p className="chart-eyebrow">ASSESSMENT DEPTH</p>
              <h2 className="chart-title">Skills per assessment</h2>
              <p className="chart-desc">How many skills you added in each latest assessment.</p>
            </div>
            <span className="live-pill">Live</span>
          </div>
          {loading
            ? <ChartLoader />
            : <AssessmentColumnChart data={analytics.assessmentCoverage} />}
        </article>

      </section>

      {/* ── Footer timestamp ─────────────────────────────────── */}
      <p className="updated-label">{updatedLabel}</p>
    </div>
  );
}

function ChartLoader() {
  return (
    <div className="chart-loader-wrap">
      <Loader2 size={22} className="spin" style={{ color: '#c7d2fe' }} />
      <span>Loading live data…</span>
    </div>
  );
}