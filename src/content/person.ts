import type { NavLink, Person, SocialLink, Strength } from './types';

export const person: Person = {
  name: 'Carlos Armando Boyzo',
  title: 'Tech lead y diseñador de producto · Especialista en React Native',
  description:
    'Construyo el puente entre diseño y código: sistemas de diseño escalables, arquitectura frontend y desarrollo móvil con React Native. Lidero equipos y producto de punta a punta, desde la decisión de UX hasta el deploy.',
  email: 'carlos.boor@gmail.com',
  experience: 16,
};

export const socialLinks: SocialLink[] = [
  {
    platform: 'LinkedIn',
    url: 'https://www.linkedin.com/in/carlosboyzo',
    icon: 'linkedin',
    label: 'LinkedIn',
    hoverColor: 'hover:text-rgb-blue',
  },
  {
    platform: 'GitHub',
    url: 'https://github.com/crbzxy',
    icon: 'github',
    label: 'GitHub',
    hoverColor: 'hover:text-foreground',
  },
  {
    platform: 'Instagram',
    url: 'https://www.instagram.com/perrodimensional',
    icon: 'instagram',
    label: 'Instagram',
    hoverColor: 'hover:text-rgb-red',
  },
];

export const strengths: Strength[] = [
  {
    title: 'Diseño de producto',
    color: 'rgb-blue',
    phrase: 'Diseño sistemas, no pantallas.',
  },
  {
    title: 'Ingeniería',
    color: 'rgb-green',
    phrase: 'Código que escala, no que se acumula.',
  },
  {
    title: 'Tecnología creativa',
    color: 'rgb-red',
    phrase: 'Arte que responde, no que decora.',
  },
];

export const navLinks: NavLink[] = [
  { href: '#sobre-mi', label: 'Sobre Mí' },
  { href: '#fortalezas', label: 'Fortalezas' },
  { href: '#contacto', label: 'Contacto' },
];
