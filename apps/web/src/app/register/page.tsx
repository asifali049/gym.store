'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@fitness-platform/ui';
import { register, fetchMe } from '@/lib/api/auth';
import { useAuthStore } from '@/lib/auth-store';
import { ApiError } from '@/lib/api-client';

export default function RegisterPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);
  const setTokens = useAuthStore((s) => s.setTokens);

  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function update(field: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement>) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const tokens = await register(form);
      setTokens(tokens);
      const me = await fetchMe();
      setSession(tokens, me);
      router.push('/');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-6 py-16">
      <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
      <p className="mt-1 text-sm text-gray-500">Join to track orders and save your wishlist.</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-1 block text-sm font-medium">First name</label>
            <input
              required
              value={form.firstName}
              onChange={update('firstName')}
              className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-800"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Last name</label>
            <input
              required
              value={form.lastName}
              onChange={update('lastName')}
              className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-800"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Email</label>
          <input
            type="email"
            required
            value={form.email}
            onChange={update('email')}
            className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-800"
          />
        </div>
        <div>
          <label className="mb-1 block text-sm font-medium">Password</label>
          <input
            type="password"
            required
            minLength={8}
            value={form.password}
            onChange={update('password')}
            className="w-full rounded-xl border border-gray-200 bg-transparent px-4 py-2.5 text-sm dark:border-gray-800"
          />
          <p className="mt-1 text-xs text-gray-400">At least 8 characters.</p>
        </div>

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" disabled={loading} className="w-full">
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        Already have an account?{' '}
        <Link href="/login" className="font-medium underline">
          Sign in
        </Link>
      </p>
    </main>
  );
}
