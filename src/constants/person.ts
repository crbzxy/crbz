import type { Person, SocialLink, Skill } from '@/src/types';

export const person: Person = {
    name: 'Carlos Boyzo',
    title: 'UX Engineer / Frontend Developer',
    description:
        'UX Engineer y Frontend Developer con más de 16 años de experiencia. Complemento mi perfil técnico con práctica artística y exploración 3D aplicada a experiencias digitales.',
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

    // Frontend
    { name: 'React', category: 'Development' },
    { name: 'Next.js', category: 'Development' },
    { name: 'TypeScript', category: 'Development' },
    { name: 'JavaScript', category: 'Development' },
    { name: 'Tailwind CSS', category: 'Development' },

    // Creativo / Arte
    { name: 'Arte contemporáneo', category: 'Creative' },
    { name: 'Exploración 3D', category: 'Creative' },
    { name: 'Escultura y objetos', category: 'Creative' },
    { name: 'Prototipos físicos y digitales', category: 'Creative' },
    { name: 'Experimentación creativa aplicada a tecnología', category: 'Creative' },
];
