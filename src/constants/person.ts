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
    title: 'Diseñador de producto senior y tech lead · Especialista en React Native',
    description:
        'Arquitecto de experiencias digitales y tech lead. Especialista en cerrar la brecha entre diseño y código mediante sistemas de diseño escalables, arquitectura frontend y desarrollo móvil con React Native.',
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
        title: 'Diseño de producto',
        color: 'rgb-blue',
        gradient: 'from-rgb-blue to-primary',
        skills: [
            'Sistemas de diseño y operación',
            'Estrategia e investigación UX',
            'Arquitectura de información',
            'Prototipado de alta fidelidad',
            'Accesibilidad (WCAG 2.1)',
            'Flujos y recorridos de usuario',
            'Figma (variables y prototipado avanzado)',
            'Design tokens',
            'Adobe XD',
            'Adobe Creative Cloud',
            'Diseño de interfaz y visual',
            'Modelado 3D y render',
            'Dirección de arte digital',
            'Diseño editorial',
            'Tipografía avanzada',
        ],
    },
    {
        title: 'Ingeniería',
        color: 'rgb-green',
        gradient: 'from-rgb-green to-accent',
        skills: [
            'React Native (CLI y Expo)',
            'React.js',
            'TypeScript',
            'Next.js',
            'Arquitectura frontend',
            'Node.js',
            'Express.js',
            'Java',
            'Spring Framework',
            'Python',
            'SQL (PostgreSQL)',
            'NoSQL (Firebase/Mongo)',
            'CI/CD (GitHub Actions)',
            'Testing (Jest)',
            'Revisión de código y mentoría',
            'Optimización de rendimiento',
            'Tailwind CSS',
            'Material UI / Gluestack',
            'Styled Components',
        ],
    },
    {
        title: 'Tecnología creativa',
        color: 'rgb-red',
        gradient: 'from-rgb-red to-destructive',
        skills: [
            'Arte generativo y herramientas de IA',
            'Visión por computadora (básico)',
            'React Three Fiber (R3F)',
            'WebGL / Shaders',
            'Instalaciones interactivas',
            'Physical computing',
            'Escultura digital',
            'Investigación experimental',
        ],
    },
];

export const services: Service[] = [
    {
        title: 'Arquitectura y desarrollo',
        description:
            'Liderazgo técnico en desarrollo móvil y web. Especialista en React Native, migración de legado y arquitecturas escalables.',
        items: ['React Native', 'Arquitectura frontend', 'Refactorización de código', 'Rendimiento'],
        icon: 'code',
        highlight: true,
    },
    {
        title: 'Sistemas de diseño y operación',
        description:
            'Creación y mantenimiento de sistemas de diseño que conectan Figma con código, mejorando la velocidad y consistencia del equipo.',
        items: ['Design tokens', 'Bibliotecas de componentes', 'Documentación', 'Gobernanza'],
        icon: 'design',
    },
    {
        title: 'Tecnología creativa',
        description:
            'Desarrollo de prototipos experimentales, instalaciones de arte digital e integración de IA/ML en interfaces visuales.',
        items: ['Experiencias web 3D', 'Integración de IA', 'Arte interactivo'],
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
    { name: 'React Native', category: 'Desarrollo' },
    { name: 'TypeScript', category: 'Desarrollo' },
    { name: 'Arquitectura', category: 'Desarrollo' },
    { name: 'Python', category: 'Desarrollo' },
    { name: 'Sistemas de diseño', category: 'Diseño' },
    { name: 'Figma', category: 'Diseño' },
    { name: 'IA generativa', category: 'Creativo' },
    { name: 'Three.js', category: 'Creativo' },
];