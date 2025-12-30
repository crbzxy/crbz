import type { HTMLAttributes } from 'react';
import { cn } from '@/src/utils/cn';

export interface TextProps extends HTMLAttributes<HTMLElement> {
  as?: 'p' | 'span' | 'div';
  variant?: 'body' | 'lead' | 'small';
}

export function Text({
  as: Component = 'p',
  variant = 'body',
  className,
  children,
  ...props
}: TextProps) {
  return (
    <Component
      className={cn(
        'tracking-wide',
        variant === 'lead'
          ? 'text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed'
          : variant === 'small'
          ? 'text-sm text-gray-600 dark:text-gray-400'
          : 'text-base text-gray-700 dark:text-gray-300 leading-relaxed',
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
}

