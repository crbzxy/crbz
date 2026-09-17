import { ArrowDown } from 'lucide-react';
import { person, socialLinks } from '../../content/person';
import { LinkedinIcon } from '../icons/BrandIcons';
import { cn } from '../../utils/cn';

type HeroProps = {
  sceneEnabled: boolean;
};

export function Hero({ sceneEnabled }: HeroProps) {
  const linkedin = socialLinks.find((link) => link.platform === 'LinkedIn');

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="container relative z-10 px-4 sm:px-6">
        <div
          className={cn(
            'flex flex-col md:flex-row md:items-center gap-10 md:gap-12 pt-20 md:pt-0',
            !sceneEnabled && 'md:justify-between',
          )}
        >
          <div className="max-w-2xl shrink-0">
            <h1
              className="animate-fade-up font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 sm:mb-6 text-foreground"
              style={{ animationDelay: '0ms' }}
            >
              Carlos Armando
              <br />
              Boyzo
            </h1>

            <h2
              className="animate-fade-up text-lg sm:text-xl md:text-2xl font-display font-medium text-gradient-primary mb-6 sm:mb-8"
              style={{ animationDelay: '150ms' }}
            >
              {person.title}
            </h2>

            <p
              className="animate-fade-up text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed max-w-xl"
              style={{ animationDelay: '300ms' }}
            >
              {person.description}
            </p>

            <div
              className="animate-fade-up mt-8 md:mt-12 flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4"
              style={{ animationDelay: '450ms' }}
            >
              {linkedin && (
                <a
                  href={linkedin.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full bg-primary text-primary-foreground border border-border font-medium text-sm sm:text-base transition-all hover:scale-105 hover:bg-foreground hover:text-background"
                >
                  <LinkedinIcon className="w-4 h-4" />
                  Ver LinkedIn
                </a>
              )}
              <a
                href="#sobre-mi"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full glass font-medium text-sm sm:text-base transition-all hover:bg-card hover:scale-105"
              >
                Conoce más
                <ArrowDown className="w-4 h-4" />
              </a>
              <a
                href="#contacto"
                className="inline-flex items-center justify-center gap-2 px-6 sm:px-8 py-3 sm:py-4 rounded-full glass font-medium text-sm sm:text-base transition-all hover:bg-card hover:scale-105"
              >
                Contáctame
              </a>
            </div>
          </div>

          {!sceneEnabled && (
            <div
              className="hero-figure animate-fade-up flex justify-center md:justify-end w-full md:w-auto"
              style={{ animationDelay: '300ms' }}
              aria-hidden="true"
            >
              <img
                src="/textures/hero-image.png"
                alt=""
                className="hero-figure__image"
              />
            </div>
          )}
        </div>
      </div>

      <div className="hidden sm:block absolute bottom-8 md:bottom-12 left-1/2 -translate-x-1/2 animate-bounce z-10">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1.5 h-1.5 rounded-full bg-muted-foreground" />
        </div>
      </div>
    </section>
  );
}
