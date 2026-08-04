'use client';
import { useState } from 'react';
import { submitAssessmentApi } from '@/api/assessmentApi';
import AssessmentForm from '@/components/AssessmentForm';
import Recommendations from '@/components/Recommendations';

export default function CareerNavigator() {
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const cleanedSkills = skills.split(',').map((s) => s.trim()).filter(Boolean);
    const cleanedInterests = interests.split(',').map((i) => i.trim()).filter(Boolean);
    if (!cleanedSkills.length || !cleanedInterests.length) {
      alert('Please enter at least one skill and interest.');
      setLoading(false);
      return;
    }
    try {
      const res = await submitAssessmentApi(cleanedSkills, cleanedInterests);
      setRecommendations([res.data.insight]);
    } catch (err) {
      console.error(err);
      alert("Error: Make sure you're logged in and your server is running.");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen p-6 lg:p-10" style={{ background: 'var(--bg-primary)' }}>
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-sm font-medium mb-2" style={{ color: 'var(--accent)' }}>AI-Powered</p>
          <h1 className="text-3xl font-bold text-white mb-2">Career Navigator 🚀</h1>
          <p style={{ color: 'var(--text-muted)' }}>Enter your skills and interests to get personalized career recommendations.</p>
        </div>
        <AssessmentForm skills={skills} setSkills={setSkills} interests={interests} setInterests={setInterests} loading={loading} handleSubmit={handleSubmit} />
        <Recommendations recommendations={recommendations} />
      </div>
    </div>
  );
}
