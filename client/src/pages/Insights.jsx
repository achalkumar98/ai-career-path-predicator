import { useState } from 'react';
import InsightsForm from '../components/InsightsForm';
import InsightsResult from '../components/InsightsResult';

const Insights = () => {
  const [userInput, setUserInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 p-4 sm:p-6 flex flex-col items-center justify-center">
  <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 shadow-2xl rounded-3xl p-6 sm:p-10 max-w-3xl w-full">
    <h1 className="text-2xl sm:text-4xl font-extrabold text-center text-white mb-6 sm:mb-8">
      Personality & Trend Insight 🔍
    </h1>

    <InsightsForm
      userInput={userInput}
      setUserInput={setUserInput}
      setResult={setResult}
      setLoading={setLoading}
      loading={loading}
    />

    <InsightsResult result={result} loading={loading} />
  </div>
</div>

  );
};

export default Insights;
