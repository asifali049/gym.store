import { apiFetch } from './client';

export interface ProductVariant {
  id: string;
  flavor: string | null;
  weight: string | null;
  price: number;
  stock: number;
  sku: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  images: string[];
  basePrice: number;
  isActive: boolean;
  brand: { id: string; name: string };
  category: { id: string; name: string };
  variants: ProductVariant[];
}

export interface CreateProductInput {
  name: string;
  slug: string;
  description: string;
  images?: string[];
  brandId: string;
  categoryId: string;
  basePrice: number;
  isActive?: boolean;
}

export interface CreateVariantInput {
  flavor?: string;
  weight?: string;
  price: number;
  stock: number;
  sku: string;
}

export function fetchProducts() {
  return apiFetch<Product[]>('/products');
}

export function createProduct(data: CreateProductInput) {
  return apiFetch<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateProduct(id: string, data: Partial<CreateProductInput>) {
  return apiFetch<Product>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function deleteProduct(id: string) {
  return apiFetch<void>(`/products/${id}`, { method: 'DELETE' });
}

export function addVariant(productId: string, data: CreateVariantInput) {
  return apiFetch<ProductVariant>(`/products/${productId}/variants`, {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function updateVariant(variantId: string, data: Partial<CreateVariantInput>) {
  return apiFetch<ProductVariant>(`/products/variants/${variantId}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export function removeVariant(variantId: string) {
  return apiFetch<void>(`/products/variants/${variantId}`, { method: 'DELETE' });
}