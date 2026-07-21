'use client';

import { motion } from 'framer-motion';
import { Truck, Zap, ShieldCheck, Award, Gift } from 'lucide-react';

const BENEFITS = [
  { icon: Truck, label: 'Free Shipping' },
  { icon: Zap, label: 'Fast Delivery' },
  { icon: Award, label: 'Premium Supplements' },
  { icon: ShieldCheck, label: 'Secure Payments' },
  { icon: Gift, label: 'Earn Reward Points' },
];

export function AuthHero() {
  return (
    <div className="relative hidden h-full w-full overflow-hidden bg-gray-950 lg:block">
      {/* Mesh gradient background */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.25),transparent_45%),radial-gradient(circle_at_80%_70%,rgba(59,130,246,0.2),transparent_45%),radial-gradient(circle_at_50%_100%,rgba(34,197,94,0.15),transparent_50%)]" />

      {/* Floating blurred shapes */}
      <motion.div
        className="absolute -left-20 top-24 h-72 w-72 rounded-full bg-brand-accent/20 blur-3xl"
        animate={{ y: [0, 24, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute -right-16 bottom-32 h-80 w-80 rounded-full bg-blue-500/15 blur-3xl"
        animate={{ y: [0, -28, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Floating protein-bottle illustration (abstract, not a photo) */}
      <motion.div
        className="absolute right-16 top-1/3 opacity-20"
        animate={{ y: [0, -16, 0], rotate: [0, 4, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      >
        <svg width="140" height="200" viewBox="0 0 140 200" fill="none" xmlns="http://www.w3.org/2000/svg">
          <rect x="45" y="10" width="50" height="24" rx="6" fill="white" />
          <path d="M35 40 Q35 30 45 30 H95 Q105 30 105 40 V170 Q105 190 85 190 H55 Q35 190 35 170 Z" fill="white" />
          <rect x="35" y="90" width="70" height="8" fill="#0a0a0a" opacity="0.3" />
        </svg>
      </motion.div>

      <div className="relative z-10 flex h-full flex-col justify-between p-12 xl:p-16">
        <motion.div
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-xl font-bold tracking-tight text-white"
        >
          PEAK<span className="text-brand-accent">FUEL</span>
        </motion.div>

        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="max-w-md text-4xl font-semibold leading-tight text-white xl:text-5xl"
          >
            Fuel Your Strongest Self.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 max-w-sm text-gray-300"
          >
            Join thousands of athletes achieving their fitness goals with PeakFuel.
          </motion.p>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2"
          >
            {BENEFITS.map(({ icon: Icon, label }) => (
              <li key={label} className="flex items-center gap-2 text-sm text-gray-200">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-brand-accent/20 text-brand-accent">
                  <Icon size={13} />
                </span>
                {label}
              </li>
            ))}
          </motion.ul>
        </div>
      </div>
    </div>
  );
}
