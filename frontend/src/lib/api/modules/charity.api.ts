export const charityApi = {
  getAll: async () => {
    const { api } = await import('../request');
    const res = await api.get('charities');
    return res.data;
  },
  selectForUser: async (charityId: string) => {
    const { api } = await import('../request');
    const res = await api.put('users/profile', { selectedCharity: charityId });
    return res.data;
  }
};
