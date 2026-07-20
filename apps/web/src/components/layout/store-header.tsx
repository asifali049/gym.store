'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingBag, Gift, Menu, X, LogOut } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { AccountMenu } from './account-menu';
import { slugify } from '@/lib/slugify';
import { useAuthStore } from '@/lib/auth-store';
import { logoutRequest } from '@/lib/api/auth';

export function StoreHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [query, setQuery] = useState('');
  const { isAuthenticated, user, logout } = useAuthStore();

  useEffect(() => {
    if (mobileOpen) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileOpen]);

  return (
    <header className="sticky top-0 z-40 bg-gray-950">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="shrink-0 text-lg font-bold tracking-tight text-white">
          PEAK<span className="text-brand-accent">FUEL</span>
        </Link>

        <form
          onSubmit={(e) => e.preventDefault()}
          className="hidden flex-1 items-center gap-2 rounded-full bg-white px-4 py-2.5 md:flex"
        >
          <Search size={17} className="text-gray-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for whey, creatine, pre-workout..."
            className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
          />
        </form>

        <div className="ml-auto flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          <AccountMenu />
          <button
            aria-label="Rewards"
            className="hidden rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white sm:block"
          >
            <Gift size={19} />
          </button>
          <button
            aria-label="Wishlist"
            className="relative rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <Heart size={19} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-semibold text-white">
              0
            </span>
          </button>
          <Link
            href="/cart"
            aria-label="Cart"
            className="relative rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white"
          >
            <ShoppingBag size={19} />
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-semibold text-white">
              2
            </span>
          </Link>
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 text-gray-300 transition hover:bg-white/10 hover:text-white md:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      {/* Mobile search (below logo row, always visible on small screens) */}
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mx-4 mb-3 flex items-center gap-2 rounded-full bg-white px-4 py-2.5 md:hidden"
      >
        <Search size={17} className="text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for supplements..."
          className="flex-1 bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400"
        />
      </form>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-gray-950 md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-lg font-bold text-white">
                PEAK<span className="text-brand-accent">FUEL</span>
              </span>
              <div className="flex items-center gap-1">
                <ThemeToggle />
                <button
                  onClick={() => setMobileOpen(false)}
                  aria-label="Close menu"
                  className="rounded-full p-2 text-white hover:bg-white/10"
                >
                  <X size={22} />
                </button>
              </div>
            </div>
            <nav className="flex flex-col gap-1 px-6 py-2">
              {['Brands', 'Benefits/Concern', 'Sports Nutrition', 'Vitamins & Supplements', 'Healthy Snacking', 'Accessories'].map(
                (label, i) => (
                  <motion.div
                    key={label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                  >
                    <Link
                      href={`/category/${slugify(label)}`}
                      onClick={() => setMobileOpen(false)}
                      className="block border-b border-white/10 py-4 text-lg font-medium text-white"
                    >
                      {label}
                    </Link>
                  </motion.div>
                ),
              )}
            </nav>
            <div className="mt-4 px-6">
              {isAuthenticated && user ? (
                <div className="flex items-center justify-between rounded-2xl border border-white/10 px-4 py-3">
                  <span className="text-sm text-white">Hi, {user.firstName}</span>
                  <button
                    onClick={() => {
                      const refreshToken = useAuthStore.getState().refreshToken;
                      if (refreshToken) logoutRequest(refreshToken).catch(() => {});
                      logout();
                      setMobileOpen(false);
                    }}
                    aria-label="Log out"
                    className="flex items-center gap-1.5 text-sm text-red-400"
                  >
                    <LogOut size={15} />
                    Log out
                  </button>
                </div>
              ) : (
                <div className="flex gap-3">
                  <Link
                    href="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-full border border-white/20 px-5 py-3 text-center text-sm font-medium text-white"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex-1 rounded-full bg-brand-accent px-5 py-3 text-center text-sm font-medium text-white"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
