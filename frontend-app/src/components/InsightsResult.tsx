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
          <ul key={index} className="space-y-2 pl-4">
            {items.map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-sm" style={{ color: 'var(--text-primary)' }}>
                <span style={{ color: 'var(--accent)', marginTop: '2px' }}>›</span>
                {item.replace(/^[-*]\s*/, '')}
              </li>
            ))}
          </ul>
        );
      }
      return <p key={index} className="text-sm leading-relaxed" style={{ color: 'var(--text-primary)' }}>{section}</p>;
    });
  };

  return (
    <div className="glass p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
        Your AI Career Insight 🚀
      </h2>
      <div className="space-y-4">{splitContent(result)}</div>
    </div>
  );
}
