interface InsightsResultProps {
  result: string | null;
  loading: boolean;
}

export default function InsightsResult({ result, loading }: InsightsResultProps) {
  if (!result || loading) return null;

  const splitContent = (content: string) => {
    return content.split('\n\n').map((section, index) => {
      if (section.includes('*') || section.includes('-')) {
        const items = section.split('\n').filter((line) => line.startsWith('*') || line.startsWith('-'));
        return (
          <ul key={index} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', paddingLeft: 'var(--space-5)' }}>
            {items.map((item, i) => (
              <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>
                <span style={{ color: 'var(--color-surface-raised)', marginTop: '2px', flexShrink: 0 }}>›</span>
                {item.replace(/^[-*]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }
      return <p key={index} style={{ fontSize: 'var(--font-size-md)', lineHeight: '1.7', color: 'var(--color-text-secondary)' }}>{section}</p>;
    });
  };

  return (
    <div className="glass" style={{ padding: 'var(--space-7)' }}>
      <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-surface-raised)', display: 'inline-block', flexShrink: 0 }} />
        Your AI Career Insight 🚀
      </h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)' }}>{splitContent(result)}</div>
    </div>
  );
}
