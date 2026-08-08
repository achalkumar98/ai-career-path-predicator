'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartDatum } from '@/api/dashboardApi';

interface SkillsBarChartProps {
  data: ChartDatum[];
}

interface TooltipPayloadItem {
  value: number;
  payload: { name: string };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const { value, payload: entry } = payload[0];
  return (
    <div
      style={{
        background: '#182235',
        borderRadius: '10px',
        padding: '9px 13px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      }}
    >
      <p style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}>
        {entry.name}
      </p>
      <p style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
        {value} <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '11px' }}>mentions</span>
      </p>
    </div>
  );
}

// Gradient stops cycling through brand palette
const GRADIENT_PAIRS = [
  ['#8b5cf6', '#5b5ce2'],
  ['#4f9de8', '#3b82f6'],
  ['#64cb77', '#22c55e'],
  ['#f49a63', '#f78b47'],
  ['#c758e4', '#a855f7'],
];

export default function SkillsBarChart({ data }: SkillsBarChartProps) {
  const hasData = data.length > 0;

  const chartData = data.map((d) => ({
    name: d.name ?? '',
    value: d.value,
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
            Complete an assessment to see your data
          </span>
        </div>
      )}
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          layout="vertical"
          data={chartData}
          margin={{ top: 4, right: 36, left: 4, bottom: 4 }}
          barCategoryGap="28%"
        >
          <defs>
            {GRADIENT_PAIRS.map(([start, end], i) => (
              <linearGradient key={i} id={`skillGrad${i}`} x1="1" y1="0" x2="0" y2="0">
                <stop offset="0%" stopColor={start} />
                <stop offset="100%" stopColor={end} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#edf0f5" horizontal={false} />
          <XAxis
            type="number"
            allowDecimals={false}
            tick={{ fill: '#a0a9b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={108}
            tick={{ fill: '#4b5563', fontSize: 12 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(91,92,226,0.06)' }} />
          <Bar dataKey="value" radius={[0, 10, 10, 0]} maxBarSize={18} label={{ position: 'right', fill: '#94a3b8', fontSize: 10 }}>
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#skillGrad${index % GRADIENT_PAIRS.length})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
