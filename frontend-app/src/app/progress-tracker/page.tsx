'use client';
import { useEffect, useState } from 'react';
import { getAssessmentHistoryApi } from '@/api/assessmentApi';
import History from '@/components/History';

export default function ProgressTracker() {
  const [historyData, setHistoryData] = useState<any>([]);

  const fetchHistory = async () => {
    try {
      const res = await getAssessmentHistoryApi();
      setHistoryData(res.data);
    } catch (err) {
      console.error('History fetch error:', err);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>Your Journey</p>
          <h1 className="text-3xl font-bold text-white mb-2">Progress Tracker 📈</h1>
          <p style={{ color: 'var(--text-muted)' }}>Review your assessment history and track your career growth over time.</p>
        </div>
        <History historyData={historyData} />
      </div>
    </div>
  );
}
