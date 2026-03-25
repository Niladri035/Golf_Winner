import { api } from '../request';

export const leaderboardApi = {
  getGlobal: async (page = 1, limit = 10) => {
    const res = await api.get(`leaderboard?page=${page}&limit=${limit}`);
    return res.data;
  }
};
