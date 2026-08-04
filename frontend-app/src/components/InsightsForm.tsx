'use client';
import { getInsightsApi } from '@/api/insightsApi';

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
      alert('Error fetching insights. Is your backend running?');
    }
    setLoading(false);
  };

  return (
    <div className="glass p-6 mb-6">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            Tell us about yourself — your goals, values, and personality:
          </label>
          <textarea
            rows={5}
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="input-dark resize-none"
            placeholder="e.g., I enjoy helping others, love solving logical problems, and prefer remote work..."
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn-accent w-full py-3">
          {loading ? 'Analyzing...' : 'Get My AI Insight →'}
        </button>
      </form>
    </div>
  );
}
