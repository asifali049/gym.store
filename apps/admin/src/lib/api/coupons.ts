import { apiFetch } from './client';

export interface AdminCoupon {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderValue: number | null;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  isActive: boolean;
}

export function fetchAllCoupons() {
  return apiFetch<AdminCoupon[]>('/coupons');
}
