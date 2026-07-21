import { apiFetch } from '../api-client';

export interface CategoryDTO {
  id: string;
  name: string;
  slug: string;
  parentId: string | null;
}

export function fetchCategories() {
  return apiFetch<CategoryDTO[]>('/categories', { skipAuth: true });
}