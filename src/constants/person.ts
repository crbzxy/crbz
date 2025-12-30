import type { Person, SocialLink, Skill } from '@/src/types';

export const person: Person = {
    name: 'Carlos Armando Boyzo',
    title: 'Senior UX Designer | Full Stack Developer | Artista Digital',
    description:
        'Transformo requerimientos complejos en experiencias digitales escalables. Especialista en el ecosistema React, React Native y Arquitectura de Información.',
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
    { name: 'Figma', category: 'Design' },
    { name: 'UX Research', category: 'Design' },
    { name: 'Prototipado', category: 'Design' },

    // Frontend / Development
    { name: 'React', category: 'Development' },
    { name: 'React Native', category: 'Development' },
    { name: 'TypeScript', category: 'Development' },
    { name: 'Python', category: 'Development' },
    { name: 'Tailwind', category: 'Development' },

    // Creativo / Arte
    { name: 'R3F (Three Fiber)', category: 'Creative' },
    { name: 'A-Frame', category: 'Creative' },
    { name: 'Escultura Digital', category: 'Creative' },
];
