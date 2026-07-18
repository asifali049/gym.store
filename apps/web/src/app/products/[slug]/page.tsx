'use client';

import { use, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Heart, Star } from 'lucide-react';
import { Button } from '@fitness-platform/ui';
import { fetchProductBySlug } from '@/lib/api/products';
import { addCartItem } from '@/lib/api/cart';
import { createReview, fetchWishlist, addToWishlist, removeFromWishlist } from '@/lib/api/engagement';
import { formatINR } from '@/lib/format';
import { useAuthStore } from '@/lib/auth-store';
import { ApiError } from '@/lib/api-client';

export default function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const router = useRouter();
  const queryClient = useQueryClient();
  const user = useAuthStore((s) => s.user);

  const [variantId, setVariantId] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addError, setAddError] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => fetchProductBySlug(slug),
  });

  const { data: wishlist } = useQuery({
    queryKey: ['wishlist'],
    queryFn: fetchWishlist,
    enabled: !!user,
  });

  const activeVariant =
    product?.variants?.find((v) => v.id === variantId) ?? product?.variants?.[0] ?? null;

  const wishlistEntry = wishlist?.find((w) => w.productId === product?.id);

  const addToCart = useMutation({
    mutationFn: () => {
      if (!activeVariant) throw new Error('Select a variant first');
      return addCartItem(activeVariant.id, quantity);
    },
    onSuccess: () => {
      setAddError(null);
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
    onError: (err) => {
      if (err instanceof ApiError && err.status === 401) {
        router.push(`/login?next=/products/${slug}`);
        return;
      }
      setAddError(err instanceof Error ? err.message : 'Could not add to cart');
    },
  });

  const toggleWishlist = useMutation({
    mutationFn: () =>
      wishlistEntry ? removeFromWishlist(wishlistEntry.id) : addToWishlist(product!.id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  });

  const submitReview = useMutation({
    mutationFn: () => createReview(product!.id, rating, comment || undefined),
    onSuccess: () => {
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['product', slug] });
    },
  });

  if (isLoading) {
    return <main className="mx-auto max-w-6xl px-6 py-24 text-center text-gray-500">Loading…</main>;
  }

  if (!product) {
    return (
      <main className="mx-auto max-w-6xl px-6 py-24 text-center">
        <p className="text-gray-500">Product not found.</p>
      </main>
    );
  }

  const avgRating =
    product.reviews && product.reviews.length > 0
      ? product.reviews.reduce((sum, r) => sum + r.rating, 0) / product.reviews.length
      : null;

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        <div className="flex h-96 items-center justify-center rounded-2xl bg-gray-50 text-7xl dark:bg-gray-900">
          🏋️
        </div>

        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
            {product.brand.name} · {product.category.name}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">{product.name}</h1>

          {avgRating !== null && (
            <div className="mt-2 flex items-center gap-1 text-sm text-gray-500">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              {avgRating.toFixed(1)} ({product.reviews!.length} reviews)
            </div>
          )}

          <p className="mt-4 text-2xl font-semibold">
            {formatINR(activeVariant ? activeVariant.price : product.basePrice)}
          </p>

          {product.description && (
            <p className="mt-4 text-gray-500 dark:text-gray-400">{product.description}</p>
          )}

          {product.variants && product.variants.length > 0 && (
            <div className="mt-6">
              <p className="mb-2 text-sm font-medium">Choose a variant</p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setVariantId(v.id)}
                    className={`rounded-full border px-4 py-2 text-sm ${
                      (activeVariant?.id ?? product.variants![0].id) === v.id
                        ? 'border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900'
                        : 'border-gray-200 dark:border-gray-800'
                    }`}
                  >
                    {[v.flavor, v.weight].filter(Boolean).join(' · ') || 'Standard'}
                  </button>
                ))}
              </div>
              {activeVariant && activeVariant.stock <= 5 && activeVariant.stock > 0 && (
                <p className="mt-2 text-xs text-amber-600">Only {activeVariant.stock} left in stock</p>
              )}
              {activeVariant && activeVariant.stock === 0 && (
                <p className="mt-2 text-xs text-red-500">Out of stock</p>
              )}
            </div>
          )}

          <div className="mt-6 flex items-center gap-4">
            <div className="flex items-center rounded-full border border-gray-200 dark:border-gray-800">
              <button
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                className="px-3 py-2 text-lg"
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="w-8 text-center text-sm">{quantity}</span>
              <button
                onClick={() => setQuantity((q) => q + 1)}
                className="px-3 py-2 text-lg"
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>

            <Button
              onClick={() => addToCart.mutate()}
              disabled={!activeVariant || activeVariant.stock === 0 || addToCart.isPending}
              className="flex-1"
            >
              {addToCart.isPending ? 'Adding…' : 'Add to Cart'}
            </Button>

            {user && (
              <button
                onClick={() => toggleWishlist.mutate()}
                aria-label="Toggle wishlist"
                className="rounded-full border border-gray-200 p-3 dark:border-gray-800"
              >
                <Heart
                  className={`h-5 w-5 ${wishlistEntry ? 'fill-red-500 text-red-500' : ''}`}
                />
              </button>
            )}
          </div>

          {addError && <p className="mt-3 text-sm text-red-500">{addError}</p>}
        </div>
      </div>

      {/* Reviews */}
      <section className="mt-20 max-w-2xl">
        <h2 className="mb-6 text-xl font-semibold">Reviews</h2>

        {user ? (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submitReview.mutate();
            }}
            className="mb-8 rounded-2xl border border-gray-100 p-5 dark:border-gray-800"
          >
            <div className="mb-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} stars`}>
                  <Star className={`h-5 w-5 ${n <= rating ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product…"
              className="w-full rounded-xl border border-gray-200 bg-transparent p-3 text-sm dark:border-gray-800"
              rows={3}
            />
            <Button type="submit" disabled={submitReview.isPending} className="mt-3">
              {submitReview.isPending ? 'Posting…' : 'Post Review'}
            </Button>
          </form>
        ) : (
          <p className="mb-8 text-sm text-gray-500">
            <a href={`/login?next=/products/${slug}`} className="underline">
              Sign in
            </a>{' '}
            to leave a review.
          </p>
        )}

        {product.reviews && product.reviews.length > 0 ? (
          <ul className="space-y-4">
            {product.reviews.map((review) => (
              <li key={review.id} className="border-b border-gray-100 pb-4 dark:border-gray-800">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : ''}`}
                    />
                  ))}
                </div>
                {review.comment && <p className="mt-2 text-sm">{review.comment}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">No reviews yet — be the first.</p>
        )}
      </section>
    </main>
  );
}
