import { useInView } from '../../hooks/useInView';
import { cn } from '../../utils/cn';

export function About() {
  const { ref, isInView } = useInView<HTMLDivElement>();

  return (
    <section id="sobre-mi" className="section-padding relative">
      <div className="container">
        <div
          ref={ref}
          className={cn('reveal max-w-4xl mx-auto', isInView && 'is-visible')}
        >
          <h2 className="font-display text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4 text-center">
            Sobre Mí
          </h2>

          <div className="space-y-4 sm:space-y-6 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed">
            <p>
              Soy{' '}
              <span className="text-foreground font-medium">Diseñador Senior UX</span>,
              especializado en liderar el diseño y rediseño de aplicaciones móviles y web.
              Coordino equipos multidisciplinarios y traduzco requerimientos de negocio en
              soluciones UX/UI escalables, con resultados medibles.
            </p>

            <p>
              Mi formación combina{' '}
              <span className="text-gradient-accent font-medium">arte contemporáneo</span> (Escuela
              Nacional de Pintura Escultura y Grabado &quot;La Esmeralda&quot; y École nationale
              supérieure des beaux-arts de Lyon) con desarrollo técnico. Esta base dual me
              permite abordar los proyectos desde perspectivas únicas, conectando la
              sensibilidad estética con la solidez funcional.
            </p>

            <p>
              He trabajado en proyectos diversos de inventarios, logística, educación,
              facturación, media y productividad. Desarrollo funcionalidades clave como{' '}
              <span className="text-foreground">
                dashboards, filtros avanzados, prototipos interactivos y rediseños
                estratégicos
              </span>
              .
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
