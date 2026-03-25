import { api } from '../request';

export const leaderboardApi = {
  getTopDonors: async () => {
    const res = await api.get('/leaderboard/top-donors');
    return res.data;
  }
};
