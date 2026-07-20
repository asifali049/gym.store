'use client';

import { Suspense, useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { Lock, CheckCircle2 } from 'lucide-react';
import { resetPassword } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { AuthSplitLayout } from '@/components/auth/auth-split-layout';
import { FloatingInput } from '@/components/auth/floating-input';
import { AuthButton } from '@/components/auth/auth-button';
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';

const PASSWORD_RULE = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => resetPassword(token, password),
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!token) {
      setFormError('This reset link is invalid. Please request a new one.');
      return;
    }
    if (!PASSWORD_RULE.test(password)) {
      setFormError('Please meet all password requirements below.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }

    mutation.mutate();
  };

  const apiErrorMessage =
    mutation.error instanceof ApiError ? mutation.error.message : mutation.error ? 'Something went wrong. Please try again.' : null;
  const errorMessage = formError ?? apiErrorMessage;
  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  if (mutation.isSuccess) {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10">
          <CheckCircle2 size={24} />
        </span>
        <h1 className="mt-4 text-2xl font-semibold">Password reset</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Your password has been updated. You can now sign in with your new password.
        </p>
        <button
          onClick={() => router.push('/login')}
          className="mt-6 text-sm font-semibold text-gray-900 hover:underline dark:text-white"
        >
          Go to sign in
        </button>
      </div>
    );
  }

  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Set a new password</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Choose a strong password for your account.</p>

      <form onSubmit={handleSubmit} className="mt-7 flex flex-col gap-4" noValidate>
        <FloatingInput
          label="New password"
          type="password"
          autoComplete="new-password"
          required
          icon={<Lock size={17} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {password.length > 0 && <PasswordStrengthMeter password={password} />}

        <FloatingInput
          label="Confirm new password"
          type="password"
          autoComplete="new-password"
          required
          icon={<Lock size={17} />}
          value={confirmPassword}
          error={confirmMismatch ? 'Passwords do not match' : undefined}
          success={confirmPassword.length > 0 && !confirmMismatch}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <AuthButton type="submit" loading={mutation.isPending} loadingLabel="Resetting..." className="mt-1">
          Reset Password
        </AuthButton>
      </form>

      <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
        Remembered it after all?{' '}
        <Link href="/login" className="font-semibold text-gray-900 hover:underline dark:text-white">
          Sign in
        </Link>
      </p>
    </>
  );
}

export default function ResetPasswordPage() {
  return (
    <AuthSplitLayout>
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </AuthSplitLayout>
  );
}
