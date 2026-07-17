import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="text-gray-500">The page you're looking for doesn't exist or has moved.</p>
      <Link href="/" className="mt-2 rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
        Back to home
      </Link>
    </main>
  );
}
