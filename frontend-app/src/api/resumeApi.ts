import api from '@/lib/axios';

export const uploadResumeApi = (file: File) => {
  const formData = new FormData();
  formData.append('resume', file);
  return api.post('/api/resume/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};
