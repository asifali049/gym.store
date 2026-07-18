import { apiFetch } from '../api-client';
import type { AddressDTO, OrderDTO } from '@fitness-platform/types';

export function fetchAddresses() {
  return apiFetch<AddressDTO[]>('/addresses');
}

export function createAddress(data: {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
}) {
  return apiFetch<AddressDTO>('/addresses', { method: 'POST', body: data });
}

export function applyCoupon(code: string, cartTotal: number) {
  return apiFetch<{ finalTotal: number; discount: number }>('/coupons/apply', {
    method: 'POST',
    body: { code, cartTotal },
  });
}

export interface CheckoutResult {
  order: OrderDTO;
  payment: { razorpayOrderId: string; razorpayKeyId: string; amount: number } | null;
}

export function checkout(data: { addressId: string; couponCode?: string }) {
  return apiFetch<CheckoutResult>('/orders/checkout', { method: 'POST', body: data });
}

export function verifyPayment(
  orderId: string,
  data: { razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string },
) {
  return apiFetch<OrderDTO>(`/orders/${orderId}/verify-payment`, { method: 'POST', body: data });
}

export function fetchMyOrders() {
  return apiFetch<OrderDTO[]>('/orders');
}

export function fetchOrder(id: string) {
  return apiFetch<OrderDTO>(`/orders/${id}`);
}
