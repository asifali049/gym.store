'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { fetchPreferences, updatePreferenceSection } from '@/lib/api/settings';
import { applyTheme, type Theme } from '@/lib/theme';
import { SectionCard, SelectField, ToggleRow } from './ui';

export function AppearanceSection() {
  const queryClient = useQueryClient();
  const { data: prefs } = useQuery({ queryKey: ['settings', 'preferences'], queryFn: fetchPreferences });
  const [local, setLocal] = useState<Record<string, any>>({});

  useEffect(() => {
    if (prefs) setLocal(prefs.appearance);
  }, [prefs]);

  const save = useMutation({
    mutationFn: (patch: Record<string, any>) => updatePreferenceSection('appearance', patch),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['settings', 'preferences'] }),
  });

  function update(key: string, value: any) {
    setLocal((l) => ({ ...l, [key]: value }));
    save.mutate({ [key]: value });
    if (key === 'theme') applyTheme(value as Theme);
  }

  if (!prefs) return <p className="text-sm text-gray-500">Loading…</p>;

  return (
    <SectionCard title="Appearance" description="Changes apply instantly and sync across your devices.">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <SelectField
          label="Theme"
          value={local.theme ?? 'system'}
          onChange={(v) => update('theme', v)}
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
            { value: 'system', label: 'System' },
          ]}
        />
        <SelectField
          label="Font size"
          value={local.fontSize ?? 'md'}
          onChange={(v) => update('fontSize', v)}
          options={[
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
          ]}
        />
        <SelectField
          label="Animation level"
          value={local.animationLevel ?? 'full'}
          onChange={(v) => update('animationLevel', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'reduced', label: 'Reduced' },
            { value: 'full', label: 'Full' },
          ]}
        />
        <SelectField
          label="Border radius"
          value={local.borderRadius ?? 'md'}
          onChange={(v) => update('borderRadius', v)}
          options={[
            { value: 'none', label: 'None' },
            { value: 'sm', label: 'Small' },
            { value: 'md', label: 'Medium' },
            { value: 'lg', label: 'Large' },
            { value: 'full', label: 'Full' },
          ]}
        />
      </div>

      <div className="mt-2 divide-y divide-gray-100 dark:divide-gray-800">
        <ToggleRow label="Reduce Motion" checked={!!local.reduceMotion} onChange={(v) => update('reduceMotion', v)} />
        <ToggleRow label="Compact Mode" checked={!!local.compactMode} onChange={(v) => update('compactMode', v)} />
        <ToggleRow label="Large UI" checked={!!local.largeUI} onChange={(v) => update('largeUI', v)} />
        <ToggleRow label="Glass Effects" checked={!!local.glassEffects} onChange={(v) => update('glassEffects', v)} />
        <ToggleRow label="Cursor Effects" checked={!!local.cursorEffects} onChange={(v) => update('cursorEffects', v)} />
      </div>
    </SectionCard>
  );
}
