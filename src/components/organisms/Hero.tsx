import { person } from '@/src/constants/person';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-16 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
          {person.name}
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-4 tracking-wide">
          {person.title}
        </p>
        <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed tracking-wide">
          {person.description}
        </p>
      </div>
    </section>
  );
}

