import { useState } from "react";
import axios from "axios";

export default function AssessmentForm() {
  const [skills, setSkills] = useState("");
  const [interests, setInterests] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResults([]);

    // Clean and split inputs into arrays
    const cleanedSkills = skills.split(",").map((s) => s.trim()).filter(Boolean);
    const cleanedInterests = interests.split(",").map((i) => i.trim()).filter(Boolean);

    if (cleanedSkills.length === 0 || cleanedInterests.length === 0) {
      alert("Please enter at least one skill and one interest.");
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/assessment",
        {
          skills: cleanedSkills,
          interests: cleanedInterests,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Assuming the response returns a single insight string
      setResults([res.data.insight]);
    } catch (err) {
      console.error("Axios Error:", err);
      alert("Error fetching recommendations.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-4 sm:p-6">
  <div className="bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 backdrop-blur-lg shadow-xl p-6 sm:p-8 rounded-2xl w-full max-w-md sm:max-w-2xl">
    <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-center">
      🚀 Career Recommendation
    </h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-1 font-medium">Your Skills</label>
        <textarea
          rows="2"
          className="w-full rounded-lg p-3 bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white outline-none"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          required
          placeholder="e.g. JavaScript, React, Machine Learning"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Your Interests</label>
        <textarea
          rows="2"
          className="w-full rounded-lg p-3 bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white outline-none"
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          required
          placeholder="e.g. AI, Web Development, Finance"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white hover:bg-indigo-500 transition rounded-lg font-semibold"
      >
        {loading ? "Analyzing..." : "Get My Career Suggestions"}
      </button>
    </form>

    {results.length > 0 && (
      <div className="mt-6">
        <h3 className="text-lg sm:text-xl font-semibold mb-2">💡 Recommended Careers:</h3>
        <ul className="list-disc pl-5 space-y-2 text-base sm:text-lg">
          {results.map((career, i) => (
            <li key={i}>{career}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
</div>

  );
}
