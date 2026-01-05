import { PageLayout } from '@/src/components/templates/PageLayout';
import { Hero } from '@/src/components/organisms/Hero';
import { About } from '@/src/components/organisms/About';
import { Services } from '@/src/components/organisms/Services';
import { Skills } from '@/src/components/organisms/Skills';
import { Contact } from '@/src/components/organisms/Contact';

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
