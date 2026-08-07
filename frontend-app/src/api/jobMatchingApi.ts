import api from '@/lib/axios';

export const findJobMatchesApi = (keyword: string, location: string) =>
  api.post('/job-matching', { keyword, location });
