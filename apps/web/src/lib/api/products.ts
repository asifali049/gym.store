import { apiFetch } from '../api-client';
import type { ProductDTO } from '@fitness-platform/types';

export function fetchProducts(params: { skip?: number; take?: number; category?: string } = {}) {
  const search = new URLSearchParams();
  if (params.skip) search.set('skip', String(params.skip));
  if (params.take) search.set('take', String(params.take));
  if (params.category) search.set('category', params.category);
  const qs = search.toString();
  return apiFetch<ProductDTO[]>(`/products${qs ? `?${qs}` : ''}`, { skipAuth: true });
}

export function fetchProductBySlug(slug: string) {
  return apiFetch<ProductDTO>(`/products/${slug}`, { skipAuth: true });
}
