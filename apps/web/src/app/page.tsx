import { TextReveal } from '@/components/animations/text-reveal';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { MagneticButton } from '@/components/animations/magnetic-button';
import { ProductCardTilt } from '@/components/animations/product-card-tilt';
import { Counter } from '@/components/animations/counter';

const FEATURED = [
  { name: 'Whey Isolate Gold', price: '₹2,499', tag: 'Best Seller' },
  { name: 'Creatine Monohydrate', price: '₹899', tag: 'Trending' },
  { name: 'Pre-Workout Ignite', price: '₹1,299', tag: 'New' },
];

export default function HomePage() {
  return (
    <main>
      {/* Hero */}
      <section className="flex min-h-screen flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-5xl font-semibold tracking-tight sm:text-7xl">
          <TextReveal text="Fuel Your Potential" />
        </h1>
        <ScrollReveal delay={0.4}>
          <p className="max-w-xl text-lg text-gray-500 dark:text-gray-400">
            Premium fitness supplements, engineered for performance.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.6}>
          <MagneticButton className="mt-4 rounded-full bg-gray-900 px-8 py-4 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
            Shop Now
          </MagneticButton>
        </ScrollReveal>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-1 gap-8 px-6 py-24 text-center sm:grid-cols-3">
        <ScrollReveal>
          <Counter to={50000} suffix="+" className="text-4xl font-semibold" />
          <p className="mt-2 text-gray-500">Happy Customers</p>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Counter to={120} suffix="+" className="text-4xl font-semibold" />
          <p className="mt-2 text-gray-500">Products</p>
        </ScrollReveal>
        <ScrollReveal delay={0.2}>
          <Counter to={98} suffix="%" className="text-4xl font-semibold" />
          <p className="mt-2 text-gray-500">Satisfaction Rate</p>
        </ScrollReveal>
      </section>

      {/* Featured products */}
      <section className="px-6 py-24">
        <ScrollReveal>
          <h2 className="mb-10 text-center text-3xl font-semibold">Best Sellers</h2>
        </ScrollReveal>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-3">
          {FEATURED.map((product, i) => (
            <ScrollReveal key={product.name} delay={i * 0.1}>
              <ProductCardTilt className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
                <span className="text-xs font-medium uppercase tracking-wide text-brand-accent">
                  {product.tag}
                </span>
                <h3 className="mt-3 text-lg font-semibold">{product.name}</h3>
                <p className="mt-1 text-gray-500">{product.price}</p>
              </ProductCardTilt>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </main>
  );
}
