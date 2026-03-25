'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '@/store/authStore';
import { FullPageLoader } from '@/components/ui/LoadingSpinner';
import { ApiInterceptorManager } from '@/lib/api/ApiInterceptorManager';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { isLoading, isAuthenticated } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isLoading) {
    return <FullPageLoader />;
  }

  return (
    <>
      <ApiInterceptorManager />
      {children}
    </>
  );
}
