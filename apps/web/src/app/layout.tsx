import type { Metadata } from 'next';
import './globals.css';
import { SmoothScrollProvider } from '@/components/animations/smooth-scroll-provider';
import { CustomCursor } from '@/components/animations/custom-cursor';

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
        <CustomCursor />
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
