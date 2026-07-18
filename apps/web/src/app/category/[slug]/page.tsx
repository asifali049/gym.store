import Link from 'next/link';
import Image from 'next/image';
import { ChevronRight, SlidersHorizontal } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { ProductCardTilt } from '@/components/animations/product-card-tilt';
import { unslugify } from '@/lib/slugify';
import type { Metadata } from 'next';

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

// Deterministic placeholder catalogue per category — swap for a live
// apiFetch<Product[]>(`/products?category=${slug}`) call once the API is wired up.
function getProductsForSlug(slug: string) {
  const basePrices = [899, 1299, 1899, 2199, 2499, 749, 1599, 3199];
  return Array.from({ length: 8 }).map((_, i) => ({
    id: `${slug}-${i}`,
    name: `${unslugify(slug)} Item ${i + 1}`,
    price: basePrices[i % basePrices.length],
    img: `https://picsum.photos/seed/${slug}-${i}/400/400`,
  }));
}

export default async function CategoryPage({ params }: PageProps) {
  const { slug } = await params;
  const title = unslugify(slug);
  const products = getProductsForSlug(slug);

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
        <button className="flex items-center gap-2 rounded-full border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 dark:border-gray-700 dark:text-gray-300">
          <SlidersHorizontal size={15} />
          Filter & Sort
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {products.map((product, i) => (
          <ScrollReveal key={product.id} delay={Math.min(i * 0.05, 0.3)}>
            <ProductCardTilt className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900">
              <div className="relative aspect-square bg-gray-50 dark:bg-gray-800">
                <Image src={product.img} alt={product.name} fill className="object-cover" />
              </div>
              <div className="p-4">
                <h3 className="truncate text-sm font-semibold">{product.name}</h3>
                <p className="mt-1.5 text-sm font-semibold">₹{product.price.toLocaleString()}</p>
              </div>
            </ProductCardTilt>
          </ScrollReveal>
        ))}
      </div>
    </main>
  );
}
