import Image from 'next/image';
import { person } from '@/src/constants/person';

export function Hero() {
  return (
    <section className="min-h-screen flex items-center justify-center pt-20 pb-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
      <div className="max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight leading-tight">
              {person.name}
            </h1>
            <p className="text-2xl md:text-3xl text-blue-600 dark:text-blue-400 mb-6 tracking-wide font-semibold">
              {person.title}
            </p>
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide max-w-2xl mx-auto lg:mx-0">
              {person.description}
            </p>
          </div>

          {/* Image */}
          <div className="relative w-full max-h-[70vh] mx-auto lg:max-w-none">
            <div className="relative rounded-2xl overflow-hidden">
              <Image
                src="/images/home/hero-image.png"
                alt={`${person.name} - ${person.title}`}
                width={600}
                height={600}
                className="w-full h-auto object-cover max-h-[70vh]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
