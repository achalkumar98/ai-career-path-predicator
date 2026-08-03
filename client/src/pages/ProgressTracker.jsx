import { useEffect, useState } from 'react';
import axios from 'axios';
import History from '../components/History';

const ProgressTracker = () => {
  const [historyData, setHistoryData] = useState([]);

  const fetchHistory = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/assessment/history', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setHistoryData(res.data);
      console.log(res.data)
    } catch (err) {
      console.error('History fetch error:', err);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400  flex items-center justify-center p-4">
    <div className=" bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500/90 backdrop-blur-md flex flex-col items-center justify-center p-8 md:p-12 rounded-3xl shadow-2xl w-full max-w-3xl">
      <h1 className="text-4xl md:text-5xl font-extrabold text-indigo-700 mb-8 text-center drop-shadow-lg">
        📈 Progress Tracker
      </h1>
      
      {/* History Component */}
      <History historyData={historyData} />
    </div>
  </div>
  

  );
};

export default ProgressTracker;
