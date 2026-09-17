export type Person = {
  name: string;
  title: string;
  description: string;
  email: string;
  experience: number;
};

export type SocialLink = {
  platform: string;
  url: string;
  icon: string;
  label: string;
  hoverColor?: string;
};

export type Strength = {
  title: string;
  phrase: string;
  color: 'rgb-blue' | 'rgb-green' | 'rgb-red';
};

export type NavLink = {
  href: string;
  label: string;
};
