import { Section } from '@/src/components/molecules/Section';
import { ContactLink } from '@/src/components/molecules/ContactLink';
import { Icon } from '@/src/components/atoms/Icon';
import { person, socialLinks } from '@/src/constants/person';

export function Contact() {
  return (
    <Section title="Contacto">
      <div className="max-w-2xl">
        <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 tracking-wide">
          ¿Interesado en colaborar? Escríbeme para discutir tu proyecto.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <a
            href={`mailto:${person.email}`}
            className="inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 tracking-wide bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white"
          >
            <Icon name="email" size={20} className="mr-2" />
            Enviar Email
          </a>
        </div>

        <div className="flex items-center gap-6">
          <span className="text-sm text-gray-600 dark:text-gray-400">Sígueme:</span>
          {socialLinks.map((link) => (
            <ContactLink key={link.platform} link={link} />
          ))}
        </div>
      </div>
    </Section>
  );
}

