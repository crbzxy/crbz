"use client";

import Image from "next/image";
import Link from "next/link";
import { Roboto_Condensed } from "next/font/google";
import { useState, useEffect } from "react";

// Configuración de Roboto Condensed
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

// Iconos como componentes
const DesignIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <rect x="3" y="4" width="18" height="12" rx="1" strokeWidth="2"/>
    <line x1="7" y1="8" x2="17" y2="8" strokeWidth="2"/>
    <line x1="7" y1="12" x2="13" y2="12" strokeWidth="2"/>
  </svg>
);

const CodeIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <polyline points="16,18 22,12 16,6" strokeWidth="2"/>
    <polyline points="8,6 2,12 8,18" strokeWidth="2"/>
  </svg>
);

const ExternalLinkIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6" strokeWidth="2"/>
    <polyline points="15,3 21,3 21,9" strokeWidth="2"/>
    <line x1="10" y1="14" x2="21" y2="3" strokeWidth="2"/>
  </svg>
);

const EmailIcon = ({ className }: { className?: string }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" strokeWidth="2"/>
    <polyline points="22,6 12,13 2,6" strokeWidth="2"/>
  </svg>
);

// Componente para las estadísticas animadas
const AnimatedStat = ({ value, label, delay = 0 }: { value: string; label: string; delay?: number }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div className={`text-center transform transition-all duration-700 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 dark:text-white mb-1">
        {value}
      </div>
      <div className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 tracking-wide">
        {label}
      </div>
    </div>
  );
};

// Componente para las tarjetas de habilidades
const SkillCard = ({ 
  icon, 
  title, 
  description, 
  technologies = [],
  delay = 0 
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  technologies?: string[];
  delay?: number;
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700
        transform transition-all duration-500 hover:shadow-md ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
      `}
    >
      <div className="flex items-center mb-2 sm:mb-3">
        <div className="p-1.5 sm:p-2 bg-gray-100 dark:bg-gray-700 rounded-lg mr-2 sm:mr-3">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base tracking-wide">
          {title}
        </h3>
      </div>
      
      <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2 sm:mb-3 tracking-wide text-xs sm:text-sm">
        {description}
      </p>
      
      {technologies.length > 0 && (
        <div className="flex flex-wrap gap-1 sm:gap-1.5">
          {technologies.map((tech, index) => (
            <span 
              key={index}
              className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 
                text-xs font-medium rounded tracking-wide"
            >
              {tech}
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const currentYear = new Date().getFullYear();
  const experience = currentYear - 2008;

  return (
    <section className={`h-[100%] min-h-[100vh] bg-white dark:bg-gray-900 relative ${robotoCondensed.className}`}>
      
      {/* Elementos decorativos minimalistas - solo en desktop */}
      <div className="hidden lg:block absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full opacity-40" />
        <div className="absolute bottom-1/3 left-1/5 w-1 h-1 bg-gray-400 dark:bg-gray-600 rounded-full opacity-30" />
      </div>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12 relative h-full flex items-center">
        <div className="w-full max-w-7xl mx-auto">
          
          {/* Layout móvil: Todo en una columna */}
          <div className="lg:hidden space-y-6 sm:space-y-8">
            
            {/* Título */}
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 dark:text-white 
              leading-tight tracking-tight transform transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
              Creator & Artist
            </h1>

            {/* Descripción */}
            <div className={`transform transition-all duration-1000 delay-200 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700" />
                <p className="text-base sm:text-lg text-gray-700 dark:text-gray-300 leading-relaxed pl-4 sm:pl-6 tracking-wide">
                  Con más de <span className="font-bold text-gray-900 dark:text-white text-lg sm:text-xl">{experience} años de trayectoria</span>,
                  transformo conceptos en experiencias digitales que <em className="text-gray-800 dark:text-gray-200 not-italic font-medium">capturan la atención</em> y
                  <em className="text-gray-800 dark:text-gray-200 not-italic font-medium"> generan resultados</em>.
                </p>
              </div>
            </div>

            {/* Estadísticas */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4 py-2 sm:py-3">
              <AnimatedStat value="+16" label="Años Experiencia" delay={400} />
              <AnimatedStat value="100+" label="Proyectos" delay={600} />
              <AnimatedStat value="50+" label="Clientes" delay={800} />
            </div>

            {/* Imagen en móvil */}
            <div className={`relative max-w-sm mx-auto transform transition-all duration-1000 delay-800 ${
              isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
            }`}>
              <div className="relative rounded-lg overflow-hidden shadow-lg max-h-[40vh] sm:max-h-[45vh]">
                <Image
                  src="/images/home/hero-image.png"
                  alt="Carlos Armando Boyzo - UX Designer & Frontend Developer"
                  width={400}
                  height={500}
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition-all duration-500"
                  priority
                />
              </div>
            </div>

            {/* Botones CTA en móvil - Posición prominente */}
            <div className={`flex flex-col sm:flex-row gap-3 sm:gap-4 transform transition-all duration-1000 delay-1000 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Link
                href="/portfolio"
                className="group inline-flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-white 
                  hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg 
                  transition-all duration-300 tracking-wide text-sm sm:text-base"
              >
                VER PORTAFOLIO
                <ExternalLinkIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <a
                href="mailto:carlos.boor@gmail.com"
                className="group inline-flex items-center justify-center px-6 py-3 bg-white dark:bg-gray-800 
                  border border-gray-300 dark:border-gray-600 hover:border-gray-400 
                  dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 hover:text-gray-900 
                  dark:hover:text-white font-semibold rounded-lg transition-all duration-300 
                  tracking-wide text-sm sm:text-base"
              >
                <EmailIcon className="w-4 h-4 mr-2" />
                CONTACTARME
              </a>
            </div>

            {/* Cards en móvil */}
            <div className="space-y-3 sm:space-y-4">
              <SkillCard
                icon={<DesignIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />}
                title="Diseño UX Estratégico"
                description="Como Diseñador SR UX en Truper, combino investigación de usuarios con diseño visual para crear soluciones que impulsan los resultados de negocio."
                technologies={["Figma", "Design Systems", "User Research"]}
                delay={1200}
              />
              
              <SkillCard
                icon={<CodeIcon className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600 dark:text-gray-400" />}
                title="Desarrollo Frontend"
                description="Implemento mis diseños con JavaScript y React.js, garantizando que la visión creativa se traduzca en código de alta calidad y rendimiento."
                technologies={["React.js", "Next.js", "TypeScript"]}
                delay={1400}
              />
            </div>

            {/* Filosofía en móvil */}
            <div className={`bg-gray-50 dark:bg-gray-800 p-3 sm:p-4 rounded-lg border border-gray-200 dark:border-gray-700
              transform transition-all duration-1000 delay-1600 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
              <p className="text-sm sm:text-base text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
                Mi enfoque trasciende el diseño convencional, situándome en la valiosa intersección entre
                <span className="font-semibold mx-1 text-gray-900 dark:text-white"> diseño</span>,
                <span className="font-semibold mx-1 text-gray-900 dark:text-white"> tecnología</span> y
                <span className="font-semibold mx-1 text-gray-900 dark:text-white"> arte</span>.
                Cada proyecto refleja mi compromiso con la <span className="underline decoration-gray-400 decoration-1 underline-offset-2 font-semibold">excelencia</span>,
                creando interfaces intuitivas que <span className="font-semibold text-gray-900 dark:text-white">generan valor medible</span>.
              </p>
            </div>
          </div>

          {/* Layout desktop: Dos columnas */}
          <div className="hidden lg:flex lg:items-center lg:gap-16">
            
            {/* Columna de contenido */}
            <div className="lg:w-3/5 space-y-8">
              
              {/* Título */}
              <h1 className={`text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white 
                leading-none tracking-tight transform transition-all duration-1000 ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}>
                Creator & Artist
              </h1>

              {/* Descripción */}
              <div className={`space-y-3 transform transition-all duration-1000 delay-200 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <div className="relative">
                  <div className="absolute left-0 top-0 bottom-0 w-px bg-gray-300 dark:bg-gray-700" />
                  <p className="text-lg md:text-xl text-gray-700 dark:text-gray-300 leading-relaxed pl-6 tracking-wide">
                    Con más de <span className="font-bold text-gray-900 dark:text-white text-xl md:text-2xl">{experience} años de trayectoria</span>,
                    transformo conceptos en experiencias digitales que <em className="text-gray-800 dark:text-gray-200 not-italic font-medium">capturan la atención</em> y
                    <em className="text-gray-800 dark:text-gray-200 not-italic font-medium"> generan resultados</em>.
                  </p>
                </div>

                {/* Estadísticas */}
                <div className="grid grid-cols-3 gap-4 py-3">
                  <AnimatedStat value="+16" label="Años Experiencia" delay={400} />
                  <AnimatedStat value="100+" label="Proyectos" delay={600} />
                  <AnimatedStat value="50+" label="Clientes" delay={800} />
                </div>
              </div>

              {/* Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <SkillCard
                  icon={<DesignIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                  title="Diseño UX Estratégico"
                  description="Como Diseñador SR UX en Truper, combino investigación de usuarios con diseño visual para crear soluciones que impulsan los resultados de negocio."
                  technologies={["Figma", "Design Systems", "User Research"]}
                  delay={1000}
                />
                
                <SkillCard
                  icon={<CodeIcon className="w-5 h-5 text-gray-600 dark:text-gray-400" />}
                  title="Desarrollo Frontend"
                  description="Implemento mis diseños con JavaScript y React.js, garantizando que la visión creativa se traduzca en código de alta calidad y rendimiento."
                  technologies={["React.js", "Next.js", "TypeScript"]}
                  delay={1200}
                />
              </div>

              {/* Botones CTA desktop */}
              <div className={`flex flex-wrap gap-4 transform transition-all duration-1000 delay-1400 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
                <Link
                  href="/portfolio"
                  className="group inline-flex items-center px-6 py-3 bg-gray-900 dark:bg-white 
                    hover:bg-gray-800 dark:hover:bg-gray-100 text-white dark:text-gray-900 font-semibold rounded-lg 
                    transition-all duration-300 tracking-wide text-sm"
                >
                  VER PORTAFOLIO
                  <ExternalLinkIcon className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>

                <a
                  href="mailto:carlos.boor@gmail.com"
                  className="group inline-flex items-center px-6 py-3 bg-white dark:bg-gray-800 
                    border border-gray-300 dark:border-gray-600 hover:border-gray-400 
                    dark:hover:border-gray-500 text-gray-700 dark:text-gray-200 hover:text-gray-900 
                    dark:hover:text-white font-semibold rounded-lg transition-all duration-300 
                    tracking-wide text-sm"
                >
                  <EmailIcon className="w-4 h-4 mr-2" />
                  CONTACTARME
                </a>
              </div>
            </div>

            {/* Columna de imagen desktop */}
            <div className="lg:w-2/5 relative h-full flex items-center justify-center">
              <div className={`relative transform transition-all duration-1000 delay-800 ${
                isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
              }`}>
                
                <div className="relative">
                  <div className="relative rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 max-h-[50vh]">
                    <Image
                      src="/images/home/hero-image.png"
                      alt="Carlos Armando Boyzo - UX Designer & Frontend Developer"
                      width={400}
                      height={500}
                      className="w-full h-auto object-cover max-h-[50vh] grayscale hover:grayscale-0 transition-all duration-500"
                      priority
                    />
                  </div>

                  {/* Indicadores minimalistas */}
                  <div className="absolute -right-2 top-1/4 transform -translate-y-1/2">
                    <div className="flex flex-col space-y-3">
                      <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm">
                        <div className="w-2 h-2 bg-gray-400 rounded-full" />
                      </div>
                      <div className="p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full shadow-sm">
                        <div className="w-2 h-2 bg-gray-500 rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
}
