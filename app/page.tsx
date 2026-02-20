import dynamic from 'next/dynamic';
import { PageLayout } from '@/src/components/templates/PageLayout';
import { Hero } from '@/src/components/organisms/Hero';

const About = dynamic(
  () => import('@/src/components/organisms/About').then((m) => ({ default: m.About })),
  { ssr: true }
);

const Services = dynamic(
  () => import('@/src/components/organisms/Services').then((m) => ({ default: m.Services })),
  { ssr: true }
);

const Skills = dynamic(
  () => import('@/src/components/organisms/Skills').then((m) => ({ default: m.Skills })),
  { ssr: true }
);

const Contact = dynamic(
  () => import('@/src/components/organisms/Contact').then((m) => ({ default: m.Contact })),
  { ssr: true }
);

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <About />
      <Services />
      <Skills />
      <Contact />
    </PageLayout>
  );
}
