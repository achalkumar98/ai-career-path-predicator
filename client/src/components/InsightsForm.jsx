import axios from 'axios';

const InsightsForm = ({ userInput, setUserInput, setResult, setLoading, loading }) => {
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userInput.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/insights',
        { input: userInput },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setResult(res.data.insight || res.data); // based on your API structure
    } catch (err) {
      console.error(err);
      alert('Error fetching insights. Is your backend running?');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
    <label className="block text-lg sm:text-xl text-white font-semibold">
      Tell us about yourself (your goals, values, personality):
    </label>
    <textarea
      rows="5"
      value={userInput}
      onChange={(e) => setUserInput(e.target.value)}
      className="w-full text-white bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-4 focus:ring-blue-300"
      placeholder="e.g., I enjoy helping others, love solving logical problems, and prefer remote work..."
      required
    ></textarea>
    <button
      type="submit"
      disabled={loading}
      className="w-full bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white py-3 rounded-lg font-semibold text-lg sm:text-xl hover:bg-indigo-600 transition-all focus:outline-none focus:ring-4 focus:ring-blue-300"
    >
      {loading ? 'Analyzing...' : 'Get My AI Insight'}
    </button>
  </form>
  );
};

export default InsightsForm;
