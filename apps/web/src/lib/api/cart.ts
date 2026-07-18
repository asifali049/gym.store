import { apiFetch } from "../api-client";
import type { CartDTO } from "@fitness-platform/types";

/**
 * Fetch current authenticated user's cart.
 */
export async function fetchCart(): Promise<CartDTO> {
  return await apiFetch<CartDTO>("/cart");
}

/**
 * Add a product variant to the cart.
 */
export async function addCartItem(
  variantId: string,
  quantity: number
): Promise<CartDTO> {
  return await apiFetch<CartDTO>("/cart/items", {
    method: "POST",
    body: {
      variantId,
      quantity,
    },
  });
}

/**
 * Update quantity of an existing cart item.
 */
export async function updateCartItem(
  itemId: string,
  quantity: number
): Promise<CartDTO> {
  return await apiFetch<CartDTO>(`/cart/items/${itemId}`, {
    method: "PATCH",
    body: {
      quantity,
    },
  });
}

/**
 * Remove an item from the cart.
 */
export async function removeCartItem(
  itemId: string
): Promise<CartDTO> {
  return await apiFetch<CartDTO>(`/cart/items/${itemId}`, {
    method: "DELETE",
  });
}