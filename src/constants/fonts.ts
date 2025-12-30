import { Roboto_Condensed, Roboto_Mono } from 'next/font/google';

export const robotoCondensed = Roboto_Condensed({
  variable: '--font-roboto-condensed',
  weight: ['300', '400', '700'],
  subsets: ['latin'],
  display: 'swap',
});

export const robotoMono = Roboto_Mono({
  variable: '--font-roboto-mono',
  subsets: ['latin'],
  display: 'swap',
});

