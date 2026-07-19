'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { fetchAllOrders, updateOrderStatus } from '@/lib/api/orders';
import { ApiError } from '@/lib/api/client';

interface OrderRow {
  id: string;
  customer: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  CONFIRMED: 'bg-blue-100 text-blue-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
  REFUNDED: 'bg-gray-100 text-gray-600',
};

const STATUS_OPTIONS = ['PENDING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'REFUNDED'];

export default function OrdersPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'orders'],
    queryFn: fetchAllOrders,
  });

  const statusMutation = useMutation({
    mutationFn: ({ orderId, status }: { orderId: string; status: string }) => updateOrderStatus(orderId, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'orders'] }),
  });

  const rows: OrderRow[] =
    data?.map((o) => ({
      id: o.id,
      customer: `${o.user.firstName} ${o.user.lastName}`,
      status: o.status,
      totalAmount: Number(o.totalAmount),
      createdAt: new Date(o.createdAt).toLocaleDateString(),
    })) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Orders</h1>

      {isLoading && <p className="text-sm text-gray-500">Loading orders...</p>}

      {error && (
        <p className="text-sm text-red-600">
          {error instanceof ApiError ? error.message : "Couldn't load orders. Is the API running?"}
        </p>
      )}

      {!isLoading && !error && (
        <DataTable<OrderRow>
          rows={rows}
          columns={[
            { key: 'id', label: 'Order ID', render: (row) => <span className="font-mono text-xs">{row.id.slice(0, 8)}</span> },
            { key: 'customer', label: 'Customer' },
            {
              key: 'status',
              label: 'Status',
              render: (row) => (
                <select
                  value={row.status}
                  disabled={statusMutation.isPending}
                  onChange={(e) => statusMutation.mutate({ orderId: row.id, status: e.target.value })}
                  className={`rounded-full border-0 px-2.5 py-1 text-xs font-medium outline-none ${STATUS_STYLES[row.status] ?? ''}`}
                >
                  {STATUS_OPTIONS.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
              ),
            },
            { key: 'totalAmount', label: 'Total', render: (row) => `₹${row.totalAmount.toLocaleString()}` },
            { key: 'createdAt', label: 'Date' },
          ]}
        />
      )}
    </div>
  );
}
