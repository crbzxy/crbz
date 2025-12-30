import { Section } from '@/src/components/molecules/Section';
import { SkillBadge } from '@/src/components/molecules/SkillBadge';
import { skills } from '@/src/constants/person';

export function Skills() {
  return (
    <Section title="Habilidades">
      <div className="flex flex-wrap gap-3">
        {skills.map((skill) => (
          <SkillBadge key={skill.name} skill={skill} />
        ))}
      </div>
    </Section>
  );
}

