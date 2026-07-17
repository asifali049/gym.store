import { DataTable } from '@/components/data-table';

interface CouponRow {
  id: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FLAT';
  discountValue: number;
  minOrderValue: number | null;
  usedCount: number;
  maxUses: number | null;
  expiresAt: string | null;
  isActive: boolean;
}

// Static sample data — swap for a live apiFetch<CouponRow[]>('/coupons') call
// once the API is running (GET /coupons is already RBAC-protected, admin-only).
const SAMPLE_COUPONS: CouponRow[] = [
  { id: 'c_1', code: 'FIRST50', discountType: 'PERCENTAGE', discountValue: 50, minOrderValue: 999, usedCount: 214, maxUses: 500, expiresAt: '2026-08-31', isActive: true },
  { id: 'c_2', code: 'FLAT200', discountType: 'FLAT', discountValue: 200, minOrderValue: 1500, usedCount: 88, maxUses: null, expiresAt: null, isActive: true },
  { id: 'c_3', code: 'SUMMER10', discountType: 'PERCENTAGE', discountValue: 10, minOrderValue: null, usedCount: 500, maxUses: 500, expiresAt: '2026-06-30', isActive: false },
];

export default function CouponsPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <button className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
          + Create Coupon
        </button>
      </div>
      <DataTable<CouponRow>
        rows={SAMPLE_COUPONS}
        columns={[
          { key: 'code', label: 'Code', render: (row) => <span className="font-mono font-medium">{row.code}</span> },
          {
            key: 'discountValue',
            label: 'Discount',
            render: (row) => (row.discountType === 'PERCENTAGE' ? `${row.discountValue}%` : `₹${row.discountValue}`),
          },
          {
            key: 'minOrderValue',
            label: 'Min. Order',
            render: (row) => (row.minOrderValue ? `₹${row.minOrderValue.toLocaleString()}` : '—'),
          },
          {
            key: 'usedCount',
            label: 'Used',
            render: (row) => `${row.usedCount}${row.maxUses ? ` / ${row.maxUses}` : ''}`,
          },
          { key: 'expiresAt', label: 'Expires', render: (row) => row.expiresAt ?? 'No expiry' },
          {
            key: 'isActive',
            label: 'Status',
            render: (row) => (
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                  row.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                }`}
              >
                {row.isActive ? 'Active' : 'Inactive'}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
