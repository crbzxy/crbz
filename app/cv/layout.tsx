import type { ReactNode } from 'react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'CV · Carlos Armando Boyzo Oregon',
  description: 'Currículum de Carlos Armando Boyzo Oregon — Ingeniero UX y desarrollador frontend (React y TypeScript).',
};

export default function CVLayout({ children }: { children: ReactNode }) {
  return <div className="cv-print-area">{children}</div>;
}
