'use client';

import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartDatum } from '@/api/dashboardApi';

interface ActivityLineChartProps {
  data: ChartDatum[];
}

interface TooltipPayloadItem {
  name: string;
  value: number;
  color: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div
      style={{
        background: '#182235',
        border: 'none',
        borderRadius: '10px',
        padding: '10px 14px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      }}
    >
      <p style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '6px', fontWeight: 600 }}>
        {label}
      </p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color, fontSize: '12px', fontWeight: 700 }}>
          {entry.name}:{' '}
          <span style={{ color: '#fff' }}>{entry.value}</span>
        </p>
      ))}
    </div>
  );
}

const EMPTY_MESSAGE = 'Complete an assessment to see your data';

export default function ActivityLineChart({ data }: ActivityLineChartProps) {
  const hasData = data.some((d) => (d.assessments || 0) + (d.insights || 0) > 0);

  const chartData = data.map((d) => ({
    label: d.label ?? d.date ?? '',
    Assessments: d.assessments ?? 0,
    'AI Insights': d.insights ?? 0,
  }));

  return (
    <div style={{ width: '100%', height: 270, position: 'relative' }}>
      {!hasData && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
            pointerEvents: 'none',
          }}
        >
          <span style={{ color: '#94a3b8', fontSize: '12px', fontWeight: 500 }}>
            {EMPTY_MESSAGE}
          </span>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorAssessments" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#5b5ce2" stopOpacity={0.22} />
              <stop offset="95%" stopColor="#5b5ce2" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInsights" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f49a63" stopOpacity={0.18} />
              <stop offset="95%" stopColor="#f49a63" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#edf0f5" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
            dy={8}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#a0a9b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={28}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#c7d2fe', strokeDasharray: '4 4' }} />
          <Legend
            iconType="circle"
            iconSize={7}
            wrapperStyle={{ fontSize: '11px', color: '#64748b', paddingTop: '8px' }}
          />
          <Area
            type="monotone"
            dataKey="Assessments"
            stroke="#5b5ce2"
            strokeWidth={3}
            fill="url(#colorAssessments)"
            dot={{ r: 4, fill: '#5b5ce2', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
          <Area
            type="monotone"
            dataKey="AI Insights"
            stroke="#f49a63"
            strokeWidth={3}
            fill="url(#colorInsights)"
            dot={{ r: 4, fill: '#f49a63', stroke: '#fff', strokeWidth: 2 }}
            activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
