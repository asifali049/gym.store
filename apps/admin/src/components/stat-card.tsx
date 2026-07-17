export function StatCard({ label, value, change }: { label: string; value: string; change?: string }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold">{value}</p>
      {change && <p className="mt-1 text-xs text-emerald-600">{change}</p>}
    </div>
  );
}
