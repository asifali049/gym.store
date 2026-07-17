import './globals.css';
import { Sidebar } from '@/components/sidebar';

export const metadata = { title: 'Admin | Fitness Platform' };

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-white">
        <div className="flex min-h-screen flex-col lg:flex-row">
          <Sidebar />
          <div className="flex-1 overflow-x-hidden p-4 sm:p-6 lg:p-8">{children}</div>
        </div>
      </body>
    </html>
  );
}
