'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import { verifyEmail } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { AuthSplitLayout } from '@/components/auth/auth-split-layout';

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setErrorMessage('This verification link is missing a token.');
      return;
    }

    verifyEmail(token)
      .then(() => setStatus('success'))
      .catch((err) => {
        setStatus('error');
        setErrorMessage(err instanceof ApiError ? err.message : 'Verification failed. The link may have expired.');
      });
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <Loader2 size={28} className="animate-spin text-gray-400" />
        <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Verifying your email...</p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center py-4 text-center">
        <span className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10">
          <CheckCircle2 size={24} />
        </span>
        <h1 className="mt-4 text-2xl font-semibold">Email verified</h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Your email has been confirmed. You're all set.</p>
        <Link href="/" className="mt-6 text-sm font-semibold text-gray-900 hover:underline dark:text-white">
          Continue to PeakFuel
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-4 text-center">
      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-500/10">
        <XCircle size={24} />
      </span>
      <h1 className="mt-4 text-2xl font-semibold">Verification failed</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">{errorMessage}</p>
      <Link href="/login" className="mt-6 text-sm font-semibold text-gray-900 hover:underline dark:text-white">
        Back to sign in
      </Link>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <AuthSplitLayout>
      <Suspense fallback={null}>
        <VerifyEmailContent />
      </Suspense>
    </AuthSplitLayout>
  );
}
