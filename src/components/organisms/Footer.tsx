import { ContactLink } from '@/src/components/molecules/ContactLink';
import { person, socialLinks } from '@/src/constants/person';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-white py-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-sm text-gray-400">
            © {currentYear} {person.name}. Todos los derechos reservados.
          </div>

          <div className="flex items-center gap-6">
            {socialLinks.map((link) => (
              <ContactLink key={link.platform} link={link} />
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
