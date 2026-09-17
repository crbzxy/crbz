import type { HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export type BadgeProps = HTMLAttributes<HTMLSpanElement>;

export function Badge({ className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-medium tracking-wide bg-foreground text-background',
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
