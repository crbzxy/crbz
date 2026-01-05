'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { Mail, ArrowUpRight } from 'lucide-react';
import { person, socialLinks } from '@/src/constants/person';
import { getSocialIcon } from '@/src/utils/socialIcons';

export function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="contacto" className="section-padding relative" ref={ref}>
      <div className="container">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="font-display text-sm font-medium text-primary uppercase tracking-widest mb-4">
              Contacto
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6 text-foreground">
              ¿Interesado en colaborar?
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12">
              Escríbeme para discutir tu proyecto.
            </p>
          </motion.div>

          <motion.a
            href={`mailto:${person.email}`}
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full bg-primary text-primary-foreground font-display font-semibold text-base sm:text-lg transition-all hover:scale-105 hover:shadow-xl hover:shadow-primary/25"
          >
            <Mail className="w-5 h-5" />
            Enviar Email
            <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </motion.a>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mt-16"
          >
            <p className="text-sm text-muted-foreground mb-6">
              Sígueme en redes
            </p>
            <div className="flex items-center justify-center gap-4">
              {socialLinks.map((link) => {
                const Icon = getSocialIcon(link.icon);
                return (
                  <a
                    key={link.platform}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`p-3 sm:p-4 rounded-full glass text-muted-foreground transition-all hover:scale-110 ${link.hoverColor || ''}`}
                    aria-label={link.label}
                  >
                    <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                  </a>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Background gradient */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-96 bg-gradient-to-t from-rgb-blue/10 via-transparent to-transparent blur-3xl" />
      </div>
    </section>
  );
}
