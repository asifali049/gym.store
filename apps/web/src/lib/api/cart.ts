import { apiFetch } from '../api-client';
import type { CartDTO } from '@fitness-platform/types';

export function fetchCart() {
  return apiFetch<CartDTO>('/cart');
}

export function addCartItem(variantId: string, quantity: number) {
  return apiFetch('/cart/items', { method: 'POST', body: { variantId, quantity } });
}

export function updateCartItem(itemId: string, quantity: number) {
  return apiFetch(`/cart/items/${itemId}`, { method: 'PATCH', body: { quantity } });
}

export function removeCartItem(itemId: string) {
  return apiFetch(`/cart/items/${itemId}`, { method: 'DELETE' });
}
