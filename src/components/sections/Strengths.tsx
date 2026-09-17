import { strengths } from '../../content/person';
import { useInView } from '../../hooks/useInView';
import { cn } from '../../utils/cn';
import type { Strength } from '../../content/types';

const dotColor: Record<Strength['color'], string> = {
  'rgb-blue': 'hsl(var(--rgb-blue))',
  'rgb-green': 'hsl(var(--rgb-green))',
  'rgb-red': 'hsl(var(--rgb-red))',
};

export function Strengths() {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <section id="fortalezas" className="section-padding relative">
      <div className="container">
        <div
          ref={ref}
          className={cn('reveal max-w-2xl mx-auto text-center', isInView && 'is-visible')}
        >
          <h2 className="font-display text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
            Fortalezas
          </h2>
          <p className="text-3xl md:text-4xl font-display font-bold text-foreground mb-16 md:mb-20">
            Diseño ↔ Código ↔ Arte
          </p>

          <div className="space-y-10 md:space-y-14">
            {strengths.map((strength, index) => (
              <p
                key={strength.title}
                className={cn(
                  'reveal flex items-center justify-center gap-3 text-xl sm:text-2xl md:text-3xl font-display text-foreground',
                  isInView && 'is-visible',
                )}
                style={{ transitionDelay: `${200 + index * 200}ms` }}
              >
                <span
                  className="w-2.5 h-2.5 rounded-full animate-pulse flex-shrink-0"
                  style={{ backgroundColor: dotColor[strength.color] }}
                />
                {strength.phrase}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
