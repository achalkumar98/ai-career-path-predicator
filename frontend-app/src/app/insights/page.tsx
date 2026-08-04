'use client';
import { useState } from 'react';
import InsightsForm from '@/components/InsightsForm';
import InsightsResult from '@/components/InsightsResult';

export default function Insights() {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>AI Insights</p>
          <h1 className="text-3xl font-bold text-white mb-2">Personality & Trends 🔍</h1>
          <p style={{ color: 'var(--text-muted)' }}>Describe yourself and get AI-powered personality and career trend analysis.</p>
        </div>
        <InsightsForm userInput={userInput} setUserInput={setUserInput} setResult={setResult} setLoading={setLoading} loading={loading} />
        <InsightsResult result={result} loading={loading} />
      </div>
    </div>
  );
}
