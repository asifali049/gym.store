'use client';

import { useQuery } from '@tanstack/react-query';
import { DataTable } from '@/components/data-table';
import { fetchAllUsers } from '@/lib/api/users';
import { ApiError } from '@/lib/api/client';

interface CustomerRow {
  id: string;
  name: string;
  email: string;
  role: string;
  joined: string;
}

export default function CustomersPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['admin', 'users'],
    queryFn: fetchAllUsers,
  });

  const rows: CustomerRow[] =
    data?.map((u) => ({
      id: u.id,
      name: `${u.firstName} ${u.lastName}`,
      email: u.email,
      role: u.role,
      joined: new Date(u.createdAt).toLocaleDateString(),
    })) ?? [];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Customers</h1>

      {isLoading && <p className="text-sm text-gray-500">Loading customers...</p>}

      {error && (
        <p className="text-sm text-red-600">
          {error instanceof ApiError ? error.message : "Couldn't load customers. Is the API running?"}
        </p>
      )}

      {!isLoading && !error && (
        <DataTable<CustomerRow>
          rows={rows}
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
            {
              key: 'role',
              label: 'Role',
              render: (row) => (
                <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
                  {row.role}
                </span>
              ),
            },
            { key: 'joined', label: 'Joined' },
          ]}
        />
      )}
    </div>
  );
}
