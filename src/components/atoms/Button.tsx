import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/src/utils/cn';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'default' | 'sm';
  children: ReactNode;
  asChild?: boolean;
}

export function Button({
  variant = 'primary',
  size = 'default',
  className,
  children,
  asChild = false,
  ...props
}: ButtonProps) {
  const baseClasses = 'inline-flex items-center justify-center gap-2 rounded-lg font-semibold transition-all duration-300 tracking-wide focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background';

  const sizeClasses =
    size === 'sm'
      ? 'px-4 py-2 text-sm'
      : 'px-6 py-3';

  const variantClasses =
    variant === 'primary'
      ? 'bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary'
      : variant === 'outline'
        ? 'border border-border bg-transparent text-foreground hover:bg-secondary focus:ring-muted-foreground'
        : 'bg-secondary text-secondary-foreground border border-border hover:bg-secondary/80 focus:ring-muted-foreground';

  const classes = cn(baseClasses, sizeClasses, variantClasses, className);

  if (asChild && typeof children === 'object' && children !== null && 'props' in children) {
    return children;
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}
