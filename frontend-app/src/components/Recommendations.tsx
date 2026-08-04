interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (!recommendations.length) return null;

  return (
    <div className="glass" style={{ marginTop: 'var(--space-6)', padding: 'var(--space-7)' }}>
      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-surface-raised)', display: 'inline-block', flexShrink: 0 }} />
        AI Recommendations
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
        {recommendations.map((career, index) => (
          <div
            key={index}
            style={{
              padding: 'var(--space-6)',
              borderRadius: 'var(--radius-xs)',
              fontSize: 'var(--font-size-md)',
              lineHeight: '1.6',
              color: 'var(--color-text-secondary)',
              background: 'rgba(34,85,236,0.04)',
              border: '1px solid rgba(34,85,236,0.12)',
            }}
          >
            {career}
          </div>
        ))}
      </div>
    </div>
  );
}
