import { api } from '../request';

export const dashboardApi = {
  getOverview: async () => {
    const res = await api.get('/users/dashboard');
    return res.data;
  }
};
