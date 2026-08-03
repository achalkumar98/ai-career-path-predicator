// Recommendations.jsx
import React from "react";

const Recommendations = ({ recommendations }) => {
  if (!recommendations.length) return null;

  return (
    <div className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 mt-10 rounded-2xl p-4 sm:p-8 shadow-lg">
    <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6 text-center">
      💡 Recommended Careers
    </h2>
    <ul className="list-disc list-inside space-y-3 sm:space-y-4 text-white text-base sm:text-lg">
      {recommendations.map((career, index) => (
        <li key={index} className="pl-2">
          {career}
        </li>
      ))}
    </ul>
  </div>
  
  );
};

export default Recommendations;
