import { DataTable, StarRating } from '@/components/data-table';

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  orders: number;
  totalSpent: number;
  joined: string;
  status: 'ACTIVE' | 'BLOCKED';
}

// Static sample data — swap for a live apiFetch<CustomerRow[]>('/users') call
// once the API is running (GET /users is already RBAC-protected, admin-only).
const SAMPLE_CUSTOMERS: CustomerRow[] = [
  { id: 'usr_881', name: 'Rohan Mehta', email: 'rohan.mehta@example.com', orders: 12, totalSpent: 28450, joined: '2025-11-02', status: 'ACTIVE' },
  { id: 'usr_640', name: 'Priya Sharma', email: 'priya.sharma@example.com', orders: 5, totalSpent: 9820, joined: '2026-01-18', status: 'ACTIVE' },
  { id: 'usr_112', name: 'Aman Gupta', email: 'aman.gupta@example.com', orders: 21, totalSpent: 52130, joined: '2025-08-30', status: 'ACTIVE' },
  { id: 'usr_305', name: 'Sneha Kapoor', email: 'sneha.kapoor@example.com', orders: 1, totalSpent: 899, joined: '2026-06-10', status: 'BLOCKED' },
];

const STATUS_STYLES: Record<CustomerRow['status'], string> = {
  ACTIVE: 'bg-emerald-100 text-emerald-700',
  BLOCKED: 'bg-red-100 text-red-700',
};

export default function CustomersPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Customers</h1>
      <DataTable<CustomerRow>
        rows={SAMPLE_CUSTOMERS}
        columns={[
          {
            key: 'name',
            label: 'Customer',
            render: (row) => (
              <div>
                <p className="font-medium">{row.name}</p>
                <p className="text-xs text-gray-500">{row.email}</p>
              </div>
            ),
          },
          { key: 'orders', label: 'Orders' },
          { key: 'totalSpent', label: 'Total Spent', render: (row) => `₹${row.totalSpent.toLocaleString()}` },
          { key: 'joined', label: 'Joined' },
          {
            key: 'status',
            label: 'Status',
            render: (row) => (
              <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${STATUS_STYLES[row.status]}`}>
                {row.status}
              </span>
            ),
          },
        ]}
      />
    </div>
  );
}
