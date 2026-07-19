import { apiFetch } from './client';

export interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  isActive: boolean;
  brand: { name: string };
  category: { name: string };
  variants: { id: string; flavor: string | null; weight: string | null; price: number; stock: number; sku: string }[];
}

export function fetchProducts() {
  return apiFetch<Product[]>('/products');
}
