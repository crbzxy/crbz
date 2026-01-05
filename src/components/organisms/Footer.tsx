'use client';

import { motion } from 'framer-motion';
import { person } from '@/src/constants/person';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 border-t border-border">
      <div className="container">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-sm text-muted-foreground"
          >
            © {currentYear} {person.name}. Todos los derechos reservados.
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-sm text-muted-foreground"
          >
            Hecho a pulso, contra la noche
          </motion.p>
        </div>
      </div>
    </footer>
  );
}
