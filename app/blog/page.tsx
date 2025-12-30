import { PageLayout } from '@/src/components/templates/PageLayout';
import { Section } from '@/src/components/molecules/Section';
import { Text } from '@/src/components/atoms/Text';

export default function BlogPage() {
  return (
    <PageLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12">
        <Section title="Blog">
          <div className="max-w-3xl">
            <Text variant="lead">
              El blog estará disponible próximamente.
            </Text>
            <Text className="mt-4">
              Aquí compartiré pensamientos sobre tecnología, diseño y creatividad digital.
            </Text>
          </div>
        </Section>
      </div>
    </PageLayout>
  );
}

