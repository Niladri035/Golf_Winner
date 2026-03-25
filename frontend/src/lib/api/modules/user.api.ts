import { api } from '../request';

export const userApi = {
  getProfile: async () => {
    const res = await api.get('users/profile');
    return res.data;
  },
  updateProfile: async (data: { name?: string; selectedCharity?: string; charityPercentage?: number }) => {
    const res = await api.put('users/profile', data);
    return res.data;
  }
};
