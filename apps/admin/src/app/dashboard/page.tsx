'use client';

import { useQuery } from '@tanstack/react-query';
import { StatCard } from '@/components/stat-card';
import { RevenueChart, type RevenuePoint } from '@/components/revenue-chart';
import { fetchAllOrders } from '@/lib/api/orders';
import { fetchAllUsers } from '@/lib/api/users';
import { ApiError } from '@/lib/api/client';

const DAY_LABELS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function DashboardOverview() {
  const ordersQuery = useQuery({ queryKey: ['admin', 'orders'], queryFn: fetchAllOrders });
  const usersQuery = useQuery({ queryKey: ['admin', 'users'], queryFn: fetchAllUsers });

  const isLoading = ordersQuery.isLoading || usersQuery.isLoading;
  const error = ordersQuery.error ?? usersQuery.error;

  const orders = ordersQuery.data ?? [];
  const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount), 0);
  const orderCount = orders.length;
  const avgOrderValue = orderCount > 0 ? totalRevenue / orderCount : 0;
  const customerCount = usersQuery.data?.filter((u) => u.role === 'CUSTOMER').length ?? 0;

  // Revenue for the last 7 days, bucketed by day-of-week from real order data
  const last7Days: RevenuePoint[] = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    const dayRevenue = orders
      .filter((o) => new Date(o.createdAt).toDateString() === date.toDateString())
      .reduce((sum, o) => sum + Number(o.totalAmount), 0);
    return { day: DAY_LABELS[date.getDay()], revenue: dayRevenue };
  });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      {isLoading && <p className="text-sm text-gray-500">Loading dashboard data...</p>}

      {error && (
        <p className="text-sm text-red-600">
          {error instanceof ApiError ? error.message : "Couldn't load dashboard data. Is the API running?"}
        </p>
      )}

      {!isLoading && !error && (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} />
            <StatCard label="Total Orders" value={orderCount.toLocaleString()} />
            <StatCard label="Avg. Order Value" value={`₹${Math.round(avgOrderValue).toLocaleString()}`} />
            <StatCard label="Customers" value={customerCount.toLocaleString()} />
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
            <h2 className="mb-4 text-sm font-medium text-gray-500">Revenue - Last 7 days</h2>
            <RevenueChart data={last7Days} />
          </div>
        </>
      )}
    </div>
  );
}
