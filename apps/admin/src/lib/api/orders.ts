import { apiFetch } from './client';

export interface AdminOrder {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  user: { firstName: string; lastName: string; email: string };
  items: { id: string; quantity: number; price: number }[];
}

export function fetchAllOrders() {
  return apiFetch<AdminOrder[]>('/orders/admin/all');
}

export function updateOrderStatus(orderId: string, status: string) {
  return apiFetch<AdminOrder>(`/orders/${orderId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}
