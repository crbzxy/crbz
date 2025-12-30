import type { Metadata } from 'next';
import { robotoCondensed, robotoMono } from '@/src/constants/fonts';
import './globals.css';

export const metadata: Metadata = {
  title: 'Carlos Boyzo Oregón',
  description: 'Artista y Desarrollador UX',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${robotoCondensed.variable} ${robotoMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
