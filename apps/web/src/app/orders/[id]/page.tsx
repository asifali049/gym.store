'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2 } from 'lucide-react';
import { fetchOrder } from '@/lib/api/checkout';
import { formatINR } from '@/lib/format';

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);

  const { data: order, isLoading } = useQuery({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id),
  });

  if (isLoading) {
    return <main className="mx-auto max-w-2xl px-6 py-24 text-center text-gray-500">Loading…</main>;
  }

  if (!order) {
    return <main className="mx-auto max-w-2xl px-6 py-24 text-center text-gray-500">Order not found.</main>;
  }

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-10 flex flex-col items-center text-center">
        <CheckCircle2 className="h-12 w-12 text-green-500" />
        <h1 className="mt-4 text-2xl font-semibold tracking-tight">Order placed!</h1>
        <p className="mt-1 text-sm text-gray-500">Order #{order.id.slice(0, 8)} · {order.status}</p>
      </div>

      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {order.items.map((item) => (
          <li key={item.id} className="flex items-center gap-4 py-4">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-xl dark:bg-gray-900">
              🏋️
            </div>
            <div className="flex-1">
              <p className="font-medium">{item.variant.product.name}</p>
              <p className="text-xs text-gray-400">Qty {item.quantity}</p>
            </div>
            <span className="text-sm font-medium">{formatINR(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex justify-between border-t border-gray-100 pt-4 text-base font-semibold dark:border-gray-800">
        <span>Total</span>
        <span>{formatINR(order.totalAmount)}</span>
      </div>

      <Link href="/products" className="mt-10 block text-center text-sm font-medium underline">
        Continue shopping
      </Link>
    </main>
  );
}
