import { lazy, Suspense } from 'react';
import { RgbLogo } from './components/RgbLogo';
import './App.css';

const FlameScene = lazy(async () => {
  const module = await import('./components/FlameScene');
  return { default: module.FlameScene };
});

export default function App() {
  return (
    <main className="app">
      <a className="brand" href="/" aria-label="CRBZ">
        <RgbLogo />
        <span className="brand-name">CBO</span>
      </a>
      <Suspense fallback={null}>
        <FlameScene />
      </Suspense>
    </main>
  );
}
