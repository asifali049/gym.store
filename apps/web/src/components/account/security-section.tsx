'use client';

import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Laptop, Shield, ShieldCheck, Smartphone, Trash2 } from 'lucide-react';
import { Button } from '@fitness-platform/ui';
import {
  changePassword,
  fetchSessions,
  revokeSession,
  revokeOtherSessions,
  fetchLoginHistory,
  setupTwoFactor,
  verifyTwoFactorSetup,
  disableTwoFactor,
  fetchPasskeys,
  removePasskey,
  fetchProfile,
} from '@/lib/api/settings';
import { SectionCard, TextField } from './ui';
import { ApiError } from '@/lib/api-client';

function ChangePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState<string | null>(null);

  const mutation = useMutation({
    mutationFn: () => changePassword(currentPassword, newPassword),
    onSuccess: () => {
      setMessage('Password changed. You have been signed out of other devices.');
      setCurrentPassword('');
      setNewPassword('');
    },
    onError: (err) => setMessage(err instanceof ApiError ? err.message : 'Could not change password'),
  });

  return (
    <SectionCard title="Change Password">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <TextField label="Current password" type="password" value={currentPassword} onChange={setCurrentPassword} />
        <TextField label="New password" type="password" value={newPassword} onChange={setNewPassword} />
      </div>
      {message && <p className="mt-3 text-sm text-gray-500">{message}</p>}
      <Button
        className="mt-4"
        onClick={() => mutation.mutate()}
        disabled={mutation.isPending || !currentPassword || newPassword.length < 8}
      >
        {mutation.isPending ? 'Updating…' : 'Update password'}
      </Button>
    </SectionCard>
  );
}

