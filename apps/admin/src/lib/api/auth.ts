import { apiFetch } from './client';

export interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: AdminUser;
}

export function login(email: string, password: string) {
  return apiFetch<AuthResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function logoutRequest(refreshToken: string) {
  return apiFetch<{ success: boolean }>('/auth/logout', {
    method: 'POST',
    headers: { Authorization: `Bearer ${refreshToken}` },
  });
}
