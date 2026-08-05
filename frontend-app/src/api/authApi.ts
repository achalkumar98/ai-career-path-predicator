import api from '@/lib/axios';

export const loginApi = (email: string, password: string) =>
  api.post('/auth/login', { email, password });

export const registerApi = (name: string, email: string, password: string) =>
  api.post('/auth/register', { name, email, password });

export const forgotPasswordApi = (email: string) =>
  api.post('/auth/forgot-password', { email });

export const resetPasswordApi = (token: string, password: string) =>
  api.post('/auth/reset-password', { token, password });

export const getProfileApi = () =>
  api.get('/auth/profile');

export const updateProfileApi = (data: { name?: string; email?: string; bio?: string; phone?: string; location?: string }) =>
  api.put('/auth/profile', data);
