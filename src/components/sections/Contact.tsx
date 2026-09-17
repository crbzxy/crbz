import { ArrowUpRight } from 'lucide-react';
import { socialLinks } from '../../content/person';
import { InstagramIcon } from '../icons/BrandIcons';
import { getSocialIcon } from '../../utils/socialIcons';
import { useInView } from '../../hooks/useInView';
import { cn } from '../../utils/cn';

export function Contact() {
  const { ref, isInView } = useInView<HTMLDivElement>();
  const instagram = socialLinks.find((link) => link.platform === 'Instagram');
  const otherSocials = socialLinks.filter((link) => link.platform !== 'Instagram');

  return (
    <section id="contacto" className="section-padding relative">
      <div className="container">
        <div ref={ref} className="max-w-4xl mx-auto text-center">
          <div className={cn('reveal', isInView && 'is-visible')}>
            <h2 className="font-display text-sm font-medium text-muted-foreground uppercase tracking-widest mb-4">
              Contacto
            </h2>
            <p className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-4 sm:mb-6 text-foreground">
              ¿Interesado en colaborar?
            </p>
            <p className="text-lg sm:text-xl text-muted-foreground mb-8 sm:mb-12">
              Solo me puedes contactar por Instagram.
            </p>
          </div>

          {instagram && (
            <div
              className={cn(
                'reveal flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4',
                isInView && 'is-visible',
              )}
              style={{ transitionDelay: '150ms' }}
            >
              <a
                href={instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 sm:gap-4 px-6 sm:px-8 md:px-10 py-3 sm:py-4 md:py-5 rounded-full bg-primary text-primary-foreground border border-border font-display font-semibold text-base sm:text-lg transition-all hover:scale-105 hover:bg-foreground hover:text-background"
              >
                <InstagramIcon className="w-5 h-5" />
                Escríbeme en Instagram
                <ArrowUpRight className="w-5 h-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
              </a>
            </div>
          )}

          {otherSocials.length > 0 && (
            <div
              className={cn('reveal mt-16', isInView && 'is-visible')}
              style={{ transitionDelay: '300ms' }}
            >
              <p className="text-sm text-muted-foreground mb-6">También estoy en</p>
              <div className="flex items-center justify-center gap-4">
                {otherSocials.map((link) => {
                  const Icon = getSocialIcon(link.icon);
                  return (
                    <a
                      key={link.platform}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'p-3 sm:p-4 rounded-full glass text-muted-foreground transition-all hover:scale-110',
                        link.hoverColor,
                      )}
                      aria-label={link.label}
                    >
                      <Icon className="w-5 h-5 sm:w-6 sm:h-6" />
                    </a>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
