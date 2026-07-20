'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, ShoppingBag, Package } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { logoutRequest } from '@/lib/api/auth';

export function AccountMenu() {
  const router = useRouter();
  const { isAuthenticated, user, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [open, setOpen] = useState(false);

  // zustand persist only reads localStorage after the client mounts —
  // wait one tick so we don't briefly show "logged out" for a logged-in user.
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="h-9 w-9 rounded-full" />;
  }

  if (!isAuthenticated || !user) {
    return (
      <Link
        href="/login"
        aria-label="Sign in"
        className="rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
      >
        <User size={19} />
      </Link>
    );
  }

  const handleLogout = () => {
    const refreshToken = useAuthStore.getState().refreshToken;
    if (refreshToken) {
      logoutRequest(refreshToken).catch(() => {
        // Best-effort — even if this fails (e.g. API unreachable), we still
        // clear the local session below so the user is logged out client-side.
      });
    }
    logout();
    setOpen(false);
    router.push('/');
  };

  return (
    <div className="relative" onMouseLeave={() => setOpen(false)}>
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label="Account menu"
        className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-semibold text-white transition hover:bg-white/20"
      >
        {user.firstName.charAt(0).toUpperCase()}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 top-full z-30 mt-2 min-w-[200px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900"
          >
            <p className="truncate px-3 py-2 text-sm font-medium text-gray-900 dark:text-white">
              Hi, {user.firstName}
            </p>
            <Link
              href="/orders"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <Package size={15} />
              My Orders
            </Link>
            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
            >
              <ShoppingBag size={15} />
              My Cart
            </Link>
            <button
              onClick={handleLogout}
              className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
            >
              <LogOut size={15} />
              Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
