import { apiFetch } from '../api-client';

export interface BrandDTO {
  id: string;
  name: string;
  slug: string;
  logoUrl: string | null;
}

export function fetchBrands() {
  return apiFetch<BrandDTO[]>('/brands', { skipAuth: true });
}