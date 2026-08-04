interface RecommendationsProps {
  recommendations: string[];
}

export default function Recommendations({ recommendations }: RecommendationsProps) {
  if (!recommendations.length) return null;

  return (
    <div className="glass mt-6 p-6">
      <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <span className="w-2 h-2 rounded-full inline-block" style={{ background: 'var(--accent)' }} />
        AI Recommendations
      </h2>
      <div className="space-y-3">
        {recommendations.map((career, index) => (
          <div
            key={index}
            className="p-4 rounded-lg text-sm leading-relaxed"
            style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)', color: 'var(--text-primary)' }}
          >
            {career}
          </div>
        ))}
      </div>
    </div>
  );
}
