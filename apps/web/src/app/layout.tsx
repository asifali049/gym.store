import type { Metadata } from 'next';
import './globals.css';
import { SmoothScrollProvider } from '@/components/animations/smooth-scroll-provider';
import { CustomCursor } from '@/components/animations/custom-cursor';
import { PageLoader } from '@/components/animations/page-loader';
import { StoreHeader } from '@/components/layout/store-header';
import { CategoryBar } from '@/components/layout/category-bar';
import { TrustStrip } from '@/components/layout/trust-strip';
import { Footer } from '@/components/layout/footer';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'https://fitnessplatform.com'),
  title: {
    default: 'Fitness Platform | Premium Supplements',
    template: '%s | Fitness Platform',
  },
  description: 'Premium fitness supplements. Whey protein, creatine, pre-workout and more.',
  openGraph: {
    title: 'Fitness Platform | Premium Supplements',
    description: 'Premium fitness supplements. Whey protein, creatine, pre-workout and more.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Fitness Platform | Premium Supplements',
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased dark:bg-gray-950 dark:text-white">
        <PageLoader />
        <CustomCursor />
        <SmoothScrollProvider>
          <StoreHeader />
          <CategoryBar />
          <TrustStrip />
          {children}
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
