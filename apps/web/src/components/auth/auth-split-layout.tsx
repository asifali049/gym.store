'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { AuthHero } from './auth-hero';

export function AuthSplitLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative flex min-h-screen w-full bg-gradient-to-b from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-950 dark:to-black">
      {/* Left: hero (desktop only) */}
      <div className="w-[45%]">
        <AuthHero />
      </div>

      {/* Right: auth card */}
      <div className="flex w-full flex-col items-center justify-center px-5 py-10 sm:px-8 lg:w-[55%] lg:px-12">
        {/* Mobile-only logo, since the hero panel is hidden below lg */}
        <Link href="/" className="mb-8 text-lg font-bold tracking-tight lg:hidden">
          PEAK<span className="text-brand-accent">FUEL</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[460px] rounded-[32px] border border-gray-200/70 bg-white/70 p-8 shadow-xl shadow-gray-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] dark:shadow-black/40 sm:p-10"
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}
