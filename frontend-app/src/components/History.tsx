interface InsightItem {
  _id?: string;
  createdAt?: string;
  date?: string;
  userInput: string;
  aiInsight: string;
}

interface AssessmentItem {
  _id?: string;
  createdAt?: string;
  date?: string;
  skills?: string[];
  interests?: string[];
  recommendedCareers?: string[];
}

interface HistoryData {
  insight?: InsightItem[];
  assessments?: AssessmentItem[];
}

interface HistoryProps {
  historyData: HistoryData | null;
}

export default function History({ historyData }: HistoryProps) {
  const isEmpty = !historyData || (!historyData?.insight?.length && !historyData?.assessments?.length);

  if (isEmpty) {
    return (
      <div className="glass" style={{ padding: 'var(--space-8)', textAlign: 'center' }}>
        <p style={{ fontSize: '2rem', marginBottom: 'var(--space-4)' }}>📭</p>
        <p style={{ fontSize: 'var(--font-size-lg)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-3)' }}>No history yet</p>
        <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-tertiary)' }}>Complete an assessment or insight to see your history here.</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-7)' }}>

      {/* Insight History */}
      {historyData?.insight?.length > 0 && (
        <div className="glass" style={{ padding: 'var(--space-7)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--color-surface-raised)', display: 'inline-block', flexShrink: 0 }} />
            Insight History
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {historyData.insight.map((item: InsightItem, index: number) => (
              <div
                key={item._id || index}
                style={{
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(34,85,236,0.04)',
                  border: '1px solid rgba(34,85,236,0.12)',
                }}
              >
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
                  🕒 {new Date(item.createdAt || item.date).toLocaleString()}
                </p>
                <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Input:</span> {item.userInput}
                </p>
                <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)' }}>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Result:</span> {item.aiInsight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessment History */}
      {historyData?.assessments?.length > 0 && (
        <div className="glass" style={{ padding: 'var(--space-7)' }}>
          <h2 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#7c3aed', display: 'inline-block', flexShrink: 0 }} />
            Assessment History
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {historyData.assessments.map((item: AssessmentItem, index: number) => (
              <div
                key={item._id || index}
                style={{
                  padding: 'var(--space-6)',
                  borderRadius: 'var(--radius-xs)',
                  background: 'rgba(124,58,237,0.04)',
                  border: '1px solid rgba(124,58,237,0.12)',
                }}
              >
                <p style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
                  🕒 {new Date(item.createdAt || item.date).toLocaleString()}
                </p>
                <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-2)' }}>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Skills:</span> {item.skills?.join(', ')}
                </p>
                <p style={{ fontSize: 'var(--font-size-md)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)' }}>
                  <span style={{ color: 'var(--color-text-tertiary)' }}>Interests:</span> {item.interests?.join(', ')}
                </p>
                {item.recommendedCareers?.length > 0 && (
                  <div>
                    <p style={{ fontSize: 'var(--font-size-xs)', fontWeight: 500, color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-3)' }}>
                      Recommended Careers:
                    </p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)' }}>
                      {item.recommendedCareers.map((career: string, i: number) => (
                        <span
                          key={i}
                          style={{
                            fontSize: 'var(--font-size-xs)',
                            padding: `var(--space-2) var(--space-4)`,
                            borderRadius: 'var(--radius-lg)',
                            background: 'rgba(34,85,236,0.08)',
                            color: 'var(--color-surface-raised)',
                            border: '1px solid rgba(34,85,236,0.2)',
                          }}
                        >
                          {career}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
