'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2, Minus, Plus, ShoppingBag } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@fitness-platform/ui';
import { fetchCart, updateCartItem, removeCartItem, type Cart } from '@/lib/api/cart';
import { ApiError } from '@/lib/api/client';
import { formatINR } from '@/lib/format';
import { useAuthStore } from '@/lib/auth-store';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

export default function CartPage() {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const queryClient = useQueryClient();

  const { data: cart, isLoading, error } = useQuery<Cart>({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: isAuthenticated,
  });

  const updateMutation = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) => updateCartItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeMutation = useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  if (!isAuthenticated) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <ShoppingBag size={40} className="text-gray-300" />
        <h1 className="text-2xl font-semibold">Sign in to view your cart</h1>
        <p className="text-gray-500">Your cart is saved to your account so you never lose it.</p>
        <Button>Sign In</Button>
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
    const message = error instanceof ApiError ? error.message : 'Something went wrong loading your cart.';
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-3 px-6 text-center">
        <h1 className="text-xl font-semibold">Couldn't load your cart</h1>
        <p className="text-gray-500">{message}</p>
      </main>
    );
  }

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => sum + Number(item.variant.price) * item.quantity, 0);

  if (items.length === 0) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-xl flex-col items-center justify-center gap-4 px-6 text-center">
        <ShoppingBag size={40} className="text-gray-300" />
        <h1 className="text-2xl font-semibold">Your cart is empty</h1>
        <p className="text-gray-500">Looks like you haven't added anything yet.</p>
        <Link href="/">
          <Button>Continue Shopping</Button>
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <h1 className="mb-8 text-3xl font-semibold">Your Cart</h1>

      <div className="flex flex-col gap-4">
        {items.map((item, i) => (
          <ScrollReveal key={item.id} delay={Math.min(i * 0.05, 0.2)}>
            <div className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4 dark:border-gray-800">
              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-gray-100 dark:bg-gray-800">
                <Image
                  src={`https://picsum.photos/seed/${item.variant.id}/200/200`}
                  alt={item.variant.product.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <h3 className="font-semibold">{item.variant.product.name}</h3>
                <p className="text-sm text-gray-500">
                  {[item.variant.flavor, item.variant.weight].filter(Boolean).join(' · ')}
                </p>
                <p className="mt-1 font-medium">{formatINR(Number(item.variant.price))}</p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-gray-200 px-2 py-1 dark:border-gray-700">
                <button
                  aria-label="Decrease quantity"
                  disabled={item.quantity <= 1 || updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity - 1 })}
                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                >
                  <Minus size={14} />
                </button>
                <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                <button
                  aria-label="Increase quantity"
                  disabled={item.quantity >= item.variant.stock || updateMutation.isPending}
                  onClick={() => updateMutation.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                  className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100 disabled:opacity-30 dark:hover:bg-gray-800"
                >
                  <Plus size={14} />
                </button>
              </div>

              <button
                aria-label="Remove item"
                disabled={removeMutation.isPending}
                onClick={() => removeMutation.mutate(item.id)}
                className="rounded-full p-2 text-gray-400 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </ScrollReveal>
        ))}
      </div>

      <div className="mt-8 flex items-center justify-between rounded-2xl bg-gray-50 p-6 dark:bg-gray-900">
        <span className="text-lg font-medium">Total</span>
        <span className="text-2xl font-semibold">{formatINR(total)}</span>
      </div>

      <Button className="mt-6 w-full">Proceed to Checkout</Button>
    </main>
  );
}
