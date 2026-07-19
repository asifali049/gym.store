'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { Mail, Lock } from 'lucide-react';
import { login } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/lib/auth-store';
import { AuthSplitLayout } from '@/components/auth/auth-split-layout';
import { FloatingInput } from '@/components/auth/floating-input';
import { AuthButton } from '@/components/auth/auth-button';
import { SocialButtons } from '@/components/auth/social-buttons';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get('redirect') ?? '/';
  const setSession = useAuthStore((s) => s.setSession);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const mutation = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: (data) => {
      setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
      router.push(redirectTo);
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    mutation.mutate();
  };

  const errorMessage =
    mutation.error instanceof ApiError ? mutation.error.message : mutation.error ? 'Something went wrong. Please try again.' : null;

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Welcome Back</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Sign in to continue your fitness journey.</p>

      <div className="mt-7">
        <SocialButtons />
      </div>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Or</span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <FloatingInput
          label="Email"
          type="email"
          autoComplete="email"
          required
          icon={<Mail size={17} />}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <FloatingInput
          label="Password"
          type="password"
          autoComplete="current-password"
          required
          icon={<Lock size={17} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300 accent-gray-900 dark:accent-white"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-gray-700 hover:underline dark:text-gray-300">
            Forgot password?
          </Link>
        </div>

        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <AuthButton type="submit" loading={mutation.isPending} loadingLabel="Signing in..." className="mt-1">
          Sign In
        </AuthButton>
      </form>

      <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="font-semibold text-gray-900 hover:underline dark:text-white">
          Sign up
        </Link>
      </p>
    </>
  );
}

export default function LoginPage() {
  return (
    <AuthSplitLayout>
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
