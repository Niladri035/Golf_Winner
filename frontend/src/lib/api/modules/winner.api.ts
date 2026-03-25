import { api } from '../request';

export const winnerApi = {
  getLatest: async () => {
    const res = await api.get('winners/latest');
    return res.data;
  },
  getHistory: async (page = 1, limit = 10) => {
    const res = await api.get(`winners?page=${page}&limit=${limit}`);
    return res.data;
  }
};
