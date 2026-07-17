import { StatCard } from '@/components/stat-card';
import { RevenueChart } from '@/components/revenue-chart';

export default function DashboardOverview() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Overview</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Revenue (30d)" value="₹18,42,900" change="+12.4% vs last month" />
        <StatCard label="Orders (30d)" value="1,284" change="+8.1%" />
        <StatCard label="Avg. Order Value" value="₹1,435" />
        <StatCard label="Active Customers" value="9,204" change="+4.2%" />
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-medium text-gray-500">Revenue - Last 7 days</h2>
        <RevenueChart />
      </div>
    </div>
  );
}
