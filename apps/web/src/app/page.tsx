import Link from 'next/link';
import { TextReveal } from '@/components/animations/text-reveal';
import { ScrollReveal } from '@/components/animations/scroll-reveal';
import { MagneticButton } from '@/components/animations/magnetic-button';
import { Accordion } from '@/components/animations/accordion';
import { BestsellersTabs } from '@/components/sections/bestsellers-tabs';

const CATEGORIES = [
  { name: 'Whey Protein', slug: 'whey-protein' },
  { name: 'Creatine', slug: 'creatine' },
  { name: 'Pre Workout', slug: 'pre-workout' },
  { name: 'Mass Gainer', slug: 'mass-gainer' },
];

const GOALS = [
  { name: 'Build Muscle', desc: 'High-protein stacks for lean gains' },
  { name: 'Lose Fat', desc: 'Thermogenics and clean fuel' },
  { name: 'Boost Performance', desc: 'Pre-workouts and endurance support' },
  { name: 'Recover Faster', desc: 'BCAAs, electrolytes, sleep aids' },
];

const FAQS = [
  { question: 'How long does shipping take?', answer: 'Orders are typically delivered within 3-5 business days across India, with express options at checkout.' },
  { question: 'Are your products lab tested?', answer: 'Yes, every batch is third-party lab tested for purity and label accuracy before it ships.' },
  { question: 'What is your return policy?', answer: 'Unopened products can be returned within 15 days of delivery for a full refund.' },
];

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative flex min-h-[85vh] flex-col items-center justify-center gap-6 px-6 text-center">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-brand-accent/5 via-transparent to-transparent" />
        <ScrollReveal>
          <span className="rounded-full border border-gray-200 px-4 py-1.5 text-xs font-medium text-gray-500 dark:border-gray-800">
            Lab-Tested · Third-Party Verified
          </span>
        </ScrollReveal>
        <h1 className="max-w-4xl text-5xl font-semibold tracking-tight sm:text-7xl">
          <TextReveal text="Fuel Your Potential" />
        </h1>
        <ScrollReveal delay={0.4}>
          <p className="max-w-xl text-lg text-gray-500 dark:text-gray-400">
            Premium fitness supplements, engineered for performance.
          </p>
        </ScrollReveal>
        <ScrollReveal delay={0.6}>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-4">
            <Link href="/products">
              <MagneticButton className="rounded-full bg-gray-900 px-8 py-4 text-sm font-medium text-white dark:bg-white dark:text-gray-900">
                Shop Now
              </MagneticButton>
            </Link>
          </div>
        </ScrollReveal>
      </section>

      {/* Categories */}
      <section className="px-6 py-16">
        <ScrollReveal>
          <h2 className="mb-10 text-center text-3xl font-semibold">Shop by Category</h2>
        </ScrollReveal>
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-4 sm:grid-cols-4">
          {CATEGORIES.map((cat, i) => (
            <ScrollReveal key={cat.name} delay={i * 0.08}>
              <Link href={`/category/${cat.slug}`} className="group block">
                <div className="flex aspect-square items-center justify-center rounded-2xl border border-gray-200 bg-gray-50 transition group-hover:border-gray-300 dark:border-gray-800 dark:bg-gray-900/40">
                  <span className="text-sm font-medium text-gray-400">{cat.name}</span>
                </div>
                <p className="mt-3 text-center text-sm font-medium">{cat.name}</p>
              </Link>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Shop by Goal */}
      <section className="bg-gray-50 px-6 py-24 dark:bg-gray-900/40">
        <ScrollReveal>
          <h2 className="mb-10 text-center text-3xl font-semibold">Shop by Goal</h2>
        </ScrollReveal>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {GOALS.map((goal, i) => (
            <ScrollReveal key={goal.name} delay={i * 0.08}>
              <div className="h-full rounded-3xl border border-gray-200 bg-white p-6 transition hover:-translate-y-1 hover:shadow-lg dark:border-gray-800 dark:bg-gray-950">
                <h3 className="text-lg font-semibold">{goal.name}</h3>
                <p className="mt-2 text-sm text-gray-500">{goal.desc}</p>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>

      {/* Season's Bestsellers — tabbed */}
      <BestsellersTabs />

      {/* FAQ */}
      <section className="mx-auto max-w-2xl px-6 py-24">
        <ScrollReveal>
          <h2 className="mb-8 text-center text-3xl font-semibold">Frequently Asked Questions</h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <Accordion items={FAQS} />
        </ScrollReveal>
      </section>

      {/* Newsletter */}
      <section className="px-6 pb-24">
        <ScrollReveal>
          <div className="mx-auto flex max-w-4xl flex-col items-center gap-6 rounded-[2.5rem] bg-gray-900 px-8 py-16 text-center dark:bg-white">
            <h2 className="text-3xl font-semibold text-white dark:text-gray-900 sm:text-4xl">
              Get 10% off your first order
            </h2>
            <p className="max-w-md text-gray-300 dark:text-gray-600">
              Join our newsletter for exclusive drops, fitness tips, and early access to sales.
            </p>
            <form className="flex w-full max-w-md flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-gray-700 bg-transparent px-5 py-3 text-sm text-white placeholder-gray-400 outline-none focus:border-white dark:border-gray-300 dark:text-gray-900 dark:placeholder-gray-500 dark:focus:border-gray-900"
              />
              <MagneticButton className="rounded-full bg-brand-accent px-6 py-3 text-sm font-medium text-white">
                Subscribe
              </MagneticButton>
            </form>
          </div>
        </ScrollReveal>
      </section>
    </main>
  );
}