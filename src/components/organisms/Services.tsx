import { Section } from '@/src/components/molecules/Section';
import { Badge } from '@/src/components/atoms/Badge';

interface Service {
  title: string;
  description: string;
  items: string[];
  icon: 'design' | 'code' | 'creative';
  highlight?: boolean;
}

const services: Service[] = [
  {
    title: 'UX/UI Strategy',
    description:
      'Auditoría de experiencias, creación de Design Systems y User Research para optimizar la interacción usuario-producto.',
    items: ['Auditoría', 'Design Systems', 'User Research'],
    icon: 'design',
    highlight: true,
  },
  {
    title: 'Full Stack Development',
    description:
      'Desarrollo de aplicaciones escalables con React, React Native y Next.js, implementando arquitecturas robustas y mantenibles.',
    items: ['React', 'Native', 'Next.js', 'Arquitectura escalable'],
    icon: 'code',
  },
  {
    title: 'Creative Tech',
    description:
      'Exploración de experiencias 3D, WebVR y arte digital aplicado a interfaces innovadoras y proyectos experimentales.',
    items: ['Experiencias 3D', 'WebVR', 'Arte Digital'],
    icon: 'creative',
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
};

export function Services() {
  return (
    <Section id="servicios" title="Servicios" className="py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {services.map((service, index) => (
          <div
            key={index}
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
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white tracking-tight">
                    {service.title}
                  </h3>
                  {service.highlight && (
                    <Badge className="text-xs">Destacado</Badge>
                  )}
                </div>

                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  {service.description}
                </p>

                {/* Features */}
                <ul className="space-y-2">
                  {service.items.map((item, idx) => (
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
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
