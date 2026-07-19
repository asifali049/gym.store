import './globals.css';
import { QueryProvider } from '@/components/providers/query-provider';

export const metadata = { title: 'Admin | Fitness Platform' };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-white">
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
