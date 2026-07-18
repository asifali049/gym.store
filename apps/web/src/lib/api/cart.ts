import { apiFetch } from './client';

export interface CartItemVariant {
  id: string;
  flavor: string | null;
  weight: string | null;
  price: number;
  stock: number;
  product: {
    id: string;
    name: string;
    slug: string;
  };
}

export interface CartItem {
  id: string;
  quantity: number;
  variant: CartItemVariant;
}

export interface Cart {
  id: string;
  items: CartItem[];
}

export function fetchCart() {
  return apiFetch<Cart>('/cart');
}

export function addCartItem(variantId: string, quantity = 1) {
  return apiFetch<CartItem>('/cart/items', {
    method: 'POST',
    body: JSON.stringify({ variantId, quantity }),
  });
}

export function updateCartItem(itemId: string, quantity: number) {
  return apiFetch<CartItem>(`/cart/items/${itemId}`, {
    method: 'PATCH',
    body: JSON.stringify({ quantity }),
  });
}

export function removeCartItem(itemId: string) {
  return apiFetch<void>(`/cart/items/${itemId}`, { method: 'DELETE' });
}

export function clearCart() {
  return apiFetch<void>('/cart', { method: 'DELETE' });
}
