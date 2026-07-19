'use client';

import { useEffect, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@fitness-platform/ui';
import { fetchProfile, updateProfile, type ProfileDTO } from '@/lib/api/settings';
import { SectionCard, TextField, SelectField } from './ui';

export function ProfileSection() {
  const queryClient = useQueryClient();
  const { data: profile } = useQuery({ queryKey: ['settings', 'profile'], queryFn: fetchProfile });
  const [form, setForm] = useState<Partial<ProfileDTO>>({});
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  const save = useMutation({
    mutationFn: () =>
      updateProfile({
        displayName: form.displayName,
        username: form.username || undefined,
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone || undefined,
        dateOfBirth: form.dateOfBirth || undefined,
        gender: form.gender as any,
        fitnessLevel: form.fitnessLevel as any,
        occupation: form.occupation || undefined,
        emergencyContactName: form.emergencyContactName || undefined,
        emergencyContactPhone: form.emergencyContactPhone || undefined,
        language: form.language,
        timezone: form.timezone,
        country: form.country,
        currency: form.currency,
        units: form.units,
        heightCm: form.heightCm,
        weightKg: form.weightKg,
        bloodGroup: form.bloodGroup || undefined,
      } as any),
    onSuccess: (updated) => {
      queryClient.setQueryData(['settings', 'profile'], updated);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    },
  });

  if (!profile) return <p className="text-sm text-gray-500">Loading…</p>;

  const set = (field: keyof ProfileDTO) => (v: string) => setForm((f) => ({ ...f, [field]: v }));

  return (
    <>
      <SectionCard title="Personal Information" description="This is used across your account and orders.">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="First name" value={form.firstName ?? ''} onChange={set('firstName')} />
          <TextField label="Last name" value={form.lastName ?? ''} onChange={set('lastName')} />
          <TextField label="Display name" value={form.displayName ?? ''} onChange={set('displayName')} />
          <TextField label="Username" value={form.username ?? ''} onChange={set('username')} />
          <TextField label="Email" value={profile.email} onChange={() => {}} />
          <TextField label="Mobile number" value={form.phone ?? ''} onChange={set('phone')} />
          <TextField
            label="Date of birth"
            type="date"
            value={form.dateOfBirth?.slice(0, 10) ?? ''}
            onChange={set('dateOfBirth')}
          />
          <SelectField
            label="Gender"
            value={form.gender ?? ''}
            onChange={set('gender')}
            options={[
              { value: '', label: 'Prefer not to say' },
              { value: 'MALE', label: 'Male' },
              { value: 'FEMALE', label: 'Female' },
              { value: 'NON_BINARY', label: 'Non-binary' },
            ]}
          />
          <SelectField
            label="Fitness level"
            value={form.fitnessLevel ?? ''}
            onChange={set('fitnessLevel')}
            options={[
              { value: '', label: 'Not set' },
              { value: 'BEGINNER', label: 'Beginner' },
              { value: 'INTERMEDIATE', label: 'Intermediate' },
              { value: 'ADVANCED', label: 'Advanced' },
              { value: 'ATHLETE', label: 'Athlete' },
            ]}
          />
          <TextField label="Occupation" value={form.occupation ?? ''} onChange={set('occupation')} />
          <TextField label="Blood group" value={form.bloodGroup ?? ''} onChange={set('bloodGroup')} />
        </div>
      </SectionCard>

      <SectionCard title="Emergency Contact">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField
            label="Contact name"
            value={form.emergencyContactName ?? ''}
            onChange={set('emergencyContactName')}
          />
          <TextField
            label="Contact phone"
            value={form.emergencyContactPhone ?? ''}
            onChange={set('emergencyContactPhone')}
          />
        </div>
      </SectionCard>

      <SectionCard title="Region & Units">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <TextField label="Language" value={form.language ?? ''} onChange={set('language')} />
          <TextField label="Timezone" value={form.timezone ?? ''} onChange={set('timezone')} />
          <TextField label="Country" value={form.country ?? ''} onChange={set('country')} />
          <TextField label="Currency" value={form.currency ?? ''} onChange={set('currency')} />
          <SelectField
            label="Units"
            value={form.units ?? 'METRIC'}
            onChange={set('units')}
            options={[
              { value: 'METRIC', label: 'Metric (kg/cm)' },
              { value: 'IMPERIAL', label: 'Imperial (lbs/in)' },
            ]}
          />
          <TextField
            label={form.units === 'IMPERIAL' ? 'Height (in)' : 'Height (cm)'}
            type="number"
            value={form.heightCm != null ? String(form.heightCm) : ''}
            onChange={(v) => setForm((f) => ({ ...f, heightCm: v ? Number(v) : null }))}
          />
          <TextField
            label={form.units === 'IMPERIAL' ? 'Weight (lbs)' : 'Weight (kg)'}
            type="number"
            value={form.weightKg != null ? String(form.weightKg) : ''}
            onChange={(v) => setForm((f) => ({ ...f, weightKg: v ? Number(v) : null }))}
          />
        </div>
      </SectionCard>

      <div className="flex items-center gap-3">
        <Button onClick={() => save.mutate()} disabled={save.isPending}>
          {save.isPending ? 'Saving…' : 'Save changes'}
        </Button>
        {saved && <span className="text-sm text-green-600">Saved</span>}
      </div>
    </>
  );
}
