'use client';

import { useEffect } from 'react';

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">Something went wrong</h1>
      <p className="max-w-md text-gray-500">
        We hit a snag loading this page. Please try again — if it keeps happening, let us know.
      </p>
      <button
        onClick={reset}
        className="mt-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-gray-900"
      >
        Try again
      </button>
    </main>
  );
}
