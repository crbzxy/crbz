import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/src/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary';
  children: ReactNode;
}

export function Button({
  variant = 'primary',
  className,
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 tracking-wide',
        'focus:outline-none focus:ring-2 focus:ring-offset-2',
        variant === 'primary'
          ? 'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 focus:ring-gray-900 dark:focus:ring-white'
          : 'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white focus:ring-gray-500',
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}

