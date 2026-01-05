'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

export function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="sobre-mi" className="section-padding relative" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto"
        >
          <h2 className="font-display text-sm font-medium text-primary uppercase tracking-widest mb-4 text-center">
            Sobre Mí
          </h2>

          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            <p>
              Actualmente trabajo como{' '}
              <span className="text-foreground font-medium">
                Diseñador SR UX en Grupo Truper
              </span>
              , donde lidero el diseño y rediseño de aplicaciones móviles y web.
              Coordino equipos multidisciplinarios y traduzco requerimientos de
              negocio en soluciones UX/UI escalables con resultados medibles.
            </p>

            <p>
              Mi formación combina{' '}
              <span className="text-gradient-accent font-medium">
                arte contemporáneo
              </span>{' '}
              (Escuela Nacional de Pintura Escultura y Grabado &quot;La Esmeralda&quot; y
              École nationale supérieure des beaux-arts de Lyon) con desarrollo
              técnico. Esta base dual me permite abordar proyectos desde
              perspectivas únicas.
            </p>

            <p>
              He trabajado en proyectos diversos: inventarios, logística,
              educación, facturación, media y productividad. Desarrollo
              funcionalidades clave como{' '}
              <span className="text-foreground">
                dashboards, filtros avanzados, prototipos interactivos y
                rediseños estratégicos
              </span>
              .
            </p>
          </div>
        </motion.div>
      </div>

      {/* Decorative elements */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-2/3 bg-gradient-to-l from-rgb-blue/5 to-transparent pointer-events-none" />
    </section>
  );
}
