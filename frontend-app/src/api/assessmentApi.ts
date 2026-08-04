import api from '@/lib/axios';

export const submitAssessmentApi = (skills: string[], interests: string[]) =>
  api.post('/api/assessment', { skills, interests });

export const getAssessmentHistoryApi = () =>
  api.get('/api/assessment/history');
