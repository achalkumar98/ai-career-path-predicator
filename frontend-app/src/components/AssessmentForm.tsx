'use client';

interface AssessmentFormProps {
  skills: string;
  setSkills: (v: string) => void;
  interests: string;
  setInterests: (v: string) => void;
  loading: boolean;
  handleSubmit: (e: React.FormEvent) => void;
}

export default function AssessmentForm({ skills, setSkills, interests, setInterests, loading, handleSubmit }: AssessmentFormProps) {
  return (
    <div className="glass p-6 lg:p-8">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            Your Skills <span className="text-xs">(comma separated)</span>
          </label>
          <textarea
            rows={3}
            className="input-dark resize-none"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            placeholder="e.g. JavaScript, React, Machine Learning"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2" style={{ color: 'var(--text-muted)' }}>
            Your Interests <span className="text-xs">(comma separated)</span>
          </label>
          <textarea
            rows={3}
            className="input-dark resize-none"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            required
            placeholder="e.g. AI, Web Development, Finance"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-accent w-full py-3">
          {loading ? 'Analyzing...' : 'Get Career Suggestions →'}
        </button>
      </form>
    </div>
  );
}
