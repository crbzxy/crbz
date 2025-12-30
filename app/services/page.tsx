import { PageLayout } from '@/src/components/templates/PageLayout';
import { Section } from '@/src/components/molecules/Section';
import { Text } from '@/src/components/atoms/Text';
import { Badge } from '@/src/components/atoms/Badge';
import { Icon } from '@/src/components/atoms/Icon';
import { person } from '@/src/constants/person';

interface Service {
  id: string;
  title: string;
  description: string;
  icon: 'design' | 'code' | 'creative' | 'coaching';
  features: string[];
  highlight?: boolean;
}

const services: Service[] = [
  {
    id: '1',
    title: 'Diseño UX Estratégico',
    description:
      'Creación de experiencias digitales centradas en el usuario que resuelven problemas reales y generan valor medible para el negocio.',
    icon: 'design',
    highlight: true,
    features: [
      'Investigación de usuarios y análisis de necesidades',
      'Diseño de interfaces y prototipado interactivo',
      'Creación de sistemas de diseño escalables',
      'Pruebas de usabilidad y optimización continua',
      'Arquitectura de información y flujos de usuario',
    ],
  },
  {
    id: '2',
    title: 'Desarrollo Frontend',
    description:
      'Desarrollo de interfaces y aplicaciones web modernas con las tecnologías más actuales, código limpio y arquitectura escalable.',
    icon: 'code',
    features: [
      'React, Next.js y TypeScript',
      'Optimización de rendimiento y SEO',
      'Arquitectura escalable y mantenible',
      'Integración con APIs y servicios',
      'Testing y calidad de código',
    ],
  },
  {
    id: '3',
    title: 'Proyectos Creativos Digitales',
    description:
      'Exploración de la intersección entre arte, tecnología y experiencia digital, aplicando práctica artística a proyectos tecnológicos.',
    icon: 'creative',
    features: [
      'Exploración 3D aplicada a interfaces',
      'Prototipos físicos y digitales',
      'Experimentación creativa aplicada a tecnología',
      'Instalaciones interactivas',
      'Arte generativo y visualización de datos',
    ],
  },
  {
    id: '4',
    title: 'Consultoría y Coaching',
    description:
      'Capacitación especializada para equipos y profesionales que quieren mejorar sus habilidades en diseño UX y desarrollo frontend.',
    icon: 'coaching',
    features: [
      'Coaching 1 a 1 en UX Design',
      'Workshops de React y JavaScript',
      'Capacitación en Design Systems',
      'Programas personalizados para equipos',
      'Mentoría en desarrollo de carrera',
    ],
  },
];

const iconMap = {
  design: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="3" y="4" width="18" height="12" rx="1" />
      <line x1="7" y1="8" x2="17" y2="8" />
      <line x1="7" y1="12" x2="13" y2="12" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <polyline points="16,18 22,12 16,6" />
      <polyline points="8,6 2,12 8,18" />
    </svg>
  ),
  creative: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  coaching: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  ),
};

export default function ServicesPage() {
  return (
    <PageLayout>
      <div className="min-h-screen bg-gradient-to-b from-white via-gray-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Hero Section - Más compacto */}
          <div className="text-center mb-12">
            <Badge className="mb-4">Servicios</Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">
              Soluciones Digitales
              <br />
              <span className="text-blue-600 dark:text-blue-400">Completas</span>
            </h1>
            <Text variant="lead" className="max-w-3xl mx-auto">
              Combinando diseño UX estratégico, desarrollo frontend de alta calidad y
              exploración creativa para crear experiencias digitales que generan resultados.
            </Text>
          </div>

          {/* Services Grid - Más compacto */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {services.map((service) => (
              <div
                key={service.id}
                className={`group relative bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 ${
                  service.highlight
                    ? 'md:col-span-2 border-2 border-blue-500 dark:border-blue-400'
                    : 'border border-gray-200 dark:border-gray-700'
                }`}
              >
                <div className="flex gap-6">
                  {/* Icon */}
                  <div
                    className={`flex-shrink-0 inline-flex items-center justify-center w-14 h-14 rounded-lg ${
                      service.highlight
                        ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400'
                        : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <div className="w-7 h-7">{iconMap[service.icon]}</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                        {service.title}
                      </h2>
                      {service.highlight && (
                        <Badge className="text-xs">Destacado</Badge>
                      )}
                    </div>

                    <Text className="mb-4 text-sm text-gray-600 dark:text-gray-300">
                      {service.description}
                    </Text>

                    {/* Features - Más compacto */}
                    <ul className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start text-sm">
                          <div className="flex-shrink-0 mt-1">
                            <svg
                              className="w-4 h-4 text-blue-500 dark:text-blue-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          </div>
                          <span className="ml-2 text-gray-700 dark:text-gray-300">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA Section - Más compacto */}
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-700 dark:to-indigo-700 rounded-xl p-8 text-center text-white shadow-xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              ¿Listo para comenzar tu proyecto?
            </h2>
            <Text className="mb-6 text-blue-100 max-w-2xl mx-auto text-sm">
              Trabajemos juntos para crear una experiencia digital que destaque y genere
              resultados medibles.
            </Text>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <a
                href={`mailto:${person.email}?subject=Consulta de Servicios`}
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-blue-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg text-sm"
              >
                <Icon name="email" size={18} className="mr-2" />
                Contactar
              </a>
              <a
                href="/"
                className="inline-flex items-center justify-center px-6 py-3 bg-blue-500/20 text-white border-2 border-white/30 rounded-lg font-semibold hover:bg-blue-500/30 transition-colors duration-300 text-sm"
              >
                Ver más sobre mí
              </a>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}
