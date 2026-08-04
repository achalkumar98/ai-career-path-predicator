'use client';
import { useState, useEffect } from 'react';
import { TrendingUp, Clock, BarChart2, X, Loader2, RefreshCw } from 'lucide-react';
import { getAssessmentHistoryApi } from '@/api/assessmentApi';
import History from '@/components/History';

export default function ProgressTracker() {
  const [open, setOpen] = useState(false);
  const [historyData, setHistoryData] = useState<any>([]);
  const [loading, setLoading] = useState(false);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await getAssessmentHistoryApi();
      setHistoryData(res.data);
    } catch (err) {
      console.error('History fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchHistory(); }, []);

  const highlights = [
    { icon: BarChart2, label: 'Assessment History', desc: 'Review all your past career assessments' },
    { icon: TrendingUp, label: 'Growth Tracking', desc: 'See how your skills evolve over time' },
    { icon: Clock, label: 'Timeline View', desc: 'Chronological view of your journey' },
  ];

  return (
    <div style={{ minHeight: 'calc(100vh - 56px)', background: '#f9fafb' }}>
      {/* Hero */}
      <div style={{ background: 'linear-gradient(135deg, #f0fdf4 0%, #f9fafb 60%)', borderBottom: '1px solid #e5e7eb', padding: '64px 48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', borderRadius: '9999px', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', fontSize: '12px', fontWeight: 600, color: '#059669', marginBottom: '24px' }}>
          <TrendingUp size={13} />
          Your Journey
        </div>
        <h1 style={{ fontSize: '42px', fontWeight: 800, color: '#0f1729', lineHeight: 1.15, marginBottom: '16px' }}>
          Progress<br /><span style={{ color: '#059669' }}>Tracker</span>
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280', maxWidth: '520px', margin: '0 auto 32px', lineHeight: 1.7 }}>
          Review your assessment history, track skill growth, and see how far you&apos;ve come on your career journey.
        </p>
        <button
          onClick={() => setOpen(true)}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '13px 28px', borderRadius: '10px', background: '#059669', color: '#fff', fontSize: '14px', fontWeight: 600, border: 'none', cursor: 'pointer', boxShadow: '0 4px 14px rgba(5,150,105,0.3)', transition: 'background 150ms' }}
          onMouseEnter={e => (e.currentTarget.style.background = '#047857')}
          onMouseLeave={e => (e.currentTarget.style.background = '#059669')}
        >
          View My Progress
          <TrendingUp size={15} />
        </button>
      </div>

      {/* Highlights */}
      <div style={{ padding: '48px', maxWidth: '900px', margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
          {highlights.map(({ icon: Icon, label, desc }) => (
            <div key={label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '24px', transition: 'box-shadow 200ms, transform 200ms' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.boxShadow = 'none'; (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
                <Icon size={18} style={{ color: '#059669' }} />
              </div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: '#0f1729', marginBottom: '6px' }}>{label}</p>
              <p style={{ fontSize: '13px', color: '#6b7280', lineHeight: 1.6 }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Modal */}
      {open && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,41,0.5)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '24px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '640px', maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 40px rgba(0,0,0,0.15)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: '#f0fdf4', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <TrendingUp size={15} style={{ color: '#059669' }} />
                </div>
                <p style={{ fontSize: '14px', fontWeight: 700, color: '#0f1729' }}>Progress Tracker</p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button onClick={fetchHistory} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }} title="Refresh">
                  <RefreshCw size={15} />
                </button>
                <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#9ca3af', padding: '4px' }}>
                  <X size={18} />
                </button>
              </div>
            </div>
            <div style={{ padding: '24px', overflowY: 'auto', flex: 1 }}>
              {loading ? (
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '48px', gap: '10px', color: '#9ca3af' }}>
                  <Loader2 size={18} style={{ animation: 'spin 1s linear infinite' }} />
                  <span style={{ fontSize: '13px' }}>Loading history...</span>
                </div>
              ) : (
                <History historyData={historyData} />
              )}
            </div>
          </div>
        </div>
      )}
      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
