import React from 'react';
import { useNavigate } from 'react-router';

const Homepage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user')) || { name: "Guest" };

  return (
    <div className="max-w-7xl mx-auto p-6 text-black">
      {/* Welcome */}
      <h1 className="text-4xl font-bold mb-2">Welcome, {user.name}! 👋</h1>
      <p className="text-lg mb-10">
        Your personalized journey to career success starts here. Explore, Learn, and Achieve with AI-powered guidance! 🚀
      </p>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">

        {/* Career Navigator */}
        <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 bg-opacity-10 backdrop-blur-lg rounded-xl p-6 hover:scale-105 transition">
          <h2 className="text-2xl font-semibold mb-2">Career Navigator</h2>
          <p className="mb-4">Discover career paths matched to your skills, interests, and aspirations with AI insights.</p>
          <button onClick={() => navigate("/career-navigator")} className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white font-bold px-4 py-2 rounded hover:bg-indigo-100">
            Explore Careers
          </button>
        </div>

        {/* Progress Tracker */}
        <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 bg-opacity-10 backdrop-blur-lg rounded-xl p-6 hover:scale-105 transition">
          <h2 className="text-2xl font-semibold mb-2">Progress Tracker</h2>
          <p className="mb-4">Track your skill growth, completed courses, and achievements along your career journey.</p>
          <button onClick={() => navigate("/progress-tracker")} className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white font-bold px-4 py-2 rounded hover:bg-indigo-100">
            Track Now
          </button>
        </div>

        {/* Resume Analyzer */}
        <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 bg-opacity-10 backdrop-blur-lg rounded-xl p-6 hover:scale-105 transition">
          <h2 className="text-2xl font-semibold mb-2">Resume Analyzer</h2>
          <p className="mb-4">Optimize your resume with AI-based feedback and keyword matching to target dream jobs.</p>
          <button onClick={() => navigate("/resume-analyzer")} className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white font-bold px-4 py-2 rounded hover:bg-indigo-100">
            Analyze Resume
          </button>
        </div>

        {/* Personality & Trend Insight */}
        <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 bg-opacity-10 backdrop-blur-lg rounded-xl p-6 hover:scale-105 transition">
          <h2 className="text-2xl font-semibold mb-2">Personality & Trend Insights</h2>
          <p className="mb-4">Understand your personality traits and stay updated with the latest job market trends.</p>
          <button onClick={() => navigate("/insights")} className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white font-bold px-4 py-2 rounded hover:bg-indigo-100">
            View Insights
          </button>
        </div>

        {/* AI Career Chatbot */}
        <div className=" bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 bg-opacity-10 backdrop-blur-lg rounded-xl p-6 hover:scale-105 transition">
          <h2 className="text-2xl font-semibold mb-2">Career Assistant (AI Chatbot)</h2>
          <p className="mb-4">Ask anything about careers, skills, trends, or jobs — get instant AI-driven guidance!</p>
          <button onClick={() => navigate("/chatbot")} className="bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white  font-bold px-4 py-2 rounded hover:bg-indigo-100">
            Chat Now
          </button>
        </div>

      </div>

      {/* Motivation Quote */}
      <div className="mt-16 text-center italic text-2xl">
        "Your future is created by what you do today, not tomorrow." ✨
      </div>
    </div>
  );
};

export default Homepage;
