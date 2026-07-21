import { apiFetch } from './client';

export interface Brand {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export function fetchBrands() {
  return apiFetch<Brand[]>('/brands');
}

export function createBrand(data: { name: string; slug: string; logoUrl?: string }) {
  return apiFetch<Brand>('/brands', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}