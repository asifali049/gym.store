'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { ProductCardTilt } from '@/components/animations/product-card-tilt';
import { fetchCategories } from '@/lib/api/categories';
import { fetchProducts } from '@/lib/api/products';
import { formatINR } from '@/lib/format';

const TAB_LIMIT = 6;
const PRODUCTS_PER_TAB = 4;

export function BestsellersTabs() {
  const [active, setActive] = useState(0);

  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: fetchCategories });
  const tabs = categories?.slice(0, TAB_LIMIT) ?? [];
  const activeTab = tabs[active];

  const { data: products, isLoading } = useQuery({
    queryKey: ['bestsellers', activeTab?.slug],
    queryFn: () => fetchProducts({ category: activeTab.slug, take: PRODUCTS_PER_TAB }),
    enabled: Boolean(activeTab),
  });

  if (tabs.length === 0) return null;

  return (
    <section className="px-4 py-16 sm:px-6">
      <h2 className="mb-6 text-center text-3xl font-semibold sm:text-left">Season's Bestsellers</h2>

      {/* Tab pills — horizontally scrollable on mobile */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {tabs.map((tab, i) => {
          const isActive = active === i;
          return (
            <button
              key={tab.slug}
              onClick={() => setActive(i)}
              className={`relative shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-colors ${
                isActive ? 'text-white' : 'border border-gray-200 text-gray-600 hover:border-gray-300 dark:border-gray-800 dark:text-gray-300'
              }`}
            >
              {isActive && (
                <motion.span
                  layoutId="active-tab-pill"
                  className="absolute inset-0 rounded-full bg-gray-900 dark:bg-white"
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}
              <span className={`relative z-10 ${isActive ? 'dark:text-gray-900' : ''}`}>{tab.name}</span>
            </button>
          );
        })}
      </div>

      {/* Product grid for active tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab?.slug}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {isLoading &&
            Array.from({ length: PRODUCTS_PER_TAB }).map((_, i) => (
              <div key={i} className="aspect-square animate-pulse rounded-2xl bg-gray-100 dark:bg-gray-900" />
            ))}

          {!isLoading && products?.length === 0 && (
            <p className="col-span-full text-sm text-gray-400">No products in this category yet.</p>
          )}

          {products?.map((product) => (
            <Link key={product.id} href={`/products/${product.slug}`}>
              <ProductCardTilt className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex aspect-square items-center justify-center bg-gray-50 text-3xl dark:bg-gray-800">
                  🏋️
                </div>
                <div className="p-4">
                  <p className="text-xs text-gray-400">{product.brand.name}</p>
                  <h3 className="mt-0.5 truncate text-sm font-semibold">{product.name}</h3>
                  <p className="mt-1.5 text-sm font-semibold">{formatINR(product.basePrice)}</p>
                </div>
              </ProductCardTilt>
            </Link>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
