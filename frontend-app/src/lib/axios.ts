import axios from 'axios';

const getBaseURL = () => {
  if (typeof window !== 'undefined') {
    if (process.env.NODE_ENV === 'production') {
      return process.env.NEXT_PUBLIC_BASE_API_URL || 'https://aicareernav/api/v1/';
    }

    return process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:5000/v1/';
  }

  if (process.env.NODE_ENV === 'production') {
    return process.env.BASE_API_URL || 'https://aicareernav/api/v1/';
  }

  return process.env.BASE_API_URL || 'http://localhost:5000/v1/';
};

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API_URL || 'http://localhost:5000/v1/',
});

api.interceptors.request.use((config) => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
