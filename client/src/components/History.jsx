import React from "react";

const History = ({ historyData }) => {
  return (
    <><div className="p-4 bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 rounded-xl shadow-md max-w-2xl w-full mb-10">
    <h2 className="text-xl font-bold mb-4 text-white">Insight History</h2>
    {historyData.length === 0 ? (
      <p className="text-white">No history found.</p>
    ) : (
      <ul className="space-y-4">
        {historyData.insight.map((item, index) => (
          <li
            key={item._id || index}
            className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 p-4 rounded-lg shadow text-white"
          >
            <p className="text-sm text-gray-100">
              🕒 {new Date(item.createdAt || item.date).toLocaleString()}
            </p>
            <p><strong>Input</strong> {item.userInput}</p>
            <p><strong>Recommended Careers</strong> {item.aiInsight}</p>
            
            
          </li>
        ))}
      </ul>
    )}
  </div>
  <div className="p-4 bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 rounded-xl shadow-md max-w-2xl w-full mb-10">
      <h2 className="text-xl font-bold mb-4 text-white">Assessment History</h2>
      {historyData.length === 0 ? (
        <p className="text-white">No history found.</p>
      ) : (
        <ul className="space-y-4">
          {historyData.assessments.map((item, index) => (
            <li
              key={item._id || index}
              className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 p-4 rounded-lg shadow text-white"
            >
              <p className="text-sm text-gray-100">
                🕒 {new Date(item.createdAt || item.date).toLocaleString()}
              </p>
              <p><strong>Skills:</strong> {item.skills?.join(", ")}</p>
              <p><strong>Interests:</strong> {item.interests?.join(", ")}</p>
              
              {/* 🛠️ NEW WAY: show recommendedCareers list */}
              <div className="mt-2">
                <strong>Recommended Careers:</strong>
                <ul className="list-disc list-inside mt-1 space-y-1">
                  {item.recommendedCareers?.map((career, i) => (
                    <li key={i}>{career}</li>
                  ))}
                </ul>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  </>
    
  );
};

export default History;
