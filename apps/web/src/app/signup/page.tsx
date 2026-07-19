'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMutation } from '@tanstack/react-query';
import { User, Mail, Phone, Lock, Gift } from 'lucide-react';
import { register } from '@/lib/api/auth';
import { ApiError } from '@/lib/api/client';
import { useAuthStore } from '@/lib/auth-store';
import { AuthSplitLayout } from '@/components/auth/auth-split-layout';
import { FloatingInput } from '@/components/auth/floating-input';
import { AuthButton } from '@/components/auth/auth-button';
import { SocialButtons } from '@/components/auth/social-buttons';
import { PasswordStrengthMeter } from '@/components/auth/password-strength-meter';

const PASSWORD_RULE = /(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}/;

export default function SignupPage() {
  const router = useRouter();
  const setSession = useAuthStore((s) => s.setSession);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // These fields don't exist on the backend User model yet, so they're
  // captured for UX completeness but intentionally left out of the register() call below.
  void phone;
  void referralCode;

  const mutation = useMutation({
    mutationFn: () => register({ firstName, lastName, email, password }),
    onSuccess: (data) => {
      setSession({ accessToken: data.accessToken, refreshToken: data.refreshToken }, data.user);
      router.push('/');
    },
  });

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!PASSWORD_RULE.test(password)) {
      setFormError('Please meet all password requirements below.');
      return;
    }
    if (password !== confirmPassword) {
      setFormError('Passwords do not match.');
      return;
    }
    if (!acceptedTerms) {
      setFormError('Please accept the Terms of Service to continue.');
      return;
    }

    mutation.mutate();
  };

  const apiErrorMessage =
    mutation.error instanceof ApiError ? mutation.error.message : mutation.error ? 'Something went wrong. Please try again.' : null;
  const errorMessage = formError ?? apiErrorMessage;

  const confirmMismatch = confirmPassword.length > 0 && confirmPassword !== password;

  return (
    <AuthSplitLayout>
      <h1 className="text-3xl font-semibold tracking-tight">Create Your Account</h1>
      <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Start your transformation today.</p>

      <div className="mt-7">
        <SocialButtons />
      </div>

      <div className="my-7 flex items-center gap-3">
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
        <span className="text-xs font-medium uppercase tracking-wide text-gray-400">Or</span>
        <div className="h-px flex-1 bg-gray-200 dark:bg-gray-800" />
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
        <div className="grid grid-cols-2 gap-3">
          <FloatingInput
            label="First name"
            autoComplete="given-name"
            required
            icon={<User size={17} />}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
          />
          <FloatingInput
            label="Last name"
            autoComplete="family-name"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          />
        </div>

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
          label="Phone number (optional)"
          type="tel"
          autoComplete="tel"
          icon={<Phone size={17} />}
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <FloatingInput
          label="Password"
          type="password"
          autoComplete="new-password"
          required
          icon={<Lock size={17} />}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {password.length > 0 && <PasswordStrengthMeter password={password} />}

        <FloatingInput
          label="Confirm password"
          type="password"
          autoComplete="new-password"
          required
          icon={<Lock size={17} />}
          value={confirmPassword}
          error={confirmMismatch ? 'Passwords do not match' : undefined}
          success={confirmPassword.length > 0 && !confirmMismatch}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />

        <FloatingInput
          label="Referral code (optional)"
          icon={<Gift size={17} />}
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
        />

        <label className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-gray-400">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(e) => setAcceptedTerms(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-gray-300 accent-gray-900 dark:accent-white"
          />
          <span>
            I agree to the{' '}
            <Link href="#" className="font-medium text-gray-900 hover:underline dark:text-white">
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" className="font-medium text-gray-900 hover:underline dark:text-white">
              Privacy Policy
            </Link>
          </span>
        </label>

        {errorMessage && (
          <p role="alert" className="text-sm text-red-600">
            {errorMessage}
          </p>
        )}

        <AuthButton type="submit" loading={mutation.isPending} loadingLabel="Creating account..." className="mt-1">
          Create Account
        </AuthButton>
      </form>

      <p className="mt-7 text-center text-sm text-gray-500 dark:text-gray-400">
        Already have an account?{' '}
        <Link href="/login" className="font-semibold text-gray-900 hover:underline dark:text-white">
          Sign in
        </Link>
      </p>
    </AuthSplitLayout>
  );
}