function TwoFactorSection() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ['settings', 'profile'], queryFn: fetchProfile });
  const [step, setStep] = useState<'idle' | 'setup' | 'codes'>('idle');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [code, setCode] = useState('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [disablePassword, setDisablePassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const startSetup = useMutation({
    mutationFn: setupTwoFactor,
    onSuccess: (res) => {
      setQrCode(res.qrCodeDataUrl);
      setStep('setup');
    },
  });

  const confirmSetup = useMutation({
    mutationFn: () => verifyTwoFactorSetup(code),
    onSuccess: (res) => {
      setBackupCodes(res.backupCodes);
      setStep('codes');
      queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Incorrect code'),
  });

  const disable = useMutation({
    mutationFn: () => disableTwoFactor(disablePassword),
    onSuccess: () => {
      setDisablePassword('');
      queryClient.invalidateQueries({ queryKey: ['settings', 'profile'] });
    },
    onError: (err) => setError(err instanceof ApiError ? err.message : 'Could not disable 2FA'),
  });

  return (
    <SectionCard title="Two-Factor Authentication (2FA)" description="Add an authenticator app as a second login step.">
      {profile?.twoFactorEnabled ? (
        <div>
          <p className="mb-3 flex items-center gap-2 text-sm text-green-600">
            <ShieldCheck className="h-4 w-4" /> 2FA is enabled on your account.
          </p>
          <div className="flex items-end gap-2">
            <TextField label="Confirm password to disable" type="password" value={disablePassword} onChange={setDisablePassword} />
            <Button onClick={() => disable.mutate()} disabled={disable.isPending || !disablePassword}>
              Disable
            </Button>
          </div>
        </div>
      ) : step === 'idle' ? (
        <Button onClick={() => startSetup.mutate()} disabled={startSetup.isPending}>
          {startSetup.isPending ? 'Generating…' : 'Enable 2FA'}
        </Button>
      ) : step === 'setup' ? (
        <div>
          <p className="mb-3 text-sm text-gray-500">Scan this with Google Authenticator, Authy, or similar.</p>
          {qrCode && <img src={qrCode} alt="2FA QR code" className="mb-4 h-40 w-40 rounded-lg border border-gray-100 dark:border-gray-800" />}
          <div className="flex items-end gap-2">
            <TextField label="Enter 6-digit code" value={code} onChange={setCode} />
            <Button onClick={() => confirmSetup.mutate()} disabled={confirmSetup.isPending || code.length < 6}>
              Verify
            </Button>
          </div>
        </div>
      ) : (
        <div>
          <p className="mb-3 text-sm text-green-600">2FA enabled! Save these backup codes somewhere safe:</p>
          <div className="grid grid-cols-2 gap-2 rounded-xl bg-gray-50 p-4 font-mono text-sm dark:bg-gray-900">
            {backupCodes.map((c) => (
              <span key={c}>{c}</span>
            ))}
          </div>
          <p className="mt-2 text-xs text-gray-400">Each code works once if you lose access to your authenticator app.</p>
        </div>
      )}
      {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
    </SectionCard>
  );
}

function SessionsSection() {
  const queryClient = useQueryClient();
  const { data: sessions } = useQuery({ queryKey: ['settings', 'sessions'], queryFn: fetchSessions });

  const revoke = useMutation({
    mutationFn: revokeSession,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings', 'sessions'] }),
  });

  const revokeOthers = useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings', 'sessions'] }),
  });

  return (
    <SectionCard title="Active Sessions" description="Devices currently signed in to your account.">
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {(sessions ?? []).map((s) => (
          <li key={s.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Laptop className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">
                  {s.deviceName ?? 'Unknown device'} {s.isCurrent && <span className="text-xs text-green-600">(this device)</span>}
                </p>
                <p className="text-xs text-gray-400">
                  {s.ipAddress ?? 'Unknown IP'} · Active {new Date(s.lastActiveAt).toLocaleString()}
                </p>
              </div>
            </div>
            {!s.isCurrent && (
              <button onClick={() => revoke.mutate(s.id)} className="text-gray-400 hover:text-red-500" aria-label="Revoke session">
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </li>
        ))}
      </ul>
      {(sessions?.length ?? 0) > 1 && (
        <Button className="mt-4" onClick={() => revokeOthers.mutate()} disabled={revokeOthers.isPending}>
          Sign out other devices
        </Button>
      )}
    </SectionCard>
  );
}

function PasskeysSection() {
  const queryClient = useQueryClient();
  const { data: passkeys } = useQuery({ queryKey: ['settings', 'passkeys'], queryFn: fetchPasskeys });

  const remove = useMutation({
    mutationFn: removePasskey,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings', 'passkeys'] }),
  });

  return (
    <SectionCard title="Passkeys" description="Sign in without a password using Face ID, Touch ID, or a security key.">
      {(passkeys ?? []).length === 0 && <p className="text-sm text-gray-500">No passkeys added yet.</p>}
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {(passkeys ?? []).map((p) => (
          <li key={p.id} className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Smartphone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium">{p.deviceName ?? 'Passkey'}</p>
                <p className="text-xs text-gray-400">Added {new Date(p.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <button onClick={() => remove.mutate(p.id)} className="text-gray-400 hover:text-red-500" aria-label="Remove passkey">
              <Trash2 className="h-4 w-4" />
            </button>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-gray-400">
        Adding a new passkey requires your device&apos;s browser WebAuthn prompt — wire this button up to{' '}
        <code>navigator.credentials.create()</code> using the options from <code>/settings/security/passkeys/register/options</code>.
      </p>
    </SectionCard>
  );
}

function LoginHistorySection() {
  const { data: history } = useQuery({ queryKey: ['settings', 'login-history'], queryFn: fetchLoginHistory });

  return (
    <SectionCard title="Login History" description="Recent sign-in attempts on your account.">
      <ul className="divide-y divide-gray-100 dark:divide-gray-800">
        {(history ?? []).slice(0, 10).map((h) => (
          <li key={h.id} className="flex items-center justify-between py-3 text-sm">
            <div className="flex items-center gap-2">
              <Shield className={`h-4 w-4 ${h.success ? 'text-green-500' : 'text-red-500'}`} />
              <span>{h.success ? 'Successful login' : h.reason ?? 'Failed attempt'}</span>
            </div>
            <span className="text-xs text-gray-400">
              {h.ipAddress ?? 'Unknown IP'} · {new Date(h.createdAt).toLocaleString()}
            </span>
          </li>
        ))}
      </ul>
    </SectionCard>
  );
}

export function SecuritySection() {
  return (
    <>
      <ChangePasswordForm />
      <TwoFactorSection />
      <PasskeysSection />
      <SessionsSection />
      <LoginHistorySection />
    </>
  );
}
