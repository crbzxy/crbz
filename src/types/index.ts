// Tipos compartidos para la aplicación

export interface Person {
  name: string;
  title: string;
  description: string;
  email: string;
  experience: number; // años de experiencia
}

export interface SocialLink {
  platform: string;
  url: string;
  icon: string;
  label: string; // para accesibilidad
}

export interface Skill {
  name: string;
  category?: string;
}

export interface Route {
  name: string;
  href: string;
}

