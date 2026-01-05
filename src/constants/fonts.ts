import { Space_Grotesk, Inter } from 'next/font/google';

export const spaceGrotesk = Space_Grotesk({
  variable: '--font-space-grotesk',
  weight: ['300', '400', '500', '600', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const inter = Inter({
  variable: '--font-inter',
  weight: ['300', '400', '500', '600'],
  subsets: ['latin'],
  display: 'swap',
});
