'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { ShoppingCart, User } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { fetchCart } from '@/lib/api/cart';

export function SiteHeader() {
  const user = useAuthStore((s) => s.user);

  const { data: cart } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: !!user,
  });

  const itemCount = cart?.items.reduce((sum, item) => sum + item.quantity, 0) ?? 0;

  return (
    <header className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur dark:border-gray-800 dark:bg-gray-950/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          Fitness Platform
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium sm:flex">
          <Link href="/products" className="hover:opacity-70">
            Shop
          </Link>
          {user && (
            <Link href="/orders" className="hover:opacity-70">
              My Orders
            </Link>
          )}
        </nav>

        <div className="flex items-center gap-5">
          <Link href="/cart" className="relative" aria-label="Cart">
            <ShoppingCart className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-semibold text-white">
                {itemCount}
              </span>
            )}
          </Link>
          <Link
            href={user ? '/orders' : '/login'}
            className="flex items-center gap-1.5 text-sm font-medium"
          >
            <User className="h-5 w-5" />
            <span className="hidden sm:inline">{user ? user.firstName : 'Sign in'}</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
