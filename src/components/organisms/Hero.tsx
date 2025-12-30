import Image from 'next/image';
import { person } from '@/src/constants/person';
import { cn } from '@/src/utils/cn';

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
            <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide max-w-2xl mx-auto lg:mx-0 mb-8">
              {person.description}
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a
                href="#servicios"
                className={cn(
                  'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 tracking-wide',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'bg-gray-900 dark:bg-white text-white dark:text-gray-900 hover:bg-gray-800 dark:hover:bg-gray-100 focus:ring-gray-900 dark:focus:ring-white'
                )}
              >
                Ver Servicios
              </a>
              <a
                href="#contacto"
                className={cn(
                  'inline-flex items-center justify-center px-6 py-3 rounded-lg font-semibold transition-all duration-300 tracking-wide',
                  'focus:outline-none focus:ring-2 focus:ring-offset-2',
                  'bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200',
                  'hover:border-gray-400 dark:hover:border-gray-500 hover:text-gray-900 dark:hover:text-white focus:ring-gray-500'
                )}
              >
                Contactar
              </a>
            </div>
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
