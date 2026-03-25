import { api } from '../request';

export const subscriptionApi = {
  createSession: async (priceId: string) => {
    const res = await api.post('subscriptions/checkout', { priceId });
    return res.data;
  },
  // Added for compatibility with subscribe/page.tsx
  createCheckout: async (plan: 'monthly' | 'yearly') => {
    const res = await api.post('subscriptions/checkout', { plan });
    return res.data;
  },
  getPortalUrl: async () => {
    const res = await api.post('subscriptions/portal');
    return res.data;
  },
  getStatus: async () => {
    // Note: If no backend route, this might need to be removed or updated
    const res = await api.get('subscriptions/status');
    return res.data;
  }
};
