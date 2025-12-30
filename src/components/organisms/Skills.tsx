import { Section } from '@/src/components/molecules/Section';
import { SkillBadge } from '@/src/components/molecules/SkillBadge';
import { skills } from '@/src/constants/person';

export function Skills() {
  // Agrupar habilidades por categoría
  const skillsByCategory = skills.reduce(
    (acc, skill) => {
      const category = skill.category || 'Otros';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(skill);
      return acc;
    },
    {} as Record<string, typeof skills>
  );

  const categoryLabels: Record<string, string> = {
    Design: 'Diseño',
    Development: 'Desarrollo',
    Creative: 'Creativo',
    Otros: 'Otros',
  };

  return (
    <Section title="Habilidades" className="py-8 md:py-12">
      <div className="space-y-8">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div key={category}>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {categoryLabels[category] || category}
            </h3>
            <div className="flex flex-wrap gap-3">
              {categorySkills.map((skill) => (
                <SkillBadge key={skill.name} skill={skill} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </Section>
  );
}
