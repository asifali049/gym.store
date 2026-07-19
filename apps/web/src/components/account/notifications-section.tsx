'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPreferences, updatePreferenceSection } from '@/lib/api/settings';
import { SectionCard, ToggleRow } from './ui';

const EMAIL: { key: string; label: string }[] = [
  { key: 'orders', label: 'Orders' },
  { key: 'shipping', label: 'Shipping' },
  { key: 'refunds', label: 'Refunds' },
  { key: 'offers', label: 'Offers' },
  { key: 'newsletter', label: 'Newsletter' },
  { key: 'blog', label: 'Blog' },
  { key: 'workoutReminder', label: 'Workout Reminder' },
  { key: 'dietReminder', label: 'Diet Reminder' },
];

const PUSH: { key: string; label: string }[] = [
  { key: 'promotions', label: 'Promotions' },
  { key: 'flashSales', label: 'Flash Sales' },
  { key: 'wishlist', label: 'Wishlist' },
  { key: 'priceDrop', label: 'Price Drop' },
  { key: 'orderUpdates', label: 'Order Updates' },
  { key: 'aiCoach', label: 'AI Coach' },
];

const SMS: { key: string; label: string }[] = [
  { key: 'otp', label: 'OTP' },
  { key: 'order', label: 'Order' },
  { key: 'delivery', label: 'Delivery' },
  { key: 'refund', label: 'Refund' },
];

const WHATSAPP: { key: string; label: string }[] = [
  { key: 'orderUpdates', label: 'Order Updates' },
  { key: 'promotions', label: 'Promotions' },
  { key: 'support', label: 'Support' },
];

export function NotificationsSection() {
  const queryClient = useQueryClient();
  const { data: prefs } = useQuery({ queryKey: ['settings', 'preferences'], queryFn: fetchPreferences });
  const [local, setLocal] = useState<Record<string, Record<string, boolean>>>({});

  useEffect(() => {
    if (prefs) setLocal(prefs.notifications);
  }, [prefs]);

  const save = useMutation({
    mutationFn: (patch: Record<string, Record<string, boolean>>) => updatePreferenceSection('notifications', patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings', 'preferences'] }),
  });

  function toggle(channel: string, key: string, value: boolean) {
    const next = { ...local, [channel]: { ...local[channel], [key]: value } };
    setLocal(next);
    save.mutate({ [channel]: { [key]: value } });
  }

  if (!prefs) return <p className="text-sm text-gray-500">Loading…</p>;

  const channels: { channel: string; title: string; items: { key: string; label: string }[] }[] = [
    { channel: 'email', title: 'Email', items: EMAIL },
    { channel: 'push', title: 'Push', items: PUSH },
    { channel: 'sms', title: 'SMS', items: SMS },
    { channel: 'whatsapp', title: 'WhatsApp', items: WHATSAPP },
  ];

  return (
    <>
      {channels.map(({ channel, title, items }) => (
        <SectionCard key={channel} title={title}>
          <div className="divide-y divide-gray-100 dark:divide-gray-800">
            {items.map((item) => (
              <ToggleRow
                key={item.key}
                label={item.label}
                checked={!!local[channel]?.[item.key]}
                onChange={(v) => toggle(channel, item.key, v)}
              />
            ))}
          </div>
        </SectionCard>
      ))}
      <p className="text-xs text-gray-400">
        SMS and WhatsApp delivery need a gateway (e.g. Twilio, Gupshup) configured on the backend — these toggles are saved
        either way, so they take effect the moment a gateway is wired up.
      </p>
    </>
  );
}
