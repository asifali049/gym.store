import { DataTable } from '@/components/data-table';

interface OrderRow {
  id: string;
  userId: string;
  status: string;
  totalAmount: number;
  createdAt: string;
}

// Static sample data — swap for a live apiFetch<OrderRow[]>('/orders') call once
// the API is running and an admin auth token is wired into this app.
const SAMPLE_ORDERS: OrderRow[] = [
  { id: 'ord_1029', userId: 'usr_881', status: 'PENDING', totalAmount: 2499, createdAt: '2026-07-15' },
  { id: 'ord_1028', userId: 'usr_640', status: 'SHIPPED', totalAmount: 1899, createdAt: '2026-07-14' },
  { id: 'ord_1027', userId: 'usr_112', status: 'DELIVERED', totalAmount: 3298, createdAt: '2026-07-13' },
];

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-amber-100 text-amber-700',
  SHIPPED: 'bg-blue-100 text-blue-700',
  DELIVERED: 'bg-emerald-100 text-emerald-700',
  CANCELLED: 'bg-red-100 text-red-700',
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Orders</h1>
      <DataTable<OrderRow>
        rows={SAMPLE_ORDERS}
        columns={[
          { key: 'id', label: 'Order ID' },
          { key: 'userId', label: 'Customer' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[row.status] ?? ''}`}>
                {row.status}
              </span>
            ),
          },
          { key: 'totalAmount', label: 'Total', render: (row) => `₹${row.totalAmount.toLocaleString()}` },
          { key: 'createdAt', label: 'Date' },
        ]}
      />
    </div>
  );
}
