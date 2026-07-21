import { apiFetch } from './client';

export interface Category {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export function fetchCategories() {
  return apiFetch<Category[]>('/categories');
}

export function createCategory(data: { name: string; slug: string; parentId?: string }) {
  return apiFetch<Category>('/categories', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}