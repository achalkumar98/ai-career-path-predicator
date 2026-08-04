interface HistoryProps {
  historyData: any;
}

export default function History({ historyData }: HistoryProps) {
  const isEmpty = !historyData || (!historyData?.insight?.length && !historyData?.assessments?.length);

  if (isEmpty) {
    return (
      <div className="glass p-10 text-center w-full">
        <p className="text-4xl mb-3">📭</p>
        <p className="font-medium text-white mb-1">No history yet</p>
        <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Complete an assessment or insight to see your history here.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Insight History */}
      {historyData?.insight?.length > 0 && (
        <div className="glass p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: 'var(--accent)' }} />
            Insight History
          </h2>
          <div className="space-y-3">
            {historyData.insight.map((item: any, index: number) => (
              <div key={item._id || index} className="p-4 rounded-lg" style={{ background: 'rgba(0,212,255,0.05)', border: '1px solid rgba(0,212,255,0.1)' }}>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>🕒 {new Date(item.createdAt || item.date).toLocaleString()}</p>
                <p className="text-sm text-white mb-1"><span style={{ color: 'var(--text-muted)' }}>Input:</span> {item.userInput}</p>
                <p className="text-sm text-white"><span style={{ color: 'var(--text-muted)' }}>Result:</span> {item.aiInsight}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Assessment History */}
      {historyData?.assessments?.length > 0 && (
        <div className="glass p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full" style={{ background: '#7c3aed' }} />
            Assessment History
          </h2>
          <div className="space-y-3">
            {historyData.assessments.map((item: any, index: number) => (
              <div key={item._id || index} className="p-4 rounded-lg" style={{ background: 'rgba(124,58,237,0.05)', border: '1px solid rgba(124,58,237,0.15)' }}>
                <p className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>🕒 {new Date(item.createdAt || item.date).toLocaleString()}</p>
                <p className="text-sm text-white mb-1"><span style={{ color: 'var(--text-muted)' }}>Skills:</span> {item.skills?.join(', ')}</p>
                <p className="text-sm text-white mb-2"><span style={{ color: 'var(--text-muted)' }}>Interests:</span> {item.interests?.join(', ')}</p>
                {item.recommendedCareers?.length > 0 && (
                  <div>
                    <p className="text-xs font-medium mb-1" style={{ color: 'var(--text-muted)' }}>Recommended Careers:</p>
                    <div className="flex flex-wrap gap-2">
                      {item.recommendedCareers.map((career: string, i: number) => (
                        <span key={i} className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(0,212,255,0.1)', color: 'var(--accent)', border: '1px solid rgba(0,212,255,0.2)' }}>
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
