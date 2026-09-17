import { Mail, type LucideIcon } from 'lucide-react';
import type { SVGProps } from 'react';
import { GithubIcon, InstagramIcon, LinkedinIcon } from '../components/icons/BrandIcons';

type IconComponent = LucideIcon | ((props: SVGProps<SVGSVGElement>) => React.JSX.Element);

const iconMap: Record<string, IconComponent> = {
  linkedin: LinkedinIcon,
  github: GithubIcon,
  instagram: InstagramIcon,
  email: Mail,
};

export function getSocialIcon(iconName: string): IconComponent {
  return iconMap[iconName.toLowerCase()] ?? Mail;
}
