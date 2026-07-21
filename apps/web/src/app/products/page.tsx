'use client';

import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { fetchProducts } from '@/lib/api/products';
import { fetchBrands } from '@/lib/api/brands';
import { fetchCategories } from '@/lib/api/categories';
import { formatINR } from '@/lib/format';

const PAGE_SIZE = 12;

function FilterList({
  title,
  options,
  activeSlug,
  paramKey,
}: {
  title: string;
  options: { name: string; slug: string }[];
  activeSlug?: string;
  paramKey: 'category' | 'brand';
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  function select(slug?: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (slug) params.set(paramKey, slug);
    else params.delete(paramKey);
    params.delete('page');
    router.push(`/products?${params.toString()}`);
  }

  return (
    <div>
      <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</h3>
      <ul className="flex flex-col gap-1">
        <li>
          <button
            onClick={() => select(undefined)}
            className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
              !activeSlug
                ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900'
            }`}
          >
            All
          </button>
        </li>
        {options.map((o) => (
          <li key={o.slug}>
            <button
              onClick={() => select(o.slug)}
              className={`w-full rounded-lg px-3 py-1.5 text-left text-sm transition ${
                activeSlug === o.slug
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900'
              }`}
            >
              {o.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const category = searchParams.get('category') ?? undefined;
  const brand = searchParams.get('brand') ?? undefined;
  const page = Number(searchParams.get('page') ?? '1');

  const { data: products, isLoading, isError } = useQuery({
    queryKey: ['products', category, brand, page],
    queryFn: () => fetchProducts({ category, brand, skip: (page - 1) * PAGE_SIZE, take: PAGE_SIZE }),
  });

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const { data: brands } = useQuery({ queryKey: ['brands'], queryFn: fetchBrands });

  const activeCategory = categories?.find((c) => c.slug === category);
  const activeBrand = brands?.find((b) => b.slug === brand);

  function goToPage(next: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set('page', String(next));
    router.push(`/products?${params.toString()}`);
  }

  const heading = [activeBrand?.name, activeCategory?.name].filter(Boolean).join(' · ') || 'Shop All';

  return (
    <main className="mx-auto max-w-6xl px-6 py-16">
      <div className="mb-10 flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{heading}</h1>
          <p className="mt-2 text-gray-500 dark:text-gray-400">
            Whey protein, creatine, pre-workout and more.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[200px_1fr]">
        <aside className="flex flex-col gap-8 lg:sticky lg:top-24 lg:self-start">
          <FilterList title="Category" options={categories ?? []} activeSlug={category} paramKey="category" />
          <FilterList title="Brand" options={brands ?? []} activeSlug={brand} paramKey="brand" />
        </aside>

        <div>
          {isLoading && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
            <p className="text-gray-500 dark:text-gray-400">No products found for these filters yet.</p>
          )}

          {products && products.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
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
        </div>
      </div>
    </main>
  );
}