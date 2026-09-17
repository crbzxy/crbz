import { lazy, Suspense, useState } from 'react';
import { Header } from './components/layout/Header';
import { Footer } from './components/layout/Footer';
import { Hero } from './components/sections/Hero';
import { About } from './components/sections/About';
import { Strengths } from './components/sections/Strengths';
import { Contact } from './components/sections/Contact';
import { cn } from './utils/cn';
import './App.css';

const FlameScene = lazy(async () => {
  const module = await import('./components/FlameScene');
  return { default: module.FlameScene };
});

export default function App() {
  const [sceneEnabled, setSceneEnabled] = useState(true);

  return (
    <div className={cn('app', !sceneEnabled && 'app--scene-off')}>
      <Suspense fallback={null}>
        <FlameScene visible={sceneEnabled} />
      </Suspense>

      <div className="marble-overlay" aria-hidden="true" />

      <div className="site-content">
        <Header
          sceneEnabled={sceneEnabled}
          onSceneEnabledChange={setSceneEnabled}
        />
        <main>
          <Hero sceneEnabled={sceneEnabled} />
          <About />
          <Strengths />
          <Contact />
        </main>
        <Footer />
      </div>
    </div>
  );
}
