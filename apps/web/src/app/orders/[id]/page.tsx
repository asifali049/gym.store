'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Package, ArrowLeft, Truck, XCircle } from 'lucide-react';
import type { OrderDTO, OrderStatus } from '@fitness-platform/types';
import { fetchOrder } from '@/lib/api/checkout';
import { ApiError } from '@/lib/api/client';
import { formatINR } from '@/lib/format';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

const STATUS_META: Record<OrderStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  PENDING: { label: 'Pending', className: 'bg-amber-100 text-amber-700', icon: Package },
  CONFIRMED: { label: 'Confirmed', className: 'bg-blue-100 text-blue-700', icon: CheckCircle2 },
  SHIPPED: { label: 'Shipped', className: 'bg-blue-100 text-blue-700', icon: Truck },
  DELIVERED: { label: 'Delivered', className: 'bg-emerald-100 text-emerald-700', icon: CheckCircle2 },
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-700', icon: XCircle },
  REFUNDED: { label: 'Refunded', className: 'bg-gray-100 text-gray-600', icon: XCircle },
};

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const orderId = params.id;

  const { data: order, isLoading, error } = useQuery<OrderDTO>({
    queryKey: ['order', orderId],
    queryFn: () => fetchOrder(orderId),
    enabled: Boolean(orderId),
  });

  if (isLoading) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-gray-900 dark:border-gray-700 dark:border-t-white" />
      </main>
    );
  }

  if (error || !order) {
    const message = error instanceof ApiError ? error.message : "Couldn't load this order.";
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-xl font-semibold">Order not found</h1>
        <p className="text-gray-500">{message}</p>
        <Link href="/orders" className="text-sm font-semibold text-gray-900 hover:underline dark:text-white">
          Back to your orders
        </Link>
      </main>
    );
  }

  const status = STATUS_META[order.status];
  const StatusIcon = status.icon;

  return (
    <main className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/orders" className="mb-6 flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white">
        <ArrowLeft size={15} />
        Back to orders
      </Link>

      <ScrollReveal>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold">Order #{order.id.slice(0, 8)}</h1>
            <p className="mt-1 text-sm text-gray-500">
              Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
          <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium ${status.className}`}>
            <StatusIcon size={15} />
            {status.label}
          </span>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <div className="mt-8 flex flex-col gap-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                <Image
                  src={`https://picsum.photos/seed/${item.variant.id}/160/160`}
                  alt={item.variant.product.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.variant.product.name}</p>
                <p className="text-sm text-gray-500">
                  {[item.variant.flavor, item.variant.weight].filter(Boolean).join(' · ')} · Qty {item.quantity}
                </p>
              </div>
              <p className="font-medium">{formatINR(Number(item.price) * item.quantity)}</p>
            </div>
          ))}
        </div>
      </ScrollReveal>

      <ScrollReveal delay={0.15}>
        <div className="mt-6 flex items-center justify-between rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
          <span className="text-lg font-medium">Total</span>
          <span className="text-2xl font-semibold">{formatINR(Number(order.totalAmount))}</span>
        </div>
      </ScrollReveal>
    </main>
  );
}
