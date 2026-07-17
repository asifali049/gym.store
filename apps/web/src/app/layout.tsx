import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Fitness Platform | Premium Supplements',
    template: '%s | Fitness Platform',
  },
  description: 'Premium fitness supplements. Whey protein, creatine, pre-workout and more.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-white">
        {children}
      </body>
    </html>
  );
}
