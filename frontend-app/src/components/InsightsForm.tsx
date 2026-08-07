'use client';
import { getInsightsApi } from '@/api/insightsApi';
import toast from 'react-hot-toast';

interface InsightsFormProps {
  userInput: string;
  setUserInput: (v: string) => void;
  setResult: (v: string | null) => void;
  setLoading: (v: boolean) => void;
  loading: boolean;
}

export default function InsightsForm({ userInput, setUserInput, setResult, setLoading, loading }: InsightsFormProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim()) return;
    setLoading(true);
    try {
      const res = await getInsightsApi(userInput);
      setResult(res.data.insight || res.data);
    } catch (err) {
      console.error(err);
      toast.error('Error fetching insights. Is your backend running?');
    }
    setLoading(false);
  };

  return (
    <div className="glass" style={{ padding: 'var(--space-7)', marginBottom: 'var(--space-6)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div>
          <label
            htmlFor="insight-input"
            style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}
          >
            Tell us about yourself — your goals, values, and personality:
          </label>
          <textarea
            id="insight-input"
            rows={5}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="input-dark"
            style={{ resize: 'none' }}
            placeholder="e.g., I enjoy helping others, love solving logical problems, and prefer remote work..."
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-accent w-full" style={{ padding: 'var(--space-4) var(--space-6)' }}>
          {loading ? 'Analyzing...' : 'Get My AI Insight →'}
        </button>
      </form>
    </div>
  );
}
