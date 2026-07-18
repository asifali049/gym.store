'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ProductCardTilt } from '@/components/animations/product-card-tilt';

interface Product {
  name: string;
  brand: string;
  price: string;
  mrp?: string;
  img: string;
}

const TABS: { label: string; products: Product[] }[] = [
  {
    label: 'Proteins',
    products: [
      { name: 'Whey Isolate Gold', brand: 'PeakFuel', price: '₹2,499', mrp: '₹3,199', img: 'https://picsum.photos/seed/tab-whey-1/400/400' },
      { name: 'Raw Whey Concentrate', brand: 'CoreStrong', price: '₹1,899', mrp: '₹2,299', img: 'https://picsum.photos/seed/tab-whey-2/400/400' },
      { name: 'Plant Protein Blend', brand: 'PureGain', price: '₹2,199', img: 'https://picsum.photos/seed/tab-whey-3/400/400' },
      { name: 'Whey Protein Bar', brand: 'PeakFuel', price: '₹99', img: 'https://picsum.photos/seed/tab-whey-4/400/400' },
    ],
  },
  {
    label: 'Gainers',
    products: [
      { name: 'Mass Gainer XL', brand: 'PeakFuel', price: '₹2,199', mrp: '₹2,699', img: 'https://picsum.photos/seed/tab-gainer-1/400/400' },
      { name: 'Serious Mass Pro', brand: 'CoreStrong', price: '₹2,899', img: 'https://picsum.photos/seed/tab-gainer-2/400/400' },
      { name: 'Weight Gainer Ultra', brand: 'VitalForm', price: '₹1,799', img: 'https://picsum.photos/seed/tab-gainer-3/400/400' },
      { name: 'True Mass Gainer', brand: 'IgniteLabs', price: '₹2,399', img: 'https://picsum.photos/seed/tab-gainer-4/400/400' },
    ],
  },
  {
    label: 'Creatines',
    products: [
      { name: 'Creatine Monohydrate', brand: 'PeakFuel', price: '₹899', mrp: '₹1,099', img: 'https://picsum.photos/seed/tab-creatine-1/400/400' },
      { name: 'Micronized Creatine', brand: 'PureGain', price: '₹749', img: 'https://picsum.photos/seed/tab-creatine-2/400/400' },
      { name: 'Creatine HCL', brand: 'CoreStrong', price: '₹1,199', img: 'https://picsum.photos/seed/tab-creatine-3/400/400' },
      { name: 'Creatine Gummies', brand: 'VitalForm', price: '₹649', img: 'https://picsum.photos/seed/tab-creatine-4/400/400' },
    ],
  },
  {
    label: 'Pre-Workouts',
    products: [
      { name: 'Pre-Workout Ignite', brand: 'IgniteLabs', price: '₹1,299', mrp: '₹1,599', img: 'https://picsum.photos/seed/tab-preworkout-1/400/400' },
      { name: 'Nitro Pump', brand: 'CoreStrong', price: '₹1,499', img: 'https://picsum.photos/seed/tab-preworkout-2/400/400' },
      { name: 'C4 Extreme Energy', brand: 'PeakFuel', price: '₹1,999', img: 'https://picsum.photos/seed/tab-preworkout-3/400/400' },
      { name: 'Pump Igniter', brand: 'VitalForm', price: '₹1,099', img: 'https://picsum.photos/seed/tab-preworkout-4/400/400' },
    ],
  },
  {
    label: 'Multivitamins',
    products: [
      { name: 'Daily Multivitamin', brand: 'PureGain', price: '₹599', img: 'https://picsum.photos/seed/tab-multi-1/400/400' },
      { name: "Men's Multivitamin", brand: 'VitalForm', price: '₹799', img: 'https://picsum.photos/seed/tab-multi-2/400/400' },
      { name: "Women's Multivitamin", brand: 'VitalForm', price: '₹799', img: 'https://picsum.photos/seed/tab-multi-3/400/400' },
      { name: 'Omega 3 + Multi', brand: 'PeakFuel', price: '₹999', img: 'https://picsum.photos/seed/tab-multi-4/400/400' },
    ],
  },
];

export function BestsellersTabs() {
  const [active, setActive] = useState(0);

  return (
    <section className="px-4 py-16 sm:px-6">
      <h2 className="mb-6 text-center text-3xl font-semibold sm:text-left">Season's Bestsellers</h2>

      {/* Tab pills — horizontally scrollable on mobile */}
      <div className="mb-8 flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {TABS.map((tab, i) => {
          const isActive = active === i;
          return (
            <button
              key={tab.label}
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
              <span className={`relative z-10 ${isActive ? 'dark:text-gray-900' : ''}`}>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Product grid for active tab */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.25 }}
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
        >
          {TABS[active].products.map((product) => (
            <ProductCardTilt
              key={product.name}
              className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="relative aspect-square bg-gray-50 dark:bg-gray-800">
                <Image src={product.img} alt={product.name} fill className="object-cover" />
                {product.mrp && (
                  <span className="absolute left-2 top-2 rounded-full bg-red-500 px-2 py-0.5 text-[10px] font-semibold text-white">
                    SALE
                  </span>
                )}
              </div>
              <div className="p-4">
                <p className="text-xs text-gray-400">{product.brand}</p>
                <h3 className="mt-0.5 truncate text-sm font-semibold">{product.name}</h3>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="text-sm font-semibold">{product.price}</span>
                  {product.mrp && <span className="text-xs text-gray-400 line-through">{product.mrp}</span>}
                </div>
              </div>
            </ProductCardTilt>
          ))}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
