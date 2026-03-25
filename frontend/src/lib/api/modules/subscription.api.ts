import { api } from '../request';

export const subscriptionApi = {
  createCheckout: async (plan: 'monthly' | 'yearly') => {
    const res = await api.post('/subscriptions/checkout', { plan });
    return res.data;
  },
  createPortal: async () => {
    const res = await api.post('/subscriptions/portal');
    return res.data;
  }
};
