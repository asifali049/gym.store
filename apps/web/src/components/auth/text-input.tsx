'use client';

import { forwardRef, useId, useState, type InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Check, AlertCircle, type LucideIcon } from 'lucide-react';

interface TextInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  icon: LucideIcon;
  error?: string;
  success?: boolean;
}

export const TextInput = forwardRef<HTMLInputElement, TextInputProps>(
  ({ label, icon: Icon, error, success, className, id, ...props }, ref) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const [focused, setFocused] = useState(false);

    return (
      <div className="flex flex-col gap-1.5">
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {label}
        </label>
        <motion.div
          animate={{
            boxShadow: focused
              ? '0 0 0 4px rgba(34,197,94,0.15)'
              : error
                ? '0 0 0 4px rgba(239,68,68,0.1)'
                : '0 0 0 0px rgba(0,0,0,0)',
          }}
          transition={{ duration: 0.2 }}
          className={`flex items-center gap-3 rounded-xl border px-4 py-3.5 transition-colors ${
            error
              ? 'border-red-400 dark:border-red-500'
              : focused
                ? 'border-gray-900 dark:border-white'
                : 'border-gray-200 dark:border-gray-700'
          } bg-white/60 dark:bg-gray-950/40`}
        >
          <Icon size={17} className="shrink-0 text-gray-400" />
          <input
            ref={ref}
            id={inputId}
            className={`w-full bg-transparent text-sm text-gray-900 outline-none placeholder:text-gray-400 dark:text-white ${className ?? ''}`}
            onFocus={(e) => {
              setFocused(true);
              props.onFocus?.(e);
            }}
            onBlur={(e) => {
              setFocused(false);
              props.onBlur?.(e);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : undefined}
            {...props}
          />
          {success && !error && <Check size={17} className="shrink-0 text-emerald-500" />}
        </motion.div>
        {error && (
          <p id={`${inputId}-error`} className="flex items-center gap-1 text-xs text-red-500">
            <AlertCircle size={12} />
            {error}
          </p>
        )}
      </div>
    );
  },
);

TextInput.displayName = 'TextInput';
