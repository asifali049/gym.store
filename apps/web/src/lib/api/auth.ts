import { apiFetch } from '../api-client';
import type { AuthTokens, UserDTO } from '@fitness-platform/types';

export function register(data: { email: string; password: string; firstName: string; lastName: string }) {
  return apiFetch<AuthTokens>('/auth/register', { method: 'POST', body: data, skipAuth: true });
}

export function login(data: { email: string; password: string }) {
  return apiFetch<AuthTokens>('/auth/login', { method: 'POST', body: data, skipAuth: true });
}

export function fetchMe() {
  return apiFetch<UserDTO>('/users/me');
}
