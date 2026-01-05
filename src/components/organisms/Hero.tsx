'use client';

import { motion } from 'framer-motion';
import { ArrowDown } from 'lucide-react';
import { person } from '@/src/constants/person';
import { FloatingShapes } from './FloatingShapes';

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <FloatingShapes />

      <div className="container relative z-10 px-4 sm:px-6">
        <div className="max-w-2xl pt-20 md:pt-0">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-bold leading-tight mb-4 sm:mb-6 text-foreground">
              Carlos Armando
              <br />
              Boyzo
            </h1>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg sm:text-xl md:text-2xl font-display font-medium text-gradient-primary mb-6 sm:mb-8"
          >
            {person.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl"
          >
            {person.description}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-8 md:mt-12 flex flex-col sm:flex-row gap-3 sm:gap-4"
          >
            <a
              href="#sobre-mi"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-primary text-primary-foreground font-medium text-sm sm:text-base transition-all hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector('#sobre-mi');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Conoce más
              <ArrowDown className="w-4 h-4" />
            </a>
            <a
              href="#contacto"
              className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full glass font-medium text-sm sm:text-base transition-all hover:bg-card hover:scale-105"
              onClick={(e) => {
                e.preventDefault();
                const element = document.querySelector('#contacto');
                if (element) {
                  element.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
              }}
            >
              Contáctame
            </a>
          </motion.div>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="hidden sm:block absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <motion.div
            className="w-1.5 h-1.5 rounded-full bg-muted-foreground"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
