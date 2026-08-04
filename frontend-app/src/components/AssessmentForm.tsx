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
    <div className="glass" style={{ padding: 'var(--space-7)' }}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-6)' }}>
        <div>
          <label
            htmlFor="skills"
            style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}
          >
            Your Skills <span style={{ fontWeight: 400, color: 'var(--color-text-tertiary)' }}>(comma separated)</span>
          </label>
          <textarea
            id="skills"
            rows={3}
            className="input-dark"
            style={{ resize: 'none' }}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            required
            placeholder="e.g. JavaScript, React, Machine Learning"
          />
        </div>
        <div>
          <label
            htmlFor="interests"
            style={{ display: 'block', fontSize: 'var(--font-size-xs)', fontWeight: 500, color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}
          >
            Your Interests <span style={{ fontWeight: 400, color: 'var(--color-text-tertiary)' }}>(comma separated)</span>
          </label>
          <textarea
            id="interests"
            rows={3}
            className="input-dark"
            style={{ resize: 'none' }}
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
            required
            placeholder="e.g. AI, Web Development, Finance"
          />
        </div>
        <button type="submit" disabled={loading} className="btn-accent w-full" style={{ padding: 'var(--space-4) var(--space-6)' }}>
          {loading ? 'Analyzing...' : 'Get Career Suggestions →'}
        </button>
      </form>
    </div>
  );
}
