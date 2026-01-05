import type { Metadata } from 'next';
import { spaceGrotesk, inter } from '@/src/constants/fonts';
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
    <html lang="es" className="dark">
      <body
        className={`${spaceGrotesk.variable} ${inter.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
