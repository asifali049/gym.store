import { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';

export function Button({
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={clsx(
        'rounded-full bg-gray-900 px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 active:scale-[0.98]',
        className,
      )}
      {...props}
    />
  );
}