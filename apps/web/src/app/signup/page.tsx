'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@fitness-platform/ui';
import { register } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/lib/auth-store';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

export default function SignupPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const mutation = useMutation({
    mutationFn: () => register({ firstName, lastName, email, password }),
    onSuccess: (data) => {
      setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
      router.push('/');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const errorMessage =
    mutation.error instanceof ApiError ? mutation.error.message : mutation.error ? 'Something went wrong. Please try again.' : null;

  return (
    <main className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-6 py-16">
      <ScrollReveal>
        <h1 className="text-3xl font-semibold">Create your account</h1>
        <p className="mt-2 text-gray-500">Join PeakFuel for faster checkout and order tracking.</p>
      </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              First name
              <input
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-white"
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm font-medium">
              Last name
              <input
                required
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-white"
              />
            </label>
          </div>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-white"
              placeholder="you@example.com"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium">
            Password
            <input
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-xl border border-gray-300 px-4 py-3 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-900 dark:focus:border-white"
              placeholder="At least 8 characters"
            />
          </label>

          {errorMessage && <p className="text-sm text-red-600">{errorMessage}</p>}

          <Button type="submit" disabled={mutation.isPending} className="mt-2 w-full">
            {mutation.isPending ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-gray-900 hover:underline dark:text-white">
            Sign in
          </Link>
        </p>
      </ScrollReveal>
    </main>
  );
}
