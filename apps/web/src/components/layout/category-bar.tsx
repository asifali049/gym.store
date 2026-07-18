'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { slugify } from '@/lib/slugify';

const CATEGORIES = [
  { label: 'Brands', items: ['PeakFuel', 'IgniteLabs', 'PureGain', 'CoreStrong', 'VitalForm'] },
  { label: 'Benefits/Concern', items: ['Muscle Gain', 'Weight Loss', 'Immunity', 'Joint Support', 'Sleep & Recovery'] },
  { label: 'Sports Nutrition', items: ['Whey Protein', 'Mass Gainer', 'Creatine', 'Pre-Workout', 'BCAA'] },
  { label: 'Vitamins & Supplements', items: ['Multivitamins', 'Omega 3', 'Vitamin D', 'Zinc', 'Probiotics'] },
  { label: 'Healthy Snacking', items: ['Protein Bars', 'Peanut Butter', 'Granola', 'Protein Chips'] },
  { label: 'Accessories', items: ['Shakers', 'Gym Bags', 'Gloves', 'Resistance Bands'] },
];

export function CategoryBar() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="hidden border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950 md:block">
      <nav className="mx-auto flex max-w-7xl items-center gap-8 px-6 text-sm font-medium">
        {CATEGORIES.map((cat, i) => (
          <div
            key={cat.label}
            className="relative py-4"
            onMouseEnter={() => setOpenIndex(i)}
            onMouseLeave={() => setOpenIndex(null)}
          >
            <Link
              href={`/category/${slugify(cat.label)}`}
              className="flex items-center gap-1 text-gray-700 transition hover:text-gray-950 dark:text-gray-300 dark:hover:text-white"
            >
              {cat.label}
              <ChevronDown size={14} className={`transition-transform ${openIndex === i ? 'rotate-180' : ''}`} />
            </Link>

            <AnimatePresence>
              {openIndex === i && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.15 }}
                  className="absolute left-0 top-full z-30 min-w-[200px] rounded-xl border border-gray-200 bg-white p-2 shadow-lg dark:border-gray-800 dark:bg-gray-900"
                >
                  {cat.items.map((item) => (
                    <Link
                      key={item}
                      href={`/category/${slugify(item)}`}
                      className="block rounded-lg px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-950 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      {item}
                    </Link>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </nav>
    </div>
  );
}
