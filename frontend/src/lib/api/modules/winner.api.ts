import { api } from '../request';

export const winnerApi = {
  getLatest: async () => {
    const res = await api.get('winners/latest');
    return res.data;
  },
  getHistory: async (page = 1, limit = 10) => {
    const res = await api.get(`winners?page=${page}&limit=${limit}`);
    return res.data;
  },
  // Added for compatibility with winner-verification/page.tsx
  getWinnerStatus: async () => {
    const res = await api.get('winners/my');
    return res.data;
  },
  submitProof: async (formData: FormData) => {
    // Note: The winnerId needs to be extracted from the winning record in the component 
    // but the backend route is /api/winners/:winnerId/proof.
    // If the component passes just formData, we might need a different approach or 
    // the winnerId is in the formData.
    const res = await api.post('winners/proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};
