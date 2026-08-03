// client/src/components/Sidebar.jsx
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router';
import { FaBars } from 'react-icons/fa'; // hamburger icon

const Sidebar = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem("user"));

    const navItems = [
        { path: "/homepage", label: "Home", icon: "🏠" },
        { path: "/career-navigator", label: "Career Navigator", icon: "🧭" },
        { path: "/progress-tracker", label: "Progress Tracker", icon: "📈" },
        { path: "/resume-analyzer", label: "Resume Analyzer", icon: "📄" },
        { path: "/insights", label: "Personality & Trends", icon: "💡" },
        { path: "/chatbot", label: "Chat Assistant", icon: "🤖" },
       
    ];

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <div className={`bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 text-white h-screen fixed top-0 left-0 transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
            <div className="flex items-center justify-between p-4">
                {isOpen && <Link to='/'><h1 className="font-bold text-xl">CareerAI</h1></Link>}
                <button onClick={toggleSidebar}>
                    <FaBars size={24} />
                </button>
            </div>

            {token ? (<><nav className="mt-8">
                <ul className="space-y-6">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <Link
                                to={item.path}
                                className={`flex items-center gap-3 p-2 rounded-lg mx-2 transition ${location.pathname === item.path
                                        ? 'bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600'
                                        : 'hover:bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600'
                                    }`}
                            >
                                <span className="text-2xl">{item.icon}</span>
                                {isOpen && <span className="text-base">{item.label}</span>}
                            </Link>
                        </li>
                    ))}
                </ul>
            </nav>
                {/* Logout Button */}
                <div className=" mt-8 mb-8 flex flex-col items-center">
                    <button
                        onClick={handleLogout}
                        className={`flex  items-center justify-center gap-3 p-2 rounded-lg bg-gradient-to-br from-red-600 via-pink-500 to-rose-500 hover:bg-red-600 mx-2 ${isOpen ? 'w-full' : 'w-10 h-10'
                            }`}
                    >
                        <span className="text-2xl">🚪</span>
                        {isOpen && <span>Logout</span>}
                    </button>
                </div></>) : (<div className="mt-8 mb-8 flex flex-col items-center gap-6">
  <Link
    to="/login"
    className={`flex items-center gap-3 p-2 rounded-lg mx-2 transition ${
      location.pathname === "/login"
        ? 'bg-gradient-to-br from-red-600 via-pink-500 to-rose-500'
        : 'hover:bg-gradient-to-br from-red-600 via-pink-500 to-rose-500'
    } ${isOpen ? 'w-full' : 'w-10 h-10'}`}
  >
    <span className="text-2xl">🔑</span>
    {isOpen && <span>Login</span>}
  </Link>

  <Link
    to="/register"
    className={`flex items-center gap-3 p-2 rounded-lg mx-2 transition ${
      location.pathname === "/register"
        ? 'bg-gradient-to-br from-red-600 via-pink-500 to-rose-500'
        : 'hover:bg-gradient-to-br from-red-600 via-pink-500 to-rose-500'
    } ${isOpen ? 'w-full' : 'w-10 h-10'}`}
  >
    <span className="text-2xl">📝</span>
    {isOpen && <span>Register</span>}
  </Link>
</div>
)
            }


        </div>
    );
};

export default Sidebar;
