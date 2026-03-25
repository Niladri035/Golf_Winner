import { api } from '../request';

export const scoreApi = {
  getAll: async () => {
    const res = await api.get('/scores');
    return res.data;
  },
  add: async (value: number, date: string) => {
    const res = await api.post('/scores', { value, date });
    return res.data;
  },
  update: async (id: string, value?: number, date?: string) => {
    const res = await api.put(`/scores/${id}`, { value, date });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/scores/${id}`);
    return res.data;
  }
};
