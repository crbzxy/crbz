import NextLink from 'next/link';
import type { ComponentProps } from 'react';
import { cn } from '@/src/utils/cn';

export interface LinkProps extends ComponentProps<typeof NextLink> {
  variant?: 'default' | 'nav';
}

export function Link({ variant = 'default', className, ...props }: LinkProps) {
  return (
    <NextLink
      className={cn(
        'transition-colors duration-200',
        variant === 'nav'
          ? 'text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium tracking-wide focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-3 py-2'
          : 'text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline-offset-4 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded',
        className
      )}
      {...props}
    />
  );
}

