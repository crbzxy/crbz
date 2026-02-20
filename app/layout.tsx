import type { Metadata } from 'next';
import { spaceGrotesk, inter } from '@/src/constants/fonts';
import './globals.css';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://carlosboyzo.com';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: 'Carlos Boyzo Oregón · Ingeniero UX y desarrollador frontend',
    template: '%s | Carlos Boyzo Oregón',
  },
  description:
    'Ingeniero UX y desarrollador frontend (React y TypeScript). Arquitecto de experiencias digitales, sistemas de diseño y desarrollo móvil.',
  keywords: ['UX', 'frontend', 'React', 'TypeScript', 'diseño', 'desarrollador', 'Carlos Boyzo'],
  authors: [{ name: 'Carlos Armando Boyzo Oregon', url: siteUrl }],
  openGraph: {
    type: 'website',
    locale: 'es_MX',
    url: siteUrl,
    siteName: 'Carlos Boyzo Oregón',
    title: 'Carlos Boyzo Oregón · Ingeniero UX y desarrollador frontend',
    description:
      'Ingeniero UX y desarrollador frontend (React y TypeScript). Arquitecto de experiencias digitales y sistemas de diseño.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
