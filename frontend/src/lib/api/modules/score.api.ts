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
  }
};
