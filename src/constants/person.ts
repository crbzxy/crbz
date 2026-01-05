import type {
    Person,
    SocialLink,
    Skill,
    SkillCategory,
    Service,
    NavLink,
} from '@/src/types';

export const person: Person = {
    name: 'Carlos Armando Boyzo',
    // Título optimizado para SEO: combina el rol oficial con la especialidad técnica
    title: 'Senior Product Designer & Tech Lead | React Native Specialist',
    description:
        'Arquitecto de experiencias digitales y Tech Lead. Especialista en cerrar la brecha entre diseño y código mediante Design Systems escalables, arquitectura Frontend y desarrollo móvil con React Native.',
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

export const skillCategories: SkillCategory[] = [
    {
        title: 'Product Design', // Renombrado para sonar más actual/senior
        color: 'rgb-blue',
        gradient: 'from-rgb-blue to-primary',
        skills: [
            // Estrategia y Sistemas (Lo más buscado para Senior/Lead)
            'Design Systems & Ops',
            'UX Strategy & Research',
            'Arquitectura de Información',
            'Prototipado de Alta Fidelidad',
            'Accesibilidad (WCAG 2.1)',
            'User Flows & Journeys',

            // Herramientas & Técnico
            'Figma (Variables & Adv. Prototyping)',
            'Design Tokens',
            'Adobe XD',
            'Adobe Creative Cloud Apps',


            // Visual & 3D (Diferenciadores)
            'UI & Visual Design',
            'Modelado 3D & Render',
            'Dirección de Arte Digital',
            'Diseño Editorial',
            'Tipografía Avanzada',
        ],

    },
    {
        title: 'Engineering', // Renombrado de "Desarrollo" a "Ingeniería"
        color: 'rgb-green',
        gradient: 'from-rgb-green to-accent',
        skills: [
            // Core Stack (Tu fuerte)
            'React Native (CLI & Expo)',
            'React.js',
            'TypeScript',
            'Next.js',
            'Arquitectura Frontend',

            // Lenguajes & Backend (Expandido por tu rol multidisciplinary)
            'Node.js',
            'Express.js',
            'Java',
            'Spring Framework',
            'Python', // Agregado por tu interés y uso en herramientas
            'SQL (PostgreSQL)',
            'NoSQL (Firebase/Mongo)',

            // Calidad & Procesos (Clave para Tech Lead)
            'CI/CD (GitHub Actions)',
            'Testing (Jest)',
            'Code Review & Mentoring',
            'Optimización de Performance',

            // Styling & UI Code
            'Tailwind CSS',
            'Material UI / Gluestack',
            'Styled Components',
        ],
    },
    {
        title: 'Creative Tech',
        color: 'rgb-red',
        gradient: 'from-rgb-red to-destructive',
        skills: [
            // Fusión Arte/Tecnología
            'Arte Generativo & AI Tools',
            'Computer Vision (Básico)', // Por tu proyecto nopalDetector
            'React Three Fiber (R3F)',
            'WebGL / Shaders',
            'Instalaciones Interactivas',
            'Physical Computing',
            'Escultura Digital',
            'Investigación Experimental',
        ],
    },
];

export const services: Service[] = [
    {
        title: 'Architecture & Development',
        description:
            'Liderazgo técnico en desarrollo móvil y web. Especialista en React Native, migración de legado y arquitecturas escalables.',
        items: ['React Native', 'Frontend Architecture', 'Code Refactoring', 'Performance'],
        icon: 'code',
        highlight: true, // Cambié el highlight aquí por ser tu rol principal actual en Truper
    },
    {
        title: 'Design Systems & Ops',
        description:
            'Creación y mantenimiento de sistemas de diseño que conectan Figma con código, mejorando la velocidad y consistencia del equipo.',
        items: ['Design Tokens', 'Component Libraries', 'Documentation', 'Governance'],
        icon: 'design',
    },
    {
        title: 'Creative Technology',
        description:
            'Desarrollo de prototipos experimentales, instalaciones de arte digital e integración de IA/ML en interfaces visuales.',
        items: ['3D Web Experiences', 'AI Integration', 'Interactive Art'],
        icon: 'creative',
    },
];

export const navLinks: NavLink[] = [
    { href: '#sobre-mi', label: 'Sobre Mí' },
    { href: '#habilidades', label: 'Habilidades' },
    { href: '#contacto', label: 'Contacto' },
];

// Skills planas para meta-tags o nubes de etiquetas
export const skills: Skill[] = [
    // Tech Lead / Dev
    { name: 'React Native', category: 'Development' },
    { name: 'TypeScript', category: 'Development' },
    { name: 'Architecture', category: 'Development' },
    { name: 'Python', category: 'Development' },

    // Design
    { name: 'Design Systems', category: 'Design' },
    { name: 'Figma', category: 'Design' },

    // Creative / Emerging
    { name: 'AI Generation', category: 'Creative' },
    { name: 'Three.js', category: 'Creative' },
];