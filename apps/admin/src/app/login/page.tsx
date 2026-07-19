'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@tanstack/react-query';
import { ShieldCheck } from 'lucide-react';
import { login } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/lib/auth-store';

const ADMIN_ROLES = ['ADMIN', 'SUPER_ADMIN'];

export default function AdminLoginPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessError, setAccessError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      if (!ADMIN_ROLES.includes(data.user.role)) {
        setAccessError('This account does not have admin access.');
        return;
      }
      setAccessError(null);
      setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
      router.replace('/dashboard');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setAccessError(null);
    mutation.mutate();
  };

  const errorMessage =
    accessError ??
    (mutation.error instanceof ApiError ? mutation.error.message : mutation.error ? 'Something went wrong. Please try again.' : null);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-6 dark:bg-gray-950">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gray-900 text-white dark:bg-white dark:text-gray-900">
            <ShieldCheck size={22} />
          </div>
          <h1 className="text-xl font-semibold">Admin Sign In</h1>
          <p className="text-sm text-gray-500">Restricted to authorized store administrators.</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900"
        >
          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
              placeholder="admin@peakfuel.com"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-2.5 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950 dark:focus:border-white"
              placeholder="••••••••"
            />
          </label>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <button
            type="submit"
            disabled={mutation.isPending}
            className="mt-2 rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white disabled:opacity-60 dark:bg-white dark:text-gray-900"
          >
            {mutation.isPending ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </main>
  );
}
