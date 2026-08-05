import api from '@/lib/axios';

export const getInsightsApi = (input: string) =>
  api.post('/insights', { input });
