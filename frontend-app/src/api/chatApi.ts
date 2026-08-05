import api from '@/lib/axios';

// Send chat message (existing)
export const sendChatMessageApi = (message: string) =>
  api.post('/api/chat', { message });

// Get chat history with personalized greeting (NEW)
export const getChatHistoryApi = () =>
  api.get('/api/chat');

// Clear chat history (NEW)
export const clearChatHistoryApi = () =>
  api.delete('/api/chat');