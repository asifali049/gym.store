import Link from 'next/link';
import { ChevronRight, Package } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { ProductCardTilt } from '@/components/animations/product-card-tilt';
import { unslugify } from '@/lib/slugify';
import { formatINR } from '@/lib/format';
import type { Metadata } from 'next';
import type { ProductDTO } from '@fitness-platform/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000/api/v1';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const title = unslugify(slug);
  return {
    title,
    description: `Shop ${title} at PeakFuel — premium, lab-tested fitness supplements.`,
  };
}

async function getProductsForSlug(slug: string): Promise<ProductDTO[]> {
  const res = await fetch(`${API_URL}/products?category=${encodeURIComponent(slug)}`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const title = unslugify(slug);
  const products = await getProductsForSlug(slug);

  return (
    <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
      {/* Breadcrumb */}
      <nav className="mb-6 flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
        <Link href="/" className="hover:text-gray-900 dark:hover:text-white">Home</Link>
        <ChevronRight size={12} />
        <span className="font-medium text-gray-900 dark:text-white">{title}</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{products.length} products</p>
        </div>
      </div>

      {products.length === 0 && (
        <p className="text-gray-500 dark:text-gray-400">No products in this category yet.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <ScrollReveal key={product.id} delay={Math.min(i * 0.05, 0.3)}>
            <Link href={`/products/${product.slug}`}>
              <ProductCardTilt className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
                <div className="flex aspect-square items-center justify-center bg-gray-50 text-3xl text-gray-300 dark:bg-gray-800">
                  <Package size={32} />
                </div>
                <div className="p-4">
                  <p className="text-[11px] font-medium uppercase tracking-wide text-gray-400">
                    {product.brand.name}
                  </p>
                  <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                  <p className="mt-1.5 text-sm font-semibold">{formatINR(product.basePrice)}</p>
                </div>
              </ProductCardTilt>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}