import { Section } from '@/src/components/molecules/Section';
import { SkillBadge } from '@/src/components/molecules/SkillBadge';
import { skills } from '@/src/constants/person';

export function Skills() {
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
    <Section id="habilidades" title="Habilidades" className="py-8 md:py-12">
      {/* Bento Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Object.entries(skillsByCategory).map(([category, categorySkills]) => (
          <div
            key={category}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {categoryLabels[category] || category}
            </h3>
            <div className="flex flex-wrap gap-2">
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
