'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/auth-store';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

export function RequireAdmin({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, user } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  // zustand's persisted state only becomes available after the client mounts
  // and reads localStorage, so we wait one tick before deciding to redirect —
  // otherwise every refresh would briefly bounce a logged-in admin to /login.
  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!mounted) return;
    if (!isAuthenticated || !user || !ADMIN_ROLES.includes(user.role)) {
      router.replace('/login');
    }
  }, [mounted, isAuthenticated, user, router]);

  if (!mounted || !isAuthenticated || !user || !ADMIN_ROLES.includes(user.role)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
      </div>
    );
  }

  return <>{children}</>;
}
