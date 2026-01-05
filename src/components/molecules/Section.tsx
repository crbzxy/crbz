import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/src/utils/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  children: ReactNode;
  as?: 'section' | 'div';
  id?: string;
}

export function Section({
  title,
  children,
  as: Component = 'section',
  id,
  className,
  ...props
}: SectionProps) {
  return (
    <Component
      id={id}
      className={cn('section-padding', className)}
      {...props}
    >
      {title && (
        <div className="mb-16">
          <h2 className="font-display text-sm font-medium text-primary uppercase tracking-widest mb-4">
            {title}
          </h2>
        </div>
      )}
      {children}
    </Component>
  );
}
