'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchMyOrders } from '@/lib/api/checkout';
import { formatINR } from '@/lib/format';
import { useAuthStore } from '@/lib/auth-store';

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
  PAID: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
  SHIPPED: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
  DELIVERED: 'bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-400',
  CANCELLED: 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-400',
};

export default function OrdersPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    if (!user) router.replace('/login?next=/orders');
  }, [user, router]);

  const { data: orders, isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: fetchMyOrders,
    enabled: !!user,
  });

  if (!user) return null;

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <div className="mb-10 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">My Orders</h1>
        <button
          onClick={() => {
            logout();
            router.push('/');
          }}
          className="text-sm text-gray-500 underline"
        >
          Sign out
        </button>
      </div>

      {isLoading && <p className="text-gray-500">Loading…</p>}

      {orders && orders.length === 0 && (
        <div className="rounded-2xl border border-gray-100 py-16 text-center dark:border-gray-800">
          <p className="text-gray-500">No orders yet.</p>
          <Link href="/products" className="mt-4 inline-block text-sm font-medium underline">
            Start shopping
          </Link>
        </div>
      )}

      {orders && orders.length > 0 && (
        <ul className="space-y-4">
          {orders.map((order) => (
            <li key={order.id}>
              <Link
                href={`/orders/${order.id}`}
                className="flex items-center justify-between rounded-xl border border-gray-100 p-5 hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-600"
              >
                <div>
                  <p className="font-medium">Order #{order.id.slice(0, 8)}</p>
                  <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${
                      STATUS_STYLES[order.status] ?? 'bg-gray-100 text-gray-700 dark:bg-gray-900'
                    }`}
                  >
                    {order.status}
                  </span>
                  <span className="font-semibold">{formatINR(order.totalAmount)}</span>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
