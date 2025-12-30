import { Section } from '@/src/components/molecules/Section';
import { Text } from '@/src/components/atoms/Text';
import { person } from '@/src/constants/person';

export function About() {
  return (
    <Section title="Sobre Mí">
      <div className="max-w-3xl">
        <Text variant="lead">
          {person.description}
        </Text>
        <Text className="mt-4">
          Con más de {person.experience} años de experiencia en diseño UX y desarrollo frontend,
          me especializo en crear experiencias digitales que combinan estética, funcionalidad
          y resultados medibles.
        </Text>
      </div>
    </Section>
  );
}

