'use client';

import { useId, useState, forwardRef, type InputHTMLAttributes } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

interface FloatingInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'id'> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
  success?: boolean;
}

export const FloatingInput = forwardRef<HTMLInputElement, FloatingInputProps>(function FloatingInput(
  { label, icon, error, success, type = 'text', className, ...props },
  ref,
) {
  const id = useId();
  const [focused, setFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const resolvedType = isPassword && showPassword ? 'text' : type;
  const hasValue = Boolean(props.value);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="relative">
        {icon && (
          <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </span>
        )}

        <input
          ref={ref}
          id={id}
          type={resolvedType}
          onFocus={(e) => {
            setFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            props.onBlur?.(e);
          }}
          className={`peer h-14 w-full rounded-xl border bg-white/80 pt-3 text-sm text-gray-900 outline-none transition placeholder:text-transparent dark:bg-gray-950/60 dark:text-white ${
            icon ? 'pl-11 pr-4' : 'px-4'
          } ${isPassword ? 'pr-11' : ''} ${
            error
              ? 'border-red-400 focus:border-red-500'
              : success
                ? 'border-emerald-400 focus:border-emerald-500'
                : 'border-gray-300 focus:border-gray-900 dark:border-gray-700 dark:focus:border-white'
          } ${className ?? ''}`}
          placeholder={label}
          {...props}
        />

        <label
          htmlFor={id}
          className={`pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-gray-400 transition-all peer-focus:top-3.5 peer-focus:text-[11px] peer-focus:text-gray-500 dark:peer-focus:text-gray-400 ${
            icon ? 'left-11' : 'left-4'
          } ${hasValue || focused ? 'top-3.5 text-[11px]' : ''}`}
        >
          {label}
        </label>

        {focused && !error && (
          <motion.span
            layoutId={`glow-${id}`}
            className="pointer-events-none absolute inset-0 rounded-xl ring-2 ring-brand-accent/40"
            transition={{ duration: 0.15 }}
          />
        )}

        {isPassword ? (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        ) : (
          (error || success) && (
            <span className={`absolute right-4 top-1/2 -translate-y-1/2 ${error ? 'text-red-500' : 'text-emerald-500'}`}>
              {error ? <AlertCircle size={17} /> : <CheckCircle2 size={17} />}
            </span>
          )
        )}
      </div>

      {error && <p className="pl-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});
