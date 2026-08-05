import api from '@/lib/axios';

export const sendChatMessageApi = (message: string) =>
  api.post('/chat', { message });
