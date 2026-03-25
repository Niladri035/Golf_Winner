import { api } from '../request';

export const drawApi = {
  getLatest: async () => {
    const res = await api.get('draws/latest');
    return res.data;
  },
  getAll: async (page = 1) => {
    const res = await api.get(`draws?page=${page}`);
    return res.data;
  },
  runSimulatedDraw: async () => {
    const res = await api.post('draws/run', { mode: 'weighted' });
    return res.data;
  }
};
