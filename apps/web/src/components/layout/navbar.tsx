'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Heart, ShoppingCart } from 'lucide-react';

const LINKS = [
  { href: '/products', label: 'Shop' },
  { href: '/products?goal=muscle-gain', label: 'Shop by Goal' },
  { href: '/blog', label: 'Blog' },
  { href: '/about', label: 'About' },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/80 backdrop-blur-lg shadow-sm dark:bg-gray-950/80'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          PEAK<span className="text-brand-accent">FUEL</span>
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium md:flex">
          {LINKS.map((link) => (
            <Link key={link.href} href={link.href} className="text-gray-600 transition hover:text-gray-950 dark:text-gray-300 dark:hover:text-white">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-1">
          <button aria-label="Search" className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900">
            <Search size={19} />
          </button>
          <button aria-label="Wishlist" className="hidden rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900 sm:block">
            <Heart size={19} />
          </button>
          <button aria-label="Cart" className="relative rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900">
            <ShoppingCart size={19} />
            <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-brand-accent text-[10px] font-medium text-white">
              2
            </span>
          </button>
          <button
            aria-label="Menu"
            onClick={() => setMobileOpen(true)}
            className="rounded-full p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-900 md:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-white dark:bg-gray-950 md:hidden"
          >
            <div className="flex items-center justify-between px-6 py-4">
              <span className="text-lg font-semibold">PEAK<span className="text-brand-accent">FUEL</span></span>
              <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-900">
                <X size={22} />
              </button>
            </div>
            <nav className="flex flex-col gap-2 px-6 py-4">
              {LINKS.map((link, i) => (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="block py-3 text-2xl font-medium"
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
