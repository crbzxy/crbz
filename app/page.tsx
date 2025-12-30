import { PageLayout } from '@/src/components/templates/PageLayout';
import { Hero } from '@/src/components/organisms/Hero';
import { About } from '@/src/components/organisms/About';
import { Skills } from '@/src/components/organisms/Skills';
import { Contact } from '@/src/components/organisms/Contact';

export default function Home() {
  return (
    <PageLayout>
      <Hero />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <About />
        <Skills />
        <Contact />
      </div>
    </PageLayout>
  );
}
