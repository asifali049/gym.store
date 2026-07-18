'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api/products';
import { formatINR } from '@/lib/format';

const PAGE_SIZE = 12;

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products', category, page],
    queryFn: () => fetchProducts({ category, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  });

  function goToPage(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(next));
    router.push(`/products?${params.toString()}`);
  }

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">
            {category ? `${category[0].toUpperCase()}${category.slice(1)}` : 'Shop All'}
          </h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Whey protein, creatine, pre-workout and more.
          </p>
        </div>
      </div>

      {isLoading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-64 animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-900" />
          ))}
        </div>
      )}

      {isError && (
        <p className="rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/40 dark:text-red-400">
          Couldn&apos;t load products. Is the API running?
        </p>
      )}

      {products && products.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No products found in this category yet.</p>
      )}

      {products && products.length > 0 && (
        <>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/products/${product.slug}`}
                className="group rounded-2xl border border-gray-100 p-5 transition hover:border-gray-300 dark:border-gray-800 dark:hover:border-gray-600"
              >
                <div className="mb-4 flex h-40 items-center justify-center rounded-xl bg-gray-50 text-4xl dark:bg-gray-900">
                  🏋️
                </div>
                <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
                  {product.brand.name}
                </p>
                <h3 className="mt-1 font-medium group-hover:underline">{product.name}</h3>
                <p className="mt-2 text-sm font-semibold">{formatINR(product.basePrice)}</p>
              </Link>
            ))}
          </div>

          <div className="mt-12 flex items-center justify-center gap-4">
            <button
              onClick={() => goToPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm disabled:opacity-40 dark:border-gray-800"
            >
              Previous
            </button>
            <span className="text-sm text-gray-500">Page {page}</span>
            <button
              onClick={() => goToPage(page + 1)}
              disabled={products.length < PAGE_SIZE}
              className="rounded-full border border-gray-200 px-4 py-2 text-sm disabled:opacity-40 dark:border-gray-800"
            >
              Next
            </button>
          </div>
        </>
      )}
    </main>
  );
}
