// client/src/App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Insights from './pages/Insights';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import LandingPage from './pages/LandingPage';
import Homepage from './pages/Homepage';
import CareerNavigator from './pages/CareerNavigator';
import ProgressTracker from './pages/ProgressTracker';
import ResumeAnalyzer from './pages/ResumeAnalyzer';
import ChatAssistant from './pages/ChatAssistant';
import Sidebar from './components/Sidebar';
import { useState } from 'react';


function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // 👈 control sidebar

  return (
    <Router>
      <div className="flex">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        
        <main
          className={`flex-1 transition-all duration-300 p-4 bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 min-h-screen ${
            isSidebarOpen ? 'ml-64' : 'ml-20'
          }`}
        >
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/homepage" element={<Homepage />} />
            <Route path="/career-navigator" element={<CareerNavigator />} />
            <Route path="/progress-tracker" element={<ProgressTracker />} />
            <Route path="/resume-analyzer" element={<ResumeAnalyzer />} />
            <Route path="/chatbot" element={<ChatAssistant />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;


