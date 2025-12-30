import type { Person, SocialLink, Skill } from '@/src/types';

export const person: Person = {
    name: 'Carlos Armando Boyzo',
    title: 'Diseñador SR UX | Desarrollador Web | Artista Digital',
    description:
        'Diseñador SR UX en Grupo Truper. Especializado en React Native, React y TypeScript. Combino diseño estratégico, desarrollo técnico y exploración creativa para crear experiencias digitales innovadoras.',
    email: 'carlos.boor@gmail.com',
    experience: 16,
};

export const socialLinks: SocialLink[] = [
    {
        platform: 'LinkedIn',
        url: 'https://www.linkedin.com/in/carlosboyzo',
        icon: 'linkedin',
        label: 'LinkedIn',
    },
    {
        platform: 'GitHub',
        url: 'https://github.com/crbzxy',
        icon: 'github',
        label: 'GitHub',
    },
    {
        platform: 'Instagram',
        url: 'https://www.instagram.com/perrodimensional',
        icon: 'instagram',
        label: 'Instagram',
    },
];

export const skills: Skill[] = [
    // UX / Design
    { name: 'UX Design', category: 'Design' },
    { name: 'UI Design', category: 'Design' },
    { name: 'User Research', category: 'Design' },
    { name: 'Figma', category: 'Design' },
    { name: 'Design Systems', category: 'Design' },
    { name: 'Prototipado', category: 'Design' },
    { name: 'Arquitectura de Información', category: 'Design' },
    { name: 'Design Thinking', category: 'Design' },

    // Frontend / Development
    { name: 'React', category: 'Development' },
    { name: 'React Native', category: 'Development' },
    { name: 'Next.js', category: 'Development' },
    { name: 'TypeScript', category: 'Development' },
    { name: 'JavaScript', category: 'Development' },
    { name: 'Tailwind CSS', category: 'Development' },
    { name: 'HTML/CSS', category: 'Development' },
    { name: 'Arquitectura de sistemas', category: 'Development' },
    { name: 'Python', category: 'Development' },
    { name: 'Redux.js', category: 'Development' },
    { name: 'Git', category: 'Development' },

    // Creativo / Arte
    { name: 'Arte contemporáneo', category: 'Creative' },
    { name: 'Exploración 3D', category: 'Creative' },
    { name: 'Escultura y objetos', category: 'Creative' },
    { name: 'Prototipos físicos y digitales', category: 'Creative' },
    { name: 'Arte digital', category: 'Creative' },
    { name: 'A-Frame / WebVR', category: 'Creative' },
    { name: 'R3F (React Three Fiber)', category: 'Creative' },
];
