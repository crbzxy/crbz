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
  hoverColor?: string; // color de hover para el componente
}

export interface Skill {
  name: string;
  category?: string;
}

export interface SkillCategory {
  title: string;
  color: 'rgb-blue' | 'rgb-green' | 'rgb-red';
  gradient: string;
  skills: string[];
}

export interface Service {
  title: string;
  description: string;
  items: string[];
  icon: 'design' | 'code' | 'creative';
  highlight?: boolean;
}

export interface NavLink {
  href: string;
  label: string;
}

export interface Route {
  name: string;
  href: string;
}

