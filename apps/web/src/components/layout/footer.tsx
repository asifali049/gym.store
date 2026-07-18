import Link from 'next/link';
import { Instagram, Twitter, Youtube } from 'lucide-react';
import { ScrollReveal } from '@/components/animations/scroll-reveal';

const COLUMNS = [
  {
    title: 'Shop',
    links: ['Whey Protein', 'Creatine', 'Pre Workout', 'Mass Gainer', 'Accessories'],
  },
  {
    title: 'Company',
    links: ['About Us', 'Careers', 'Blog', 'Contact'],
  },
  {
    title: 'Support',
    links: ['Track Order', 'Returns', 'FAQs', 'Shipping Info'],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-gray-200 bg-gray-50 px-6 py-16 dark:border-gray-800 dark:bg-gray-950">
      <div className="mx-auto max-w-7xl">
        <ScrollReveal>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-4">
            <div className="col-span-2 sm:col-span-1">
              <span className="text-lg font-semibold">PEAK<span className="text-brand-accent">FUEL</span></span>
              <p className="mt-3 max-w-xs text-sm text-gray-500">
                Premium fitness supplements engineered for real results.
              </p>
              <div className="mt-4 flex gap-3">
                <a href="#" aria-label="Instagram" className="rounded-full border border-gray-300 p-2 text-gray-500 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white">
                  <Instagram size={16} />
                </a>
                <a href="#" aria-label="Twitter" className="rounded-full border border-gray-300 p-2 text-gray-500 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white">
                  <Twitter size={16} />
                </a>
                <a href="#" aria-label="YouTube" className="rounded-full border border-gray-300 p-2 text-gray-500 hover:text-gray-900 dark:border-gray-700 dark:hover:text-white">
                  <Youtube size={16} />
                </a>
              </div>
            </div>

            {COLUMNS.map((col) => (
              <div key={col.title}>
                <h3 className="mb-4 text-sm font-semibold">{col.title}</h3>
                <ul className="flex flex-col gap-2.5 text-sm text-gray-500">
                  {col.links.map((link) => (
                    <li key={link}>
                      <Link href="#" className="hover:text-gray-900 dark:hover:text-white">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-gray-200 pt-6 text-xs text-gray-400 dark:border-gray-800 sm:flex-row">
          <span>© {new Date().getFullYear()} PeakFuel. All rights reserved.</span>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</Link>
            <Link href="#" className="hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
