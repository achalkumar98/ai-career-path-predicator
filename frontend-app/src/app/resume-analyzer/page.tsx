import ResumeNLP from '@/components/ResumeNLP';

export default function ResumeAnalyzer() {
  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>NLP Analysis</p>
          <h1 className="text-3xl font-bold text-white mb-2">Resume Analyzer 📄</h1>
          <p style={{ color: 'var(--text-muted)' }}>Upload your PDF resume and get AI-powered skill extraction and feedback.</p>
        </div>
        <ResumeNLP />
      </div>
    </div>
  );
}
