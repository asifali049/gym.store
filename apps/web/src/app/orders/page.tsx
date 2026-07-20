'use client';

import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { Package, ChevronRight } from 'lucide-react';
import type { OrderDTO, OrderStatus } from '@fitness-platform/types';
import { fetchMyOrders } from '@/lib/api/checkout';
import { ApiError } from '@/lib/api/client';
import { formatINR } from '@/lib/format';
import { useAuthStore } from '@/lib/auth-store';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

const STATUS_STYLES: Record<OrderStatus, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-600',
};

export default function OrdersPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);

  const { data: orders, isLoading, error } = useQuery<OrderDTO[]>({
    queryKey: ['orders'],
    queryFn: fetchMyOrders,
    enabled: isAuthenticated,
  });

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <Package size={40} className="text-gray-300" />
        <h1 className="text-2xl font-semibold">Sign in to view your orders</h1>
        <Link href="/login?redirect=/orders" className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
          Sign In
        </Link>
      </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-3 px-6 text-center">
        <p className="text-red-600">{error instanceof ApiError ? error.message : "Couldn't load your orders."}</p>
      </main>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <Package size={40} className="text-gray-300" />
        <h1 className="text-2xl font-semibold">No orders yet</h1>
        <p className="text-gray-500">When you place an order, it'll show up here.</p>
        <Link href="/" className="rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
          Start Shopping
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-semibold">Your Orders</h1>

      <div className="flex flex-col gap-3">
        {orders.map((order, i) => (
          <ScrollReveal key={order.id} delay={Math.min(i * 0.05, 0.2)}>
            <Link
              href={`/orders/${order.id}`}
              className="flex items-center justify-between gap-4 rounded-2xl border border-gray-200 p-5 transition hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-700"
            >
              <div>
                <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                <p className="mt-1 text-sm text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })} ·{' '}
                  {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
                <span className="font-medium">{formatINR(Number(order.totalAmount))}</span>
                <ChevronRight size={16} className="text-gray-400" />
              </div>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}
