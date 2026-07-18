import { apiFetch } from '../api-client';

export function createReview(productId: string, rating: number, comment?: string) {
  return apiFetch('/reviews', { method: 'POST', body: { productId, rating, comment } });
}

export function fetchWishlist() {
  return apiFetch<{ id: string; productId: string }[]>('/wishlist');
}

export function addToWishlist(productId: string) {
  return apiFetch('/wishlist', { method: 'POST', body: { productId } });
}

export function removeFromWishlist(id: string) {
  return apiFetch(`/wishlist/${id}`, { method: 'DELETE' });
}
