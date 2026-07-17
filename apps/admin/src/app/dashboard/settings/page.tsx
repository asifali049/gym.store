export default function SettingsPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Settings</h1>

      <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-medium text-gray-500">Store Details</h2>
        <div className="flex flex-col gap-4">
          <label className="flex flex-col gap-1 text-sm">
            Store Name
            <input
              defaultValue="Fitness Platform"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Support Email
            <input
              defaultValue="support@fitnessplatform.com"
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950"
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            Currency
            <select className="rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-900 dark:border-gray-700 dark:bg-gray-950">
              <option>INR (₹)</option>
              <option>USD ($)</option>
            </select>
          </label>
        </div>
      </div>

      <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-gray-900">
        <h2 className="mb-4 text-sm font-medium text-gray-500">Payment Providers</h2>
        <div className="flex flex-col gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span>Razorpay</span>
            <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-700">Connected</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Stripe</span>
            <span className="rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-600">Not connected</span>
          </div>
        </div>
      </div>

      <button className="w-fit rounded-full bg-gray-900 px-6 py-2.5 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
        Save Changes
      </button>
    </div>
  );
}
