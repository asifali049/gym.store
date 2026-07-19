'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Loader2 } from 'lucide-react';
import type { ButtonHTMLAttributes } from 'react';

interface AuthButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
  loadingLabel?: string;
}

export function AuthButton({ children, loading, loadingLabel, disabled, ...props }: AuthButtonProps) {
  return (
    <motion.button
      whileHover={{ y: disabled || loading ? 0 : -2 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      disabled={disabled || loading}
      className="group flex h-[52px] w-full items-center justify-center gap-2 rounded-full bg-gray-900 text-sm font-semibold text-white shadow-lg shadow-gray-900/20 transition-shadow hover:shadow-xl disabled:opacity-60 dark:bg-white dark:text-gray-900 dark:shadow-none"
      {...props}
    >
      {loading ? (
        <>
          <Loader2 size={18} className="animate-spin" />
          {loadingLabel ?? 'Please wait...'}
        </>
      ) : (
        <>
          {children}
          <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
        </>
      )}
    </motion.button>
  );
}
