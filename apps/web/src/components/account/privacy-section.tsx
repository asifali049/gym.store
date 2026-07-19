'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Download, Trash2 } from 'lucide-react';
import { Button } from '@fitness-platform/ui';
import { fetchPreferences, updatePreferenceSection } from '@/lib/api/settings';
import { exportAccountData, deleteAccount } from '@/lib/api/settings';
import { SectionCard, ToggleRow } from './ui';
import { useAuthStore } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';

const TOGGLES: { key: string; label: string; description?: string }[] = [
  { key: 'publicProfile', label: 'Public Profile', description: 'Let others view your profile page' },
  { key: 'hideWeight', label: 'Hide Weight' },
  { key: 'hideProgress', label: 'Hide Progress' },
  { key: 'hideOrders', label: 'Hide Orders' },
  { key: 'hideWishlist', label: 'Hide Wishlist' },
  { key: 'hideReviews', label: 'Hide Reviews' },
  { key: 'hideActivity', label: 'Hide Activity' },
  { key: 'searchVisibility', label: 'Search Visibility', description: 'Appear in on-site search for other users' },
  { key: 'dataSharing', label: 'Data Sharing', description: 'Share anonymized data with partners' },
  { key: 'personalizedAds', label: 'Personalized Ads' },
  { key: 'aiDataUsage', label: 'AI Data Usage', description: 'Allow your data to improve AI features' },
  { key: 'analyticsConsent', label: 'Analytics Consent' },
];

export function PrivacySection() {
  const queryClient = useQueryClient();
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);
  const { data: prefs } = useQuery({ queryKey: ['settings', 'preferences'], queryFn: fetchPreferences });
  const [local, setLocal] = useState<Record<string, boolean>>({});
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (prefs) setLocal(prefs.privacy);
  }, [prefs]);

  const save = useMutation({
    mutationFn: (patch: Record<string, boolean>) => updatePreferenceSection('privacy', patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings', 'preferences'] }),
  });

  function toggle(key: string, value: boolean) {
    setLocal((l) => ({ ...l, [key]: value }));
    save.mutate({ [key]: value });
  }

  const exportData = useMutation({
    mutationFn: exportAccountData,
    onSuccess: (data) => {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'my-account-data.json';
      a.click();
      URL.revokeObjectURL(url);
    },
  });

  const removeAccount = useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      logout();
      router.push('/');
    },
  });

  if (!prefs) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <>
      <SectionCard title="Privacy" description="Control what others can see and how your data is used.">
        <div className="divide-y divide-gray-100 dark:divide-gray-800">
          {TOGGLES.map((t) => (
            <ToggleRow
              key={t.key}
              label={t.label}
              description={t.description}
              checked={!!local[t.key]}
              onChange={(v) => toggle(t.key, v)}
            />
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Your Data">
        <div className="flex flex-wrap gap-3">
          <Button onClick={() => exportData.mutate()} disabled={exportData.isPending}>
            <Download className="mr-2 inline h-4 w-4" />
            Download my data
          </Button>
        </div>

        <div className="mt-6 rounded-xl border border-red-200 p-4 dark:border-red-900">
          <p className="text-sm font-medium text-red-600">Delete account</p>
          <p className="mt-1 text-xs text-gray-500">
            This permanently deletes your account, orders, and everything associated with it. This can&apos;t be undone.
          </p>
          {!confirmDelete ? (
            <button onClick={() => setConfirmDelete(true)} className="mt-3 text-sm font-medium text-red-600 underline">
              Delete my account
            </button>
          ) : (
            <div className="mt-3 flex items-center gap-3">
              <button
                onClick={() => removeAccount.mutate()}
                disabled={removeAccount.isPending}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white"
              >
                <Trash2 className="h-4 w-4" />
                {removeAccount.isPending ? 'Deleting…' : 'Yes, permanently delete'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-sm text-gray-500">
                Cancel
              </button>
            </div>
          )}
        </div>
      </SectionCard>
    </>
  );
}
