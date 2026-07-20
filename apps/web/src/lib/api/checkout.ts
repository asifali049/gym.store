import { apiFetch } from './client';
import type { OrderDTO } from '@fitness-platform/types';

export interface AddressDTO {
  id: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string;
  pincode: string;
  country: string;
  isDefault: boolean;
}

export interface CreateAddressInput {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  country?: string;
  isDefault?: boolean;
}

export interface CouponResult {
  code: string;
  discount: number;
  finalTotal: number;
}

export interface PaymentOrderResult {
  paymentId: string;
  razorpayOrderId: string;
  amount: number;
  currency: string;
  keyId: string;
}

export function fetchMyOrders() {
  return apiFetch<OrderDTO[]>('/orders');
}

export function fetchOrder(orderId: string) {
  return apiFetch<OrderDTO>(`/orders/${orderId}`);
}

export function checkout(data: { addressId: string; couponCode?: string }) {
  return apiFetch<OrderDTO>('/orders/checkout', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function fetchAddresses() {
  return apiFetch<AddressDTO[]>('/addresses');
}

export function createAddress(data: CreateAddressInput) {
  return apiFetch<AddressDTO>('/addresses', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function applyCoupon(code: string, cartTotal: number) {
  return apiFetch<CouponResult>('/coupons/apply', {
    method: 'POST',
    body: JSON.stringify({ code, cartTotal }),
  });
}

export function createPaymentOrder(orderId: string) {
  return apiFetch<PaymentOrderResult>(`/payments/orders/${orderId}/create`, {
    method: 'POST',
  });
}

export function verifyPayment(data: {
  orderId: string;
  razorpayOrderId: string;
  razorpayPaymentId: string;
  razorpaySignature: string;
}) {
  return apiFetch<OrderDTO>('/payments/verify', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
