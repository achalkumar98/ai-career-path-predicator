import { useEffect, useState } from 'react';
import axios from 'axios';
import AssessmentForm from '../components/AssessmentForm';
import Recommendations from '../components/Recommendations';

const CareerNavigator = () => {
  const [skills, setSkills] = useState('');
  const [interests, setInterests] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
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
      const token = localStorage.getItem('token');
      const res = await axios.post(
        'http://localhost:5000/api/assessment',
        { skills: cleanedSkills, interests: cleanedInterests },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setRecommendations([res.data.insight]);
    } catch (err) {
      console.error(err);
      alert("Error: Make sure you're logged in and your server is running.");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 flex items-center justify-center p-4 sm:p-6">
    <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 backdrop-blur-xl shadow-2xl rounded-3xl p-6 sm:p-10 w-full max-w-lg sm:max-w-3xl">
      <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-white mb-6 sm:mb-8 drop-shadow-lg">
        🚀 Career Navigator
      </h1>
      <AssessmentForm
        skills={skills}
        setSkills={setSkills}
        interests={interests}
        setInterests={setInterests}
        loading={loading}
        handleSubmit={handleSubmit}
      />
      <Recommendations recommendations={recommendations} />
    </div>
  </div>
  );
};

export default CareerNavigator;
