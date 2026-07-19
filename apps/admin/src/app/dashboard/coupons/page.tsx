'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { fetchAllCoupons } from '@/lib/api/coupons';
import { ApiError } from '@/lib/api/client';

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

export default function CouponsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'coupons'],
    queryFn: fetchAllCoupons,
  });

  const rows: CouponRow[] =
    data?.map((c) => ({
      ...c,
      discountValue: Number(c.discountValue),
      minOrderValue: c.minOrderValue !== null ? Number(c.minOrderValue) : null,
      expiresAt: c.expiresAt ? new Date(c.expiresAt).toLocaleDateString() : null,
    })) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold">Coupons</h1>
        <button className="rounded-full bg-gray-900 px-5 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
          + Create Coupon
        </button>
      </div>

      {isLoading && <p className="text-sm text-gray-500">Loading coupons...</p>}

      {error && (
        <p className="text-sm text-red-600">
          {error instanceof ApiError ? error.message : "Couldn't load coupons. Is the API running?"}
        </p>
      )}

      {!isLoading && !error && (
        <DataTable<CouponRow>
          rows={rows}
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
      )}
    </div>
  );
}
