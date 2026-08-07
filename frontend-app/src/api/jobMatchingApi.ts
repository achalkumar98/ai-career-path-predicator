import api from '@/lib/axios';

export const findJobMatchesApi = (skills: string[], interests: string[]) =>
  api.post('/job-matching', { skills, interests });
