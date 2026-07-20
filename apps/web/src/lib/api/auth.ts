import { apiFetch } from './client';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AuthUser;
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(data: { email: string; password: string; firstName: string; lastName: string }) {
  return apiFetch<AuthResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function forgotPassword(email: string) {
  return apiFetch<{ message: string }>('/auth/forgot-password', {
    method: 'POST',
    body: JSON.stringify({ email }),
  });
}

export function resetPassword(token: string, password: string) {
  return apiFetch<{ message: string }>('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ token, password }),
  });
}

export function logoutRequest(refreshToken: string) {
  return apiFetch<{ success: boolean }>('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
}

export function verifyEmail(token: string) {
  return apiFetch<{ message: string }>(`/auth/verify-email?token=${encodeURIComponent(token)}`);
}
