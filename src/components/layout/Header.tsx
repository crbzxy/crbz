import { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { navLinks, person } from '../../content/person';
import { RgbLogo } from '../RgbLogo';
import { SceneToggle } from '../ui/SceneToggle';
import { cn } from '../../utils/cn';

type HeaderProps = {
  sceneEnabled: boolean;
  onSceneEnabledChange: (enabled: boolean) => void;
};

export function Header({ sceneEnabled, onSceneEnabledChange }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
        scrolled ? 'glass py-3 md:py-4' : 'py-4 md:py-6',
      )}
    >
      <div className="container flex items-center justify-between gap-4">
        <a
          href="#"
          className="flex items-center gap-3 font-display text-sm md:text-base font-bold tracking-tight text-foreground"
          onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
            closeMobileMenu();
          }}
        >
          <RgbLogo size={32} />
          {person.name.toUpperCase()}
        </a>

        <div className="hidden md:flex items-center gap-6 lg:gap-8">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              onClick={closeMobileMenu}
            >
              {link.label}
            </a>
          ))}
          <SceneToggle enabled={sceneEnabled} onChange={onSceneEnabledChange} />
        </div>

        <div className="flex md:hidden items-center gap-3">
          <SceneToggle enabled={sceneEnabled} onChange={onSceneEnabledChange} />
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="p-2 text-foreground hover:text-muted-foreground transition-colors"
            aria-label="Abrir menú"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="md:hidden overflow-hidden">
          <div className="container py-4 space-y-4 glass border-t border-border/50">
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={closeMobileMenu}
                className="block text-base text-muted-foreground hover:text-foreground transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
