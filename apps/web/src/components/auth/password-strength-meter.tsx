'use client';

import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Rule {
  label: string;
  test: (v: string) => boolean;
}

const RULES: Rule[] = [
  { label: '8+ characters', test: (v) => v.length >= 8 },
  { label: 'Uppercase letter', test: (v) => /[A-Z]/.test(v) },
  { label: 'Lowercase letter', test: (v) => /[a-z]/.test(v) },
  { label: 'Number', test: (v) => /\d/.test(v) },
  { label: 'Special character', test: (v) => /[^A-Za-z0-9]/.test(v) },
];

export function PasswordStrengthMeter({ password }: { password: string }) {
  const passed = RULES.filter((rule) => rule.test(password)).length;
  const strength = password.length === 0 ? 0 : passed / RULES.length;

  const barColor =
    strength < 0.4 ? 'bg-red-500' : strength < 0.8 ? 'bg-amber-500' : 'bg-emerald-500';
  const strengthLabel =
    password.length === 0 ? '' : strength < 0.4 ? 'Weak' : strength < 0.8 ? 'Good' : 'Strong';

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex items-center gap-2">
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-gray-200 dark:bg-gray-800">
          <motion.div
            className={`h-full rounded-full ${barColor}`}
            initial={{ width: 0 }}
            animate={{ width: `${strength * 100}%` }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          />
        </div>
        {strengthLabel && (
          <span className="w-12 shrink-0 text-right text-xs font-medium text-gray-500">{strengthLabel}</span>
        )}
      </div>

      <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
        {RULES.map((rule) => {
          const ok = rule.test(password);
          return (
            <li key={rule.label} className={`flex items-center gap-1.5 text-xs ${ok ? 'text-emerald-600' : 'text-gray-400'}`}>
              {ok ? <Check size={13} /> : <X size={13} className="opacity-40" />}
              {rule.label}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
