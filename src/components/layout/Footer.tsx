import { person } from '../../content/person';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border py-8">
      <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          © {currentYear} {person.name}. Todos los derechos reservados.
        </p>
        <p className="text-sm text-muted-foreground">Alma de sofubi, código de arena</p>
      </div>
    </footer>
  );
}
