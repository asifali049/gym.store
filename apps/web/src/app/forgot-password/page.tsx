'use client';

import { useState, type FormEvent } from 'react';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { Mail, CheckCircle2 } from 'lucide-react';
import { forgotPassword } from '@/lib/api/auth';
import { AuthSplitLayout } from '@/components/auth/auth-split-layout';
import { FloatingInput } from '@/components/auth/floating-input';
import { AuthButton } from '@/components/auth/auth-button';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');

  const mutation = useMutation({
    mutationFn: () => forgotPassword(email),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  return (
    <AuthSplitLayout>
      {mutation.isSuccess ? (
        <div className="flex flex-col items-center py-4 text-center">
          <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10">
            <CheckCircle2 size={24} />
          </span>
          <h1 className="mt-4 text-2xl font-semibold">Check your email</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            If an account exists for <span className="font-medium text-gray-900 dark:text-white">{email}</span>, you'll
            receive password reset instructions shortly.
          </p>
          <Link href="/login" className="mt-6 text-sm font-semibold text-gray-900 hover:underline dark:text-white">
            Back to sign in
          </Link>
        </div>
      ) : (
        <>
          <h1 className="text-3xl font-semibold tracking-tight">Reset your password</h1>
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Enter the email associated with your account and we'll send you a reset link.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
            <FloatingInput
              label="Email"
              type="email"
              autoComplete="email"
              required
              icon={<Mail size={17} />}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <AuthButton type="submit" loading={mutation.isPending} loadingLabel="Sending..." className="mt-1">
              Send Reset Link
            </AuthButton>
          </form>

          <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
            Remembered your password?{' '}
            <Link href="/login" className="font-semibold text-gray-900 hover:underline dark:text-white">
              Sign in
            </Link>
          </p>
        </>
      )}
    </AuthSplitLayout>
  );
}
