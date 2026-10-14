import { RgbLogo } from './components/RgbLogo';

export default function App() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-8 px-6">
      <RgbLogo size={48} />
      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-center">
        Carlos Boyzo
      </h1>
      <p className="text-base sm:text-lg text-neutral-300 text-center tracking-wide">
        Asa Nisi Masa
      </p>
    </main>
  );
}
