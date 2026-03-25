import { api } from '../request';

export const adminApi = {
  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },
  getPendingWinners: async () => {
    const res = await api.get('/winners?status=pending_review');
    return res.data;
  },
  verifyWinner: async (winnerId: string, status: 'verified' | 'rejected', notes?: string) => {
    const res = await api.put(`/winners/${winnerId}/verify`, { 
      approve: status === 'verified', 
      rejectionReason: notes 
    });
    return res.data;
  },
  getCharities: async () => {
    const res = await api.get('/charities');
    return res.data;
  },
  createCharity: async (data: any) => {
    const res = await api.post('/charities', data);
    return res.data;
  },
  updateCharity: async (id: string, data: any) => {
    const res = await api.put(`/charities/${id}`, data);
    return res.data;
  },
  deleteCharity: async (id: string) => {
    const res = await api.delete(`/charities/${id}`);
    return res.data;
  },
  getUsers: async (page = 1, limit = 20) => {
    const res = await api.get(`/admin/users?page=${page}&limit=${limit}`);
    return res.data;
  },
  activateUser: async (userId: string) => {
    const res = await api.patch(`/admin/users/${userId}/activate`);
    return res.data;
  }
};
