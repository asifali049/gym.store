'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.99.66-2.25 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.85A11 11 0 0 0 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.1a6.6 6.6 0 0 1 0-4.2V7.05H2.18a11 11 0 0 0 0 9.9l3.66-2.85z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.05l3.66 2.85C6.71 7.3 9.14 5.38 12 5.38z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.365 1.43c0 1.14-.393 2.086-1.18 2.837-.85.803-1.983 1.21-3.09 1.108-.06-1.117.393-2.245 1.14-3.006C13.98.6 15.148.096 16.365 0c0 .144.014.286 0 1.43zM20.822 17.03c-.593 1.36-.877 1.967-1.637 3.17-1.06 1.68-2.556 3.77-4.407 3.79-1.646.02-2.07-1.06-4.303-1.05-2.233.01-2.7 1.07-4.35 1.05-1.85-.02-3.267-1.9-4.327-3.58C-.176 15.99-.75 9.6 1.62 5.4c1.18-2.08 3.29-3.4 5.583-3.43 1.74-.03 3.383 1.17 4.446 1.17 1.06 0 3.06-1.45 5.16-1.24.877.037 3.343.354 4.926 2.67-.127.08-2.94 1.716-2.913 5.12.03 4.07 3.573 5.42 3.607 5.44-.03.09-.567 1.94-1.607 3.9z" />
    </svg>
  );
}

const PROVIDERS = [
  { id: 'google', label: 'Continue with Google', Icon: GoogleIcon },
  { id: 'apple', label: 'Continue with Apple', Icon: AppleIcon },
];

export function SocialButtons() {
  const [note, setNote] = useState<string | null>(null);

  return (
    <div className="flex flex-col gap-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {PROVIDERS.map(({ id, label, Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setNote(`${label.replace('Continue with ', '')} sign-in isn't set up yet.`)}
            className="flex h-12 items-center justify-center gap-2.5 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 transition hover:-translate-y-0.5 hover:shadow-md dark:border-gray-700 dark:bg-gray-950/60 dark:text-gray-200"
          >
            <Icon />
            <span className="hidden sm:inline">{label}</span>
            <span className="sm:hidden">{label.replace('Continue with ', '')}</span>
          </button>
        ))}
      </div>

      <AnimatePresence>
        {note && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="text-center text-xs text-gray-400"
          >
            {note}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
