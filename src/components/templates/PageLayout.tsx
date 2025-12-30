import type { ReactNode } from 'react';
import { Header } from '@/src/components/organisms/Header';
import { Footer } from '@/src/components/organisms/Footer';

export interface PageLayoutProps {
  children: ReactNode;
}

export function PageLayout({ children }: PageLayoutProps) {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-white dark:bg-gray-900">
        {children}
      </main>
      <Footer />
    </>
  );
}

