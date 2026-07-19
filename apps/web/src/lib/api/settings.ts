import { apiFetch } from '../api-client';

export interface ProfileDTO {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  displayName: string | null;
  username: string | null;
  profilePictureUrl: string | null;
  phone: string | null;
  role: string;
  dateOfBirth: string | null;
  gender: string | null;
  fitnessLevel: string | null;
  occupation: string | null;
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  language: string;
  timezone: string;
  country: string;
  currency: string;
  units: 'METRIC' | 'IMPERIAL';
  heightCm: number | null;
  weightKg: number | null;
  bloodGroup: string | null;
  twoFactorEnabled: boolean;
  loyaltyPoints: number;
  referralCode: string | null;
  createdAt: string;
}

export function fetchProfile() {
  return apiFetch<ProfileDTO>('/settings/profile');
}

export function updateProfile(data: Partial<ProfileDTO>) {
  return apiFetch<ProfileDTO>('/settings/profile', { method: 'PATCH', body: data });
}

export function updateAvatar(profilePictureUrl: string) {
  return apiFetch<ProfileDTO>('/settings/profile/avatar', { method: 'PATCH', body: { profilePictureUrl } });
}

export function deleteAccount() {
  return apiFetch('/settings/profile', { method: 'DELETE' });
}

export function exportAccountData() {
  return apiFetch('/settings/profile/export');
}

// --- Security ---

export function changePassword(currentPassword: string, newPassword: string) {
  return apiFetch('/settings/security/password', { method: 'PATCH', body: { currentPassword, newPassword } });
}

export function setupTwoFactor() {
  return apiFetch<{ secret: string; qrCodeDataUrl: string }>('/settings/security/2fa/setup', { method: 'POST' });
}

export function verifyTwoFactorSetup(code: string) {
  return apiFetch<{ enabled: boolean; backupCodes: string[] }>('/settings/security/2fa/verify', {
    method: 'POST',
    body: { code },
  });
}

export function disableTwoFactor(currentPassword: string) {
  return apiFetch('/settings/security/2fa/disable', { method: 'POST', body: { currentPassword } });
}

export function regenerateBackupCodes() {
  return apiFetch<{ backupCodes: string[] }>('/settings/security/2fa/backup-codes', { method: 'POST' });
}

export interface SessionDTO {
  id: string;
  deviceName: string | null;
  ipAddress: string | null;
  trusted: boolean;
  lastActiveAt: string;
  createdAt: string;
  isCurrent: boolean;
}

export function fetchSessions() {
  return apiFetch<SessionDTO[]>('/settings/security/sessions');
}

export function revokeSession(id: string) {
  return apiFetch(`/settings/security/sessions/${id}`, { method: 'DELETE' });
}

export function revokeOtherSessions() {
  return apiFetch('/settings/security/sessions/revoke-others', { method: 'POST' });
}

export interface LoginHistoryDTO {
  id: string;
  ipAddress: string | null;
  userAgent: string | null;
  success: boolean;
  reason: string | null;
  createdAt: string;
}

export function fetchLoginHistory() {
  return apiFetch<LoginHistoryDTO[]>('/settings/security/login-history');
}

export interface PasskeyDTO {
  id: string;
  deviceName: string | null;
  createdAt: string;
}

export function fetchPasskeys() {
  return apiFetch<PasskeyDTO[]>('/settings/security/passkeys');
}

export function removePasskey(id: string) {
  return apiFetch(`/settings/security/passkeys/${id}`, { method: 'DELETE' });
}

// --- Preferences (privacy / notifications / appearance / accessibility / shopping / fitness / ai) ---

export interface AllPreferences {
  privacy: Record<string, any>;
  notifications: Record<string, any>;
  appearance: Record<string, any>;
  accessibility: Record<string, any>;
  shopping: Record<string, any>;
  fitness: Record<string, any>;
  ai: Record<string, any>;
}

export function fetchPreferences() {
  return apiFetch<AllPreferences>('/settings/preferences');
}

export type PreferenceSection = keyof AllPreferences;

export function updatePreferenceSection(section: PreferenceSection, patch: Record<string, any>) {
  return apiFetch(`/settings/preferences/${section}`, { method: 'PATCH', body: patch });
}
