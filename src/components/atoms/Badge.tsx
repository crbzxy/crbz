import type { HTMLAttributes } from 'react';
import { cn } from '@/src/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'skill';
}

export function Badge({
  variant = 'default',
  className,
  children,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide',
        variant === 'skill'
          ? 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
          : 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

