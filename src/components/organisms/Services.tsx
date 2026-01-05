'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Badge } from '@/src/components/atoms/Badge';
import { Check } from 'lucide-react';
import { services } from '@/src/constants/person';

export function Services() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="servicios" className="section-padding relative">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-sm font-medium text-primary uppercase tracking-widest mb-4">
            Servicios
          </h2>
          <p className="text-3xl md:text-4xl font-display font-bold max-w-2xl mx-auto text-foreground">
            Soluciones integrales para tu proyecto
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-6xl mx-auto" ref={ref}>
          {services.map((service, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className={`group relative glass rounded-xl md:rounded-2xl p-4 sm:p-6 transition-all duration-300 hover:bg-card/80 hover:scale-[1.02] ${
                service.highlight ? 'md:col-span-2 border-2 border-primary' : ''
              }`}
            >
              <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                {/* Icon */}
                <div
                  className={`flex-shrink-0 inline-flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-lg ${
                    service.highlight
                      ? 'bg-primary/20 text-primary'
                      : 'bg-secondary text-secondary-foreground'
                  }`}
                >
                  <div className="w-6 h-6 sm:w-7 sm:h-7">
                    {service.icon === 'design' && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <rect x="3" y="4" width="18" height="12" rx="1" />
                        <line x1="7" y1="8" x2="17" y2="8" />
                        <line x1="7" y1="12" x2="13" y2="12" />
                      </svg>
                    )}
                    {service.icon === 'code' && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <polyline points="16,18 22,12 16,6" />
                        <polyline points="8,6 2,12 8,18" />
                      </svg>
                    )}
                    {service.icon === 'creative' && (
                      <svg
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
                      </svg>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <h3 className="text-lg sm:text-xl md:text-2xl font-display font-bold tracking-tight">
                      {service.title}
                    </h3>
                    {service.highlight && (
                      <Badge className="text-xs">Destacado</Badge>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">
                    {service.description}
                  </p>

                  {/* Features */}
                  <ul className="space-y-2">
                    {service.items.map((item, idx) => (
                      <li key={idx} className="flex items-start text-sm">
                        <div className="flex-shrink-0 mt-1">
                          <Check className="w-4 h-4 text-primary" />
                        </div>
                        <span className="ml-2 text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
