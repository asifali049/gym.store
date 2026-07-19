'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Check, ShieldCheck, Truck, Sparkles, Gift } from 'lucide-react';

const BENEFITS = [
  { icon: Truck, label: 'Free Shipping' },
  { icon: Sparkles, label: 'Premium Supplements' },
  { icon: ShieldCheck, label: 'Secure Payments' },
  { icon: Gift, label: 'Earn Reward Points' },
];

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-950 dark:to-black">
      {/* Ambient blur circles — light + dark aware */}
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-brand-accent/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 top-1/3 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl dark:bg-blue-500/10" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-purple-400/10 blur-3xl dark:bg-purple-500/10" />

      {/* Left — hero panel, hidden below lg */}
      <div className="relative hidden w-[45%] shrink-0 lg:block">
        <motion.div
          initial={{ scale: 1.12 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src="https://picsum.photos/seed/peakfuel-athlete/1200/1600"
            alt="Athlete training"
            fill
            priority
            sizes="45vw"
            className="object-cover"
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/60 to-black/30" />

        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h1 className="text-4xl font-semibold leading-tight tracking-tight">
              Fuel Your <br /> Strongest Self.
            </h1>
            <p className="mt-4 max-w-sm text-gray-300">
              Join thousands of athletes achieving their fitness goals with PeakFuel.
            </p>

            <ul className="mt-8 flex flex-col gap-3">
              {BENEFITS.map(({ icon: Icon, label }, i) => (
                <motion.li
                  key={label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.4 + i * 0.08 }}
                  className="flex items-center gap-2.5 text-sm text-gray-200"
                >
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/10">
                    <Icon size={13} />
                  </span>
                  {label}
                </motion.li>
              ))}
            </ul>

            <div className="mt-10 flex items-center gap-6 border-t border-white/10 pt-6 text-sm text-gray-300">
              <div>
                <p className="text-lg font-semibold text-white">50K+</p>
                <p>Customers</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-white">100K+</p>
                <p>Orders</p>
              </div>
              <div className="flex items-center gap-1">
                <div>
                  <p className="text-lg font-semibold text-white">4.9</p>
                  <p>Rating</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Right — glass auth card */}
      <div className="flex flex-1 items-center justify-center px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full max-w-[460px] rounded-[32px] border border-gray-200/60 bg-white/70 p-8 shadow-xl backdrop-blur-xl dark:border-white/10 dark:bg-white/[0.04] sm:p-10"
        >
          {children}
        </motion.div>
      </div>
    </div>
  );
}

export function AuthLogo() {
  return (
    <div className="mb-6 flex items-center gap-2 text-lg font-bold tracking-tight">
      PEAK<span className="text-brand-accent">FUEL</span>
    </div>
  );
}
