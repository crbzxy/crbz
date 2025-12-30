import { Badge } from '@/src/components/atoms/Badge';
import type { Skill } from '@/src/types';

export interface SkillBadgeProps {
  skill: Skill;
}

export function SkillBadge({ skill }: SkillBadgeProps) {
  return <Badge variant="skill">{skill.name}</Badge>;
}

