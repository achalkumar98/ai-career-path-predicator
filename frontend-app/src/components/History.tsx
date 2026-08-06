export interface InsightItem {
  _id?: string;
  createdAt?: string;
  date?: string;
  userInput: string;
  aiInsight: string;
}

export interface AssessmentItem {
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
  const isEmpty =
    !historyData ||
    (!historyData.insight?.length && !historyData.assessments?.length);

  if (isEmpty) {
    return (
      <div style={{ padding: '48px', textAlign: 'center' }}>
        <p style={{ fontSize: '13px', color: '#9ca3af' }}>No history yet. Complete an assessment or insight to see your history here.</p>
      </div>
    );
  }

  const fmt = (d?: string) => (d ? new Date(d).toLocaleString() : '—');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

      {historyData?.insight && historyData.insight.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#2255ec', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
            Insight History
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historyData.insight.map((item, index) => (
              <div
                key={item._id || index}
                style={{ padding: '16px', borderRadius: '10px', background: 'rgba(34,85,236,0.04)', border: '1px solid rgba(34,85,236,0.12)' }}
              >
                <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>{fmt(item.createdAt ?? item.date)}</p>
                <p style={{ fontSize: '13px', color: '#374151', marginBottom: '6px' }}>
                  <span style={{ color: '#9ca3af' }}>Input: </span>{item.userInput}
                </p>
                <p style={{ fontSize: '13px', color: '#374151', lineHeight: 1.6 }}>
                  <span style={{ color: '#9ca3af' }}>Result: </span>{item.aiInsight}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {historyData?.assessments && historyData.assessments.length > 0 && (
        <div>
          <p style={{ fontSize: '11px', fontWeight: 700, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '12px' }}>
            Assessment History
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {historyData.assessments.map((item, index) => (
              <div
                key={item._id || index}
                style={{ padding: '16px', borderRadius: '10px', background: 'rgba(124,58,237,0.04)', border: '1px solid rgba(124,58,237,0.12)' }}
              >
                <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>{fmt(item.createdAt ?? item.date)}</p>
                <p style={{ fontSize: '13px', color: '#374151', marginBottom: '4px' }}>
                  <span style={{ color: '#9ca3af' }}>Skills: </span>{item.skills?.join(', ')}
                </p>
                <p style={{ fontSize: '13px', color: '#374151', marginBottom: '10px' }}>
                  <span style={{ color: '#9ca3af' }}>Interests: </span>{item.interests?.join(', ')}
                </p>
                {item.recommendedCareers && item.recommendedCareers.length > 0 && (
                  <div>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginBottom: '8px' }}>Recommended Careers:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {item.recommendedCareers.map((career, i) => (
                        <span
                          key={i}
                          style={{ fontSize: '12px', padding: '4px 10px', borderRadius: '9999px', background: 'rgba(34,85,236,0.08)', color: '#2255ec', border: '1px solid rgba(34,85,236,0.2)' }}
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
