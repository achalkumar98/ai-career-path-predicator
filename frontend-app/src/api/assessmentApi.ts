import api from '@/lib/axios';

export const submitAssessmentApi = (skills: string[], interests: string[]) =>
  api.post('/assessment', { skills, interests });

export const getAssessmentHistoryApi = () =>
  api.get('/assessment/history');
