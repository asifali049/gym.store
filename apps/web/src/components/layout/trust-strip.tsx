import { Marquee } from '@/components/animations/marquee';
import { Download, Star, Gift, ShieldCheck } from 'lucide-react';

const BADGES = [
  { icon: Download, label: '2 Lakh+ Downloads' },
  { icon: Star, label: '4.5+ Customer Ratings' },
  { icon: Gift, label: 'Extra 5% Off on App' },
  { icon: ShieldCheck, label: 'Lab-Tested Purity' },
];

export function TrustStrip() {
  return (
    <div className="border-b border-gray-200 bg-gray-50 py-2.5 dark:border-gray-800 dark:bg-gray-900/40">
      <Marquee speed={22}>
        {BADGES.map(({ icon: Icon, label }) => (
          <span key={label} className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300">
            <Icon size={14} className="text-brand-accent" />
            {label}
          </span>
        ))}
      </Marquee>
    </div>
  );
}
