'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import type { ChartDatum } from '@/api/dashboardApi';

interface AssessmentColumnChartProps {
  data: ChartDatum[];
}

interface TooltipPayloadItem {
  value: number;
  payload: { label: string };
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
        borderRadius: '10px',
        padding: '9px 13px',
        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
      }}
    >
      <p style={{ color: '#94a3b8', fontSize: '11px', marginBottom: '4px', fontWeight: 600 }}>
        {label}
      </p>
      <p style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
        {payload[0].value}{' '}
        <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '11px' }}>skills</span>
      </p>
    </div>
  );
}

// Warm orange-to-coral gradient per bar
const BAR_COLORS = ['#f6ad75', '#f49a63', '#f2875a', '#f0764e', '#ee6542'];

export default function AssessmentColumnChart({ data }: AssessmentColumnChartProps) {
  const hasData = data.length > 0;

  const chartData = data.map((d) => ({
    label: d.label ?? '',
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
          data={chartData}
          margin={{ top: 20, right: 8, left: -10, bottom: 0 }}
          barCategoryGap="32%"
        >
          <defs>
            {chartData.map((_, i) => (
              <linearGradient key={i} id={`colGrad${i}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={BAR_COLORS[i % BAR_COLORS.length]} stopOpacity={1} />
                <stop offset="100%" stopColor="#f06d55" stopOpacity={0.85} />
              </linearGradient>
            ))}
          </defs>
          <CartesianGrid strokeDasharray="4 4" stroke="#edf0f5" vertical={false} />
          <XAxis
            dataKey="label"
            tick={{ fill: '#7b8799', fontSize: 11 }}
            axisLine={{ stroke: '#e8edf3' }}
            tickLine={false}
            dy={6}
          />
          <YAxis
            allowDecimals={false}
            tick={{ fill: '#a0a9b8', fontSize: 10 }}
            axisLine={false}
            tickLine={false}
            width={26}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(246,173,117,0.08)' }} />
          <Bar dataKey="value" radius={[8, 8, 0, 0]} maxBarSize={40}>
            <LabelList
              dataKey="value"
              position="top"
              style={{ fill: '#7b8799', fontSize: 10, fontWeight: 600 }}
            />
            {chartData.map((_, index) => (
              <Cell
                key={`cell-${index}`}
                fill={`url(#colGrad${index})`}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
