import type { HTMLAttributes } from 'react';
import { cn } from '@/src/utils/cn';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'skill' | 'secondary';
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
          ? 'bg-secondary text-secondary-foreground'
          : variant === 'secondary'
            ? 'bg-secondary text-secondary-foreground border border-border print:border print:border-border print:bg-transparent'
            : 'bg-primary/20 text-primary',
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

