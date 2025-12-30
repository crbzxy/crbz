import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/src/utils/cn';

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  title?: string;
  children: ReactNode;
  as?: 'section' | 'div';
}

export function Section({
  title,
  children,
  as: Component = 'section',
  className,
  ...props
}: SectionProps) {
  return (
    <Component
      className={cn('py-12 md:py-16', className)}
      {...props}
    >
      {title && (
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-8 tracking-tight">
          {title}
        </h2>
      )}
      {children}
    </Component>
  );
}

