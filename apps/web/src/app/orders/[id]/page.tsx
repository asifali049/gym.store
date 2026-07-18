'use client';

import { use } from 'react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Package, ArrowLeft } from 'lucide-react';
import type { OrderDTO } from '@fitness-platform/types';
import { Button } from '@fitness-platform/ui';
import { fetchOrder } from '@/lib/api/checkout';
import { formatINR } from '@/lib/format';

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  variant: {
    product: {
      name: string;
    };
  };
};

type OrderResponse = {
  id: string;
  status: string;
  totalAmount: number;
  items: OrderItem[];
};


export default function OrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const {
    data: orderData,
    isLoading,
    isError,
  } = useQuery<OrderDTO>({
    queryKey: ['order', id],
    queryFn: () => fetchOrder(id),
  });

  if (isLoading) {
    return (
      <main className="mx-auto max-w-3xl px-6 py-16">
        <div className="space-y-5 animate-pulse">
          <div className="h-10 w-60 rounded bg-gray-200 dark:bg-gray-800" />
          <div className="h-32 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800" />
          <div className="h-24 rounded-2xl bg-gray-200 dark:bg-gray-800" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="mx-auto max-w-xl px-6 py-24 text-center">
        <Package className="mx-auto mb-4 h-10 w-10 text-red-500" />

        <h2 className="text-xl font-semibold">
          Failed to load order
        </h2>

        <p className="mt-2 text-gray-500">
          Please refresh the page.
        </p>
      </main>
    );
  }


  if (!orderData) {
    return (
      <main className="mx-auto max-w-2xl px-6 py-24 text-center text-gray-500">
        Order not found.
      </main>
    );
  }


  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <div className="mb-12 text-center">

        <CheckCircle2 className="mx-auto h-14 w-14 text-green-500" />

        <h1 className="mt-5 text-3xl font-bold">
          Order Confirmed
        </h1>

        <p className="mt-2 text-gray-500">
          Thank you for shopping with us.
        </p>

        <div className="mt-6 inline-flex rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
          {orderData.status}
        </div>

      </div>

      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {orderData.items.map((item: OrderItem) => (
          <li
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 transition-all hover:shadow-md dark:border-gray-800"
          >
            <div className="flex h-16 w-16 items-center justify-center rounded-xl bg-gray-100 dark:bg-gray-900">
              🏋️
            </div>

            <div className="flex-1">
              <h3 className="font-semibold">
                {item.variant.product.name}
              </h3>

              <p className="mt-1 text-sm text-gray-500">
                Quantity : {item.quantity}
              </p>
            </div>

            <div className="text-right">
              <p className="font-semibold">
                {formatINR(item.price)}
              </p>

              <p className="text-xs text-gray-400">
                Total
              </p>

              <p className="font-bold">
                {formatINR(item.price * item.quantity)}
              </p>
            </div>
          </li>
        ))}
      </ul>

      <div className="mt-8 rounded-2xl border border-gray-200 p-6 dark:border-gray-800">

        <div className="flex justify-between">

          <span className="text-gray-500">
            Order Total
          </span>

          <span className="text-xl font-bold">
            {formatINR(orderData.totalAmount)}
          </span>

        </div>

      </div>

      <Link href="/products" className="block mt-8">
        <Button className="w-full rounded-full">
          Continue Shopping
        </Button>
      </Link>
    </main>
  );
}
