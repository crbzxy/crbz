import {
  Linkedin,
  Github,
  Instagram,
  Mail,
  type LucideIcon,
} from 'lucide-react';

export const getSocialIcon = (
  iconName: string
): LucideIcon | typeof Mail => {
  const iconMap: Record<string, LucideIcon> = {
    linkedin: Linkedin,
    github: Github,
    instagram: Instagram,
    email: Mail,
  };

  return iconMap[iconName.toLowerCase()] || Mail;
};

