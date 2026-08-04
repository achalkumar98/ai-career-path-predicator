import api from '@/lib/axios';

export const loginApi = (email: string, password: string) =>
  api.post('/api/auth/login', { email, password });

export const registerApi = (name: string, email: string, password: string) =>
  api.post('/api/auth/register', { name, email, password });

export const forgotPasswordApi = (email: string) =>
  api.post('/api/auth/forgot-password', { email });

export const resetPasswordApi = (token: string, password: string) =>
  api.post('/api/auth/reset-password', { token, password });

export const getProfileApi = () =>
  api.get('/api/auth/profile');

export const updateProfileApi = (data: { name?: string; email?: string; bio?: string; phone?: string; location?: string }) =>
  api.put('/api/auth/profile', data);
