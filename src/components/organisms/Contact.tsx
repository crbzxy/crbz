import { Section } from '@/src/components/molecules/Section';
import { ContactLink } from '@/src/components/molecules/ContactLink';
import { Icon } from '@/src/components/atoms/Icon';
import { person, socialLinks } from '@/src/constants/person';

export function Contact() {
  return (
    <Section id="contacto" title="Contacto" className="py-8 md:py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <p className="text-lg text-gray-700 dark:text-gray-300 mb-6 tracking-wide">
            ¿Interesado en colaborar? Escríbeme para discutir tu proyecto.
          </p>

          <a
            href={`mailto:${person.email}`}
            className="inline-flex items-center justify-center px-8 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg font-semibold transition-all duration-300 tracking-wide hover:bg-gray-800 dark:hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 dark:focus:ring-white shadow-lg hover:shadow-xl"
          >
            <Icon name="email" size={20} className="mr-2" />
            Enviar Email
          </a>
        </div>

        <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sígueme en redes
          </h3>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <ContactLink key={link.platform} link={link} />
            ))}
          </div>
        </div>
      </div>
    </Section>
  );
}
