'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { skillCategories } from '@/src/constants/person';
import type { SkillCategory } from '@/src/types';

const SkillCard = ({
  category,
  index,
}: {
  category: SkillCategory;
  index: number;
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className="group"
    >
      <div className="glass rounded-xl md:rounded-2xl p-4 sm:p-6 md:p-8 h-full transition-all duration-300 hover:bg-card/80 hover:scale-[1.02]">
        <div className="inline-flex items-center gap-2 mb-6">
          <div
            className="w-3 h-3 rounded-full"
            style={{
              backgroundColor:
                category.color === 'rgb-blue'
                  ? 'hsl(var(--rgb-blue))'
                  : category.color === 'rgb-green'
                    ? 'hsl(var(--rgb-green))'
                    : 'hsl(var(--rgb-red))',
            }}
          />
          <h3 className="font-display text-xl font-semibold">
            {category.title}
          </h3>
        </div>

        <div className="flex flex-wrap gap-2">
          {category.skills.map((skill, skillIndex) => (
            <motion.span
              key={skill}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{
                duration: 0.4,
                delay: index * 0.2 + skillIndex * 0.05,
              }}
              className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-secondary text-secondary-foreground text-xs sm:text-sm font-medium transition-colors hover:bg-muted"
            >
              {skill}
            </motion.span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export function Skills() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section id="habilidades" className="section-padding relative" ref={ref}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <h2 className="font-display text-sm font-medium text-primary uppercase tracking-widest mb-4">
            Habilidades
          </h2>
          <p className="text-3xl md:text-4xl font-display font-bold max-w-2xl mx-auto text-foreground">
            Combinando diseño, código y producción
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-6xl mx-auto">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
