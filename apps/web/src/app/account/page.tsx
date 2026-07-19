'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Eye, Palette, Shield, User } from 'lucide-react';
import { useAuthStore } from '@/lib/auth-store';
import { ProfileSection } from '@/components/account/profile-section';
import { SecuritySection } from '@/components/account/security-section';
import { PrivacySection } from '@/components/account/privacy-section';
import { NotificationsSection } from '@/components/account/notifications-section';
import { AppearanceSection } from '@/components/account/appearance-section';

const TABS = [
  { id: 'profile', label: 'Account', icon: User },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'privacy', label: 'Privacy', icon: Eye },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'appearance', label: 'Appearance', icon: Palette },
] as const;

type TabId = (typeof TABS)[number]['id'];

export default function AccountSettingsPage() {
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [tab, setTab] = useState<TabId>('profile');

  useEffect(() => {
    if (!user) router.replace('/login?next=/account');
  }, [user, router]);

  if (!user) return null;

  return (
    <main className="mx-auto max-w-5xl px-6 py-12">
      <h1 className="mb-8 text-2xl font-semibold tracking-tight">Settings</h1>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-[200px_1fr]">
        <nav className="flex gap-1 overflow-x-auto md:flex-col md:overflow-visible">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setTab(id)}
              className={`flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors ${
                tab === id
                  ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900'
                  : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </nav>

        <div>
          {tab === 'profile' && <ProfileSection />}
          {tab === 'security' && <SecuritySection />}
          {tab === 'privacy' && <PrivacySection />}
          {tab === 'notifications' && <NotificationsSection />}
          {tab === 'appearance' && <AppearanceSection />}
        </div>
      </div>
    </main>
  );
}
