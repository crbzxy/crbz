import { Icon } from '@/src/components/atoms/Icon';
import type { SocialLink } from '@/src/types';
import { cn } from '@/src/utils/cn';

export interface ContactLinkProps {
  link: SocialLink | { platform: 'Email'; url: string; icon: 'email'; label: string };
  className?: string;
}

export function ContactLink({ link, className }: ContactLinkProps) {
  const isEmail = link.platform === 'Email';
  const iconName = link.icon as 'linkedin' | 'github' | 'instagram' | 'email';

  return (
    <a
      href={isEmail ? `mailto:${link.url}` : link.url}
      target={isEmail ? undefined : '_blank'}
      rel={isEmail ? undefined : 'noopener noreferrer'}
      aria-label={link.label}
      className={cn(
        'inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors duration-200',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md p-1',
        className
      )}
    >
      <Icon name={iconName} size={20} />
      <span className="sr-only">{link.label}</span>
    </a>
  );
}

