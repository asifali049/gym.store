'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import { Button } from '@fitness-platform/ui';
import { fetchCart, updateCartItem, removeCartItem } from '@/lib/api/cart';
import { formatINR } from '@/lib/format';
import { useAuthStore } from '@/lib/auth-store';

export default function CartPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  useEffect(() => {
    if (!user) router.replace('/login?next=/cart');
  }, [user, router]);

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: fetchCart,
    enabled: !!user,
  });

  const updateQty = useMutation({
    mutationFn: ({ itemId, quantity }: { itemId: string; quantity: number }) =>
      updateCartItem(itemId, quantity),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  const removeItem = useMutation({
    mutationFn: (itemId: string) => removeCartItem(itemId),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });

  if (!user) return null;

  if (isLoading) {
    return <main className="mx-auto max-w-3xl px-6 py-24 text-center text-gray-500">Loading cart…</main>;
  }

  const items = cart?.items ?? [];
  const total = items.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  return (
    <main className="mx-auto max-w-3xl px-6 py-16">
      <h1 className="mb-10 text-2xl font-semibold tracking-tight">Your Cart</h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-gray-100 py-16 text-center dark:border-gray-800">
          <p className="text-gray-500">Your cart is empty.</p>
          <Link href="/products" className="mt-4 inline-block text-sm font-medium underline">
            Browse products
          </Link>
        </div>
      ) : (
        <>
          <ul className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-4 py-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gray-50 text-2xl dark:bg-gray-900">
                  🏋️
                </div>
                <div className="flex-1">
                  <p className="font-medium">{item.variant.product.name}</p>
                  <p className="text-xs text-gray-400">
                    {[item.variant.flavor, item.variant.weight].filter(Boolean).join(' · ') || 'Standard'}
                  </p>
                  <p className="mt-1 text-sm font-medium">{formatINR(item.variant.price)}</p>
                </div>
                <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-800">
                  <button
                    onClick={() =>
                      updateQty.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })
                    }
                    className="px-3 py-1.5 text-lg"
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>
                  <span className="w-8 text-center text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQty.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                    className="px-3 py-1.5 text-lg"
                    aria-label="Increase quantity"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem.mutate(item.id)}
                  aria-label="Remove item"
                  className="p-2 text-gray-400 hover:text-red-500"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 flex items-center justify-between border-t border-gray-100 pt-6 dark:border-gray-800">
            <span className="text-sm text-gray-500">Subtotal</span>
            <span className="text-lg font-semibold">{formatINR(total)}</span>
          </div>

          <Link href="/checkout">
            <Button className="mt-6 w-full">Proceed to Checkout</Button>
          </Link>
        </>
      )}
    </main>
  );
}
