'use client';

import { useEffect, useRef, useState } from 'react';
import * as echarts from 'echarts';
import {
  BrainCircuit,
  BriefcaseBusiness,
  Loader2,
  RefreshCw,
  Sparkles,
  Target,
} from 'lucide-react';
import { DashboardAnalytics, getDashboardAnalyticsApi } from '@/api/dashboardApi';

type ChartKind = 'line' | 'bar' | 'column' | 'donut';

const emptyAnalytics: DashboardAnalytics = {
  activity: [],
  skills: [],
  interests: [],
  careers: [],
  assessmentCoverage: [],
  updatedAt: '',
  summary: { assessments: 0, insights: 0, skillsTracked: 0, interestsTracked: 0, careerPaths: 0 },
};

function CareerChart({ kind, analytics }: { kind: ChartKind; analytics: DashboardAnalytics }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const chart = echarts.init(ref.current, undefined, { renderer: 'svg' });
    const noData = {
      type: 'text',
      left: 'center',
      top: 'middle',
      style: {
        text: 'Complete an assessment to see your data',
        fill: '#94a3b8',
        font: '500 12px Inter, sans-serif',
      },
    };
    const isEmpty =
      kind === 'line'
        ? !analytics.activity.some((item) => item.value)
        : kind === 'bar'
          ? !analytics.skills.length
          : kind === 'column'
            ? !analytics.assessmentCoverage.length
            : !analytics.interests.length;
    let option: echarts.EChartsOption;

    if (kind === 'line') {
      option = {
        animationDuration: 800,
        color: ['#5b5ce2', '#f49a63'],
        grid: { left: 4, right: 12, top: 26, bottom: 4, containLabel: true },
        legend: {
          top: 0,
          right: 2,
          icon: 'circle',
          itemWidth: 7,
          itemHeight: 7,
          textStyle: { color: '#64748b', fontSize: 11 },
        },
        xAxis: {
          type: 'category',
          boundaryGap: false,
          data: analytics.activity.map((item) => item.label || ''),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#94a3b8', fontSize: 11, margin: 12 },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          splitLine: { lineStyle: { color: '#edf0f5', type: 'dashed' } },
          axisLabel: { color: '#a0a9b8', fontSize: 10 },
          axisLine: { show: false },
          axisTick: { show: false },
        },
        tooltip: {
          trigger: 'axis',
          backgroundColor: '#182235',
          borderWidth: 0,
          padding: [9, 12],
          textStyle: { color: '#fff', fontSize: 11 },
          axisPointer: { lineStyle: { color: '#c7d2fe', type: 'dashed' } },
        },
        series: [
          {
            name: 'Assessments',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 7,
            data: analytics.activity.map((item) => item.assessments || 0),
            lineStyle: { width: 3 },
            itemStyle: { borderColor: '#fff', borderWidth: 2 },
            areaStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: 'rgba(91,92,226,.25)' },
                { offset: 1, color: 'rgba(91,92,226,0)' },
              ]),
            },
          },
          {
            name: 'AI insights',
            type: 'line',
            smooth: true,
            symbol: 'circle',
            symbolSize: 7,
            data: analytics.activity.map((item) => item.insights || 0),
            lineStyle: { width: 3 },
            itemStyle: { borderColor: '#fff', borderWidth: 2 },
          },
        ],
        graphic: isEmpty ? noData : undefined,
      };
    } else if (kind === 'bar') {
      option = {
        animationDuration: 800,
        // Skill names are rendered in an adjacent HTML column to avoid SVG axis-label clipping.
        grid: { left: 0, right: 34, top: 12, bottom: 8, containLabel: false },
        xAxis: {
          type: 'value',
          minInterval: 1,
          splitLine: { lineStyle: { color: '#edf0f5', type: 'dashed' } },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
        },
        yAxis: {
          type: 'category',
          inverse: true,
          data: analytics.skills.map((item) => item.name || ''),
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { show: false },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: '#182235',
          borderWidth: 0,
          padding: [8, 11],
          textStyle: { color: '#fff', fontSize: 11 },
        },
        series: [
          {
            type: 'bar',
            data: analytics.skills.map((item) => item.value),
            barWidth: 17,
            showBackground: true,
            backgroundStyle: { color: '#f1f4f8', borderRadius: 10 },
            itemStyle: {
              borderRadius: 10,
              color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                { offset: 0, color: '#8b5cf6' },
                { offset: 1, color: '#5b5ce2' },
              ]),
            },
            label: { show: true, position: 'right', color: '#94a3b8', fontSize: 10 },
          },
        ],
        graphic: isEmpty ? noData : undefined,
      };
    } else if (kind === 'column') {
      option = {
        animationDuration: 800,
        grid: { left: 8, right: 8, top: 18, bottom: 10, containLabel: true },
        xAxis: {
          type: 'category',
          data: analytics.assessmentCoverage.map((item) => item.label || ''),
          axisLine: { lineStyle: { color: '#e8edf3' } },
          axisTick: { show: false },
          axisLabel: { color: '#7b8799', fontSize: 10, margin: 12 },
        },
        yAxis: {
          type: 'value',
          minInterval: 1,
          splitLine: { lineStyle: { color: '#edf0f5', type: 'dashed' } },
          axisLine: { show: false },
          axisTick: { show: false },
          axisLabel: { color: '#a0a9b8', fontSize: 10 },
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: { type: 'shadow' },
          backgroundColor: '#182235',
          borderWidth: 0,
          padding: [8, 11],
          textStyle: { color: '#fff', fontSize: 11 },
        },
        series: [
          {
            type: 'bar',
            data: analytics.assessmentCoverage.map((item) => item.value),
            barMaxWidth: 38,
            showBackground: true,
            backgroundStyle: { color: '#f5f7fa', borderRadius: [8, 8, 0, 0] },
            itemStyle: {
              borderRadius: [8, 8, 0, 0],
              color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#f6ad75' },
                { offset: 1, color: '#f06d55' },
              ]),
            },
            label: { show: true, position: 'top', color: '#7b8799', fontSize: 10 },
          },
        ],
        graphic: isEmpty ? noData : undefined,
      };
    } else {
      option = {
        animationDuration: 800,
        tooltip: {
          trigger: 'item',
          backgroundColor: '#182235',
          borderWidth: 0,
          padding: [8, 11],
          textStyle: { color: '#fff', fontSize: 11 },
        },
        title: {
          text: `${analytics.interests.reduce((total, item) => total + item.value, 0)}`,
          subtext: 'signals',
          left: '50%',
          top: '31%',
          textAlign: 'center',
          textStyle: { color: '#1e293b', fontSize: 22, fontWeight: 800 },
          subtextStyle: { color: '#94a3b8', fontSize: 10 },
        },
        legend: {
          bottom: 0,
          left: 'center',
          icon: 'circle',
          itemWidth: 7,
          itemHeight: 7,
          itemGap: 12,
          textStyle: { color: '#64748b', fontSize: 10 },
          type: 'scroll',
        },
        series: [
          {
            type: 'pie',
            radius: ['61%', '82%'],
            center: ['50%', '46%'],
            label: { show: false },
            labelLine: { show: false },
            itemStyle: { borderColor: '#fff', borderWidth: 4, borderRadius: 7 },
            emphasis: { scale: true, scaleSize: 5 },
            data: analytics.interests.map((item) => ({ name: item.name || '', value: item.value })),
            color: ['#f78b47', '#64cb77', '#4f9de8', '#c758e4', '#f4c84b'],
          },
        ],
        graphic: isEmpty ? noData : undefined,
      };
    }
    chart.setOption(option);
    const observer = new ResizeObserver(() => chart.resize());
    observer.observe(ref.current);
    return () => {
      observer.disconnect();
      chart.dispose();
    };
  }, [analytics, kind]);

  if (kind === 'bar') {
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '112px minmax(0, 1fr)',
          height: 270,
          width: '100%',
        }}
      >
        <div
          aria-hidden="true"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            padding: '8px 12px 8px 0',
            overflow: 'hidden',
          }}
        >
          {analytics.skills.map((item) => (
            <span
              key={item.name}
              title={item.name}
              style={{
                color: '#4b5563',
                fontSize: 12,
                lineHeight: 1.2,
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                textAlign: 'right',
              }}
            >
              {item.name}
            </span>
          ))}
        </div>
        <div ref={ref} style={{ minWidth: 0, height: 270 }} />
      </div>
    );
  }

  return <div ref={ref} style={{ width: '100%', height: 270 }} />;
}

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
      tint: '#fff0e7',
    },
    {
      label: 'AI Insights',
      value: analytics.summary.insights,
      icon: Sparkles,
      color: '#c758e4',
      tint: '#faedfd',
    },
    {
      label: 'Skills Tracked',
      value: analytics.summary.skillsTracked,
      icon: BrainCircuit,
      color: '#4f9de8',
      tint: '#ecf6ff',
    },
    {
      label: 'Career Interests',
      value: analytics.summary.interestsTracked,
      icon: Target,
      color: '#64b979',
      tint: '#eefaf0',
    },
  ];

  return (
    <div className="career-dashboard page-pad">
      {/* Header */}
      <div style={{ marginBottom: '36px' }}>
        <h1
          style={{
            fontSize: '32px',
            fontWeight: 800,
            color: 'var(--color-text-primary)',
            marginBottom: '8px',
            lineHeight: 1.2,
          }}
        >
          Welcome back, <span className="gradient-text">{user?.name}</span>
        </h1>
        <p style={{ fontSize: '14px', color: '#6b7280', lineHeight: 1.6 }}>
          Stay on top of your career momentum—review your real assessment activity, strongest
          skills, and the interests guiding your next move.
        </p>
      </div>

      <div className="dashboard-toolbar">
        <p>Career analytics</p>
        <button onClick={() => loadAnalytics(true)} disabled={refreshing}>
          <RefreshCw size={14} className={refreshing ? 'spin' : ''} /> Refresh
        </button>
      </div>
      <section className="metric-grid" aria-label="Career summary">
        {metrics.map(({ label, value, icon: Icon, color, tint }) => (
          <article key={label} className="metric-card">
            <div>
              <p>{label}</p>
              <strong>{value}</strong>
              <span>from your live history</span>
            </div>
            <div className="metric-icon" style={{ color, background: tint }}>
              <Icon size={19} />
            </div>
          </article>
        ))}
      </section>

      <section className="analytics-grid" aria-label="Career analytics charts">
        <article className="analytics-card growth-card">
          <div className="card-heading">
            <div>
              <p>LAST 7 DAYS</p>
              <h2>Career activity trend</h2>
            </div>
            <span>Live</span>
          </div>
          <p className="card-description">Your assessments and AI insights over time.</p>
          {loading ? (
            <div className="chart-loader">
              <Loader2 size={20} className="spin" /> Loading live data
            </div>
          ) : (
            <CareerChart kind="line" analytics={analytics} />
          )}
        </article>
        <article className="analytics-card interest-card">
          <div className="card-heading">
            <div>
              <p>YOUR DIRECTION</p>
              <h2>Career interests</h2>
            </div>
            <span>Live</span>
          </div>
          <p className="card-description">The interests shaping your next career move.</p>
          {loading ? (
            <div className="chart-loader">
              <Loader2 size={20} className="spin" /> Loading live data
            </div>
          ) : (
            <CareerChart kind="donut" analytics={analytics} />
          )}
        </article>
        <article className="analytics-card skills-card">
          <div className="card-heading">
            <div>
              <p>YOUR PROFILE</p>
              <h2>Top skills</h2>
            </div>
            <span>Live</span>
          </div>
          <p className="card-description">Skills appearing most in your assessments.</p>
          {loading ? (
            <div className="chart-loader">
              <Loader2 size={20} className="spin" /> Loading live data
            </div>
          ) : (
            <CareerChart kind="bar" analytics={analytics} />
          )}
        </article>
        <article className="analytics-card vertical-card">
          <div className="card-heading">
            <div>
              <p>ASSESSMENT DEPTH</p>
              <h2>Skills per assessment</h2>
            </div>
            <span>Live</span>
          </div>
          <p className="card-description">
            How many skills you added in each of your latest assessments.
          </p>
          {loading ? (
            <div className="chart-loader">
              <Loader2 size={20} className="spin" /> Loading live data
            </div>
          ) : (
            <CareerChart kind="column" analytics={analytics} />
          )}
        </article>
      </section>

      <p className="updated-label">
        {analytics.updatedAt
          ? `Live data updated ${new Intl.DateTimeFormat('en-US', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(analytics.updatedAt))}`
          : 'Live data appears after your first assessment.'}
      </p>

      <style>{`
        .career-dashboard { min-height: calc(100vh - 56px); padding: 40px 48px 48px; background: #f8fafc; } .dashboard-toolbar { max-width: 1280px; margin: 0 auto 13px; display: flex; justify-content: space-between; align-items: center; } .dashboard-toolbar p { font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: .09em; color: #94a3b8; } .dashboard-toolbar button { display: inline-flex; align-items: center; gap: 6px; background: #fff; border: 1px solid #e4e9f0; border-radius: 9px; padding: 8px 11px; color: #64748b; font-size: 11px; font-weight: 700; cursor: pointer; } .dashboard-toolbar button:hover { color: #5b5ce2; border-color: #c7d2fe; } .dashboard-toolbar button:disabled { cursor: wait; opacity: .7; }
        .metric-grid { max-width: 1280px; margin: 0 auto 20px; display: grid; grid-template-columns: repeat(4, 1fr); gap: 15px; } .metric-card, .analytics-card { background: #fff; border: 1px solid #e8edf3; box-shadow: 0 8px 24px rgba(30,41,59,.035); } .metric-card { border-radius: 14px; padding: 18px; display: flex; justify-content: space-between; align-items: flex-start; } .metric-card p { color: #64748b; font-size: 11px; font-weight: 600; margin-bottom: 8px; } .metric-card strong { display: block; font-size: 24px; line-height: 1; color: #1e293b; letter-spacing: -.04em; } .metric-card span { display: block; margin-top: 6px; color: #a0a9b8; font-size: 10px; } .metric-icon { display: grid; place-items: center; width: 36px; height: 36px; border-radius: 10px; }
        .analytics-grid { max-width: 1280px; margin: auto; display: grid; grid-template-columns: 1.6fr 1fr; gap: 20px; } .analytics-card { border-radius: 16px; min-width: 0; padding: 21px; transition: transform .2s ease, box-shadow .2s ease; } .analytics-card:hover { transform: translateY(-2px); box-shadow: 0 14px 30px rgba(30,41,59,.07); } .card-heading { display: flex; justify-content: space-between; gap: 10px; } .card-heading p { color: #a0a9b8; font-size: 10px; letter-spacing: .09em; font-weight: 800; } .card-heading h2 { margin-top: 5px; color: #1e293b; font-size: 16px; letter-spacing: -.02em; } .card-heading span { color: #37a85a; background: #edf9ef; padding: 4px 8px; height: fit-content; border-radius: 999px; font-size: 10px; font-weight: 700; } .card-description { color: #7b8799; font-size: 11px; margin: 7px 0 1px; } .chart-loader { height: 270px; color: #94a3b8; font-size: 12px; display: flex; align-items: center; justify-content: center; gap: 8px; } .updated-label { max-width: 1280px; margin: 15px auto 0; text-align: right; color: #a0a9b8; font-size: 10px; } .spin { animation: spin .9s linear infinite; } @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 900px) { .metric-grid { grid-template-columns: repeat(2, 1fr); } .analytics-grid { grid-template-columns: 1fr; } .skills-card { grid-column: auto; } } @media (max-width: 768px) { .career-dashboard { padding: 24px 16px 32px; } .metric-grid { gap: 10px; } .metric-card { padding: 14px; } .metric-card strong { font-size: 21px; } .analytics-grid { gap: 14px; } .analytics-card { padding: 17px; } .updated-label { text-align: left; } } @media (max-width: 420px) { .metric-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
