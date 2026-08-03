import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("adarsh123@gmail.com");
  const [password, setPassword] = useState("Adarsh@123");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user",JSON.stringify( res.data.user));
      
      navigate("/homePage"); // redirect to home
    } catch (err) {
      alert("Login failed: " + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 via-teal-400 to-cyan-400 text-white">
      <form
        onSubmit={handleSubmit}
        className="bg-gradient-to-br from-cyan-400 via-teal-400 to-blue-500 text-black p-10 rounded-2xl shadow-lg w-96"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-indigo-600">Login</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium">Email</label>
          <input
            type="email"
            className="w-full p-2 border border-gray-300 rounded bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block mb-1 font-medium">Password</label>
          <input
            type="password"
            className="w-full p-2 border border-gray-300 rounded bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gradient-to-br from-blue-700 via-teal-600 to-cyan-600 text-white hover:cursor-pointer py-2 px-4 rounded font-semibold transition"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;
