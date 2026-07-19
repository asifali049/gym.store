import { Sidebar } from '@/components/sidebar';
import { RequireAdmin } from '@/components/auth/require-admin';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAdmin>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <Sidebar />
        <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</div>
      </div>
    </RequireAdmin>
  );
}
