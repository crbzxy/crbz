import { Section } from '@/src/components/molecules/Section';
import { Text } from '@/src/components/atoms/Text';

export function About() {
  return (
    <Section id="sobre-mi" title="Diseño Estratégico. Ejecución Técnica." className="py-8 md:py-12 mt-12">
      <div className="max-w-4xl">
        <Text variant="lead" className="text-lg md:text-xl">
          Como Diseñador SR UX en Grupo Truper, contribuyo a la evolución de aplicaciones móviles y web críticas para el negocio. Combino el pensamiento crítico del arte contemporáneo con la ingeniería de software rigurosa. Esta base dual me permite abordar proyectos desde perspectivas únicas, cerrando la brecha entre el diseño y el código.
        </Text>
      </div>
    </Section>
  );
}
