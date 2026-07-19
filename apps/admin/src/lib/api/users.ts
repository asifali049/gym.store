import { apiFetch } from './client';

export interface AdminCustomer {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: string;
  createdAt: string;
}

export function fetchAllUsers() {
  return apiFetch<AdminCustomer[]>('/users');
}
