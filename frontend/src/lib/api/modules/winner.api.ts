import { api } from '../request';

export const winnerApi = {
  getWinnerStatus: async () => {
    const res = await api.get('/winners/me');
    return res.data;
  },
  submitProof: async (formData: FormData) => {
    const res = await api.post('/winners/proof', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return res.data;
  }
};
