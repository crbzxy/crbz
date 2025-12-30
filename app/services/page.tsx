import { PageLayout } from '@/src/components/templates/PageLayout';
import { Section } from '@/src/components/molecules/Section';
import { Text } from '@/src/components/atoms/Text';

export default function ServicesPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Section title="Servicios">
          <div className="max-w-3xl">
            <Text variant="lead" className="mb-6">
              Ofrezco servicios especializados en diseño UX y desarrollo frontend.
            </Text>
            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Diseño UX Estratégico
                </h3>
                <Text>
                  Creación de experiencias digitales centradas en el usuario que resuelven
                  problemas reales y generan valor.
                </Text>
              </div>
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Desarrollo Frontend
                </h3>
                <Text>
                  Desarrollo de interfaces y aplicaciones web modernas con React, Next.js
                  y TypeScript.
                </Text>
              </div>
            </div>
          </div>
        </Section>
      </div>
    </PageLayout>
  );
}

