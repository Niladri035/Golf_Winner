import { api } from '../request';

export const scoreApi = {
  submitScore: async (score: number, drawId: string) => {
    const res = await api.post('scores', { score, drawId });
    return res.data;
  },
  getUserScores: async () => {
    const res = await api.get('scores/history');
    return res.data;
  },
  getDrawScores: async (drawId: string) => {
    const res = await api.get(`scores/draw/${drawId}`);
    return res.data;
  },
  // Added for compatibility with dashboard/scores/page.tsx
  getAll: async () => {
    const res = await api.get('scores');
    return res.data;
  },
  add: async (value: number, date: string) => {
    const res = await api.post('scores', { value, date });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`scores/${id}`);
    return res.data;
  }
};
