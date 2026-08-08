'use client';

import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import type { ChartDatum } from '@/api/dashboardApi';

interface InterestsDonutChartProps {
  data: ChartDatum[];
}

const PALETTE = ['#f78b47', '#64cb77', '#4f9de8', '#c758e4', '#f4c84b', '#5b5ce2', '#f06d55'];

interface TooltipPayloadItem {
  name: string;
  value: number;
  payload: { percent: number };
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayloadItem[];
}

function CustomTooltip({ active, payload }: CustomTooltipProps) {
  if (!active || !payload?.length) return null;
  const item = payload[0];
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
        {item.name}
      </p>
      <p style={{ color: '#fff', fontSize: '13px', fontWeight: 700 }}>
        {item.value}{' '}
        <span style={{ color: '#94a3b8', fontWeight: 500, fontSize: '11px' }}>
          ({(item.payload.percent * 100).toFixed(1)}%)
        </span>
      </p>
    </div>
  );
}

interface LabelProps {
  cx: number;
  cy: number;
  total: number;
}

function CenterLabel({ cx, cy, total }: LabelProps) {
  return (
    <g>
      <text
        x={cx}
        y={cy - 6}
        textAnchor="middle"
        fill="#1e293b"
        style={{ fontSize: '22px', fontWeight: 800, fontFamily: 'Inter, sans-serif' }}
      >
        {total}
      </text>
      <text
        x={cx}
        y={cy + 12}
        textAnchor="middle"
        fill="#94a3b8"
        style={{ fontSize: '10px', fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
      >
        signals
      </text>
    </g>
  );
}

export default function InterestsDonutChart({ data }: InterestsDonutChartProps) {
  const hasData = data.length > 0;
  const total = data.reduce((sum, d) => sum + d.value, 0);

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
        <PieChart>
          <Pie
            data={hasData ? chartData : [{ name: '', value: 1 }]}
            cx="50%"
            cy="46%"
            innerRadius="61%"
            outerRadius="80%"
            paddingAngle={hasData ? 3 : 0}
            dataKey="value"
            stroke="none"
            startAngle={90}
            endAngle={-270}
          >
            {hasData
              ? chartData.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={PALETTE[index % PALETTE.length]}
                    stroke="#fff"
                    strokeWidth={3}
                  />
                ))
              : [<Cell key="empty" fill="#f1f5f9" stroke="none" />]}
          </Pie>
          {hasData && (
            <Tooltip content={<CustomTooltip />} />
          )}
          {hasData && (
            <Legend
              iconType="circle"
              iconSize={7}
              wrapperStyle={{ fontSize: '10px', color: '#64748b', paddingTop: '4px' }}
            />
          )}
          {/* Center label rendered via customized label — using foreignObject trick via SVG text */}
          {hasData && (
            <text x="50%" y="46%" textAnchor="middle" dominantBaseline="middle">
              <tspan
                x="50%"
                dy="-6"
                style={{ fontSize: '22px', fontWeight: 800, fill: '#1e293b', fontFamily: 'Inter, sans-serif' }}
              >
                {total}
              </tspan>
              <tspan
                x="50%"
                dy="18"
                style={{ fontSize: '10px', fill: '#94a3b8', fontFamily: 'Inter, sans-serif' }}
              >
                signals
              </tspan>
            </text>
          )}
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
