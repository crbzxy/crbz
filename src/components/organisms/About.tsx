import { Section } from '@/src/components/molecules/Section';
import { Text } from '@/src/components/atoms/Text';
import { person } from '@/src/constants/person';

export function About() {
  return (
    <Section title="Sobre Mí" className="py-8 md:py-12 mt-12">
      <div className="max-w-4xl space-y-6">
        <div className="space-y-4">
          <Text>
            Actualmente trabajo como <span className="font-semibold text-gray-900 dark:text-white">Diseñador SR UX en Grupo Truper</span>, donde lidero el diseño y rediseño de aplicaciones móviles y web. Coordino equipos multidisciplinarios y traduzco requerimientos de negocio en soluciones UX/UI escalables con resultados medibles.
          </Text>

          <Text>
            Mi formación combina <span className="font-semibold text-gray-900 dark:text-white">arte contemporáneo</span> (Escuela Nacional de Pintura Escultura y Grabado "La Esmeralda" y École nationale supérieure des beaux-arts de Lyon) con <span className="font-semibold text-gray-900 dark:text-white">desarrollo técnico</span>. Esta base dual me permite abordar proyectos desde perspectivas únicas, generando soluciones innovadoras.
          </Text>

          <Text>
            He trabajado en proyectos diversos: inventarios, logística, educación, facturación, media y productividad. Desarrollo funcionalidades clave como dashboards, filtros avanzados, prototipos interactivos y rediseños estratégicos. Mi práctica artística, especialmente en exploración 3D y arte digital, enriquece constantemente mi trabajo tecnológico.
          </Text>
        </div>
      </div>
    </Section>
  );
}
