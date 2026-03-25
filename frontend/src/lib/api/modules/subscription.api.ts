import { api } from '../request';

export const subscriptionApi = {
  createSession: async (priceId: string) => {
    const res = await api.post('subscriptions/checkout', { priceId });
    return res.data;
  },
  getPortalUrl: async () => {
    const res = await api.get('subscriptions/portal');
    return res.data;
  },
  getStatus: async () => {
    const res = await api.get('subscriptions/status');
    return res.data;
  }
};
