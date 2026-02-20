import type { CVExperience } from '@/src/types';
import { person } from '@/src/constants/person';

export const cvContact = {
  fullName: 'Carlos Armando Boyzo Oregon',
  title: 'Ingeniero UX · Desarrollador frontend (React y TypeScript)',
  location: 'CDMX',
  email: person.email,
  phone: '+52 55 3888 0315',
  website: 'carlosboyzo.com',
};

export const cvSummary = `Ingeniero UX con más de 4 años de experiencia en diseño e implementación de plataformas digitales escalables. Experiencia en sistemas móviles internos (aprox. 1,500 usuarios en React Native) y plataformas web de cara al público (aprox. 4,000 usuarios mensuales). Especializado en vincular la estrategia de UX con la arquitectura frontend, traduciendo sistemas de diseño en componentes reutilizables, accesibles y de alto rendimiento con React y TypeScript. En paralelo, desarrollo proyectos personales con modelos para generación de imágenes 3D.`;

export const cvSkills = [
  'Sistemas de diseño',
  'React + TypeScript',
  'Accesibilidad (WCAG)',
  'React Native',
  'Figma',
  'Investigación de usuarios',
  'Prototipado',
  'Storybook',
  'Tailwind CSS',
  'Git',
  'Metodologías ágiles (Scrum)',
  'CI/CD',
];

export const cvExperience: CVExperience[] = [
  {
    company: 'TRUPER',
    role: 'Diseñador UX senior / Desarrollador frontend',
    period: '2023 – Actualidad',
    bullets: [
      'Arquitectura de UI escalable en React y TypeScript para productos internos y públicos (~1,500 usuarios móvil, ~4,000 web/mes).',
      'Liderazgo de rediseños UX de punta a punta: análisis, propuesta e implementación de mejoras de rendimiento y usabilidad.',
      'Optimización de flujos de desarrollo y experiencia de usuario en aplicaciones móviles (React Native).',
      'Desarrollo de pruebas de concepto en Java llevadas a producción para flujos críticos del negocio.',
      'Colaboración con backend y producto para entregar frontend escalable y mantenible.',
    ],
  },
  {
    company: 'PHINDER – TOTALPLAY',
    role: 'Desarrollador UX',
    period: '2022 – 2023',
    bullets: [
      'Diseñé las bases de UX e implementé interfaces listas para producción.',
      'Traduje prototipos en implementaciones frontend escalables.',
      'Documenté procesos de UX y desarrollo para mejorar la eficiencia del equipo.',
    ],
  },
  {
    company: 'GO-PHARMA',
    role: 'Gerente digital',
    period: '2021 – 2022',
    bullets: [
      'Lideré iniciativas de producto digital e implementación frontend.',
      'Desarrollé módulos de lógica de negocio a medida en JavaScript.',
      'Optimicé flujos de usuario digitales y el desempeño de campañas.',
    ],
  },
];

export const cvEducation = {
  degree: 'Licenciatura en Artes Visuales – Medios digitales',
  institution: 'INBA – Escuela Nacional de Pintura, Escultura y Grabado (ENPEG), México',
};

export const cvCertifications = [
  'Fundamentos de arquitectura de software (2026)',
  'React.js y React con TypeScript',
  'Sistemas UX y accesibilidad',
  'Estrategia de IA generativa para equipos de producto',
  'Ciencia de datos para análisis de negocio',
];
