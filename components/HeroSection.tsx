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
    <div className={`text-center transform transition-all duration-700 delay-${delay} ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
    }`}>
      <div className="text-2xl md:text-3xl font-bold text-blue-600 dark:text-blue-400 mb-1">
        {value}
      </div>
      <div className="text-sm text-gray-600 dark:text-gray-400 tracking-wide">
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
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay);
    return () => clearTimeout(timer);
  }, [delay]);

  return (
    <div 
      className={`group relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm p-6 rounded-2xl 
        shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-700
        transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}
        ${isHovered ? 'scale-105 -translate-y-2' : 'scale-100'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Efecto de brillo en hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-purple-600/0 
        opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />
      
      <div className="relative z-10">
        <div className="flex items-center mb-4">
          <div className="p-3 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 
            dark:to-indigo-900/30 rounded-xl mr-4 group-hover:scale-110 transition-transform duration-300">
            {icon}
          </div>
          <h3 className="font-bold text-gray-900 dark:text-white text-lg tracking-wide group-hover:text-blue-600 
            dark:group-hover:text-blue-400 transition-colors duration-300">
            {title}
          </h3>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-4 tracking-wide">
          {description}
        </p>
        
        {technologies.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {technologies.map((tech, index) => (
              <span 
                key={index}
                className="px-3 py-1 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 
                  text-xs font-medium rounded-full tracking-wide"
              >
                {tech}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default function HeroSection() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [activeSection, setActiveSection] = useState(0);

  useEffect(() => {
    setIsLoaded(true);
    
    // Animación secuencial de secciones
    const interval = setInterval(() => {
      setActiveSection(prev => (prev + 1) % 3);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const currentYear = new Date().getFullYear();
  const experience = currentYear - 2008; // Asumiendo que empezó en 2008

  return (
    <section className={`min-h-screen bg-gradient-to-br from-white via-blue-50/30 to-indigo-50/50 
      dark:from-gray-900 dark:via-blue-950/20 dark:to-indigo-950/30 relative overflow-hidden ${robotoCondensed.className}`}>
      
      {/* Elementos decorativos de fondo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-gradient-to-br from-blue-400/10 to-purple-600/10 
          rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-gradient-to-tr from-indigo-400/10 to-cyan-600/10 
          rounded-full blur-3xl animate-pulse delay-1000" />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(59,130,246,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(59,130,246,0.03)_1px,transparent_1px)] 
          bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      </div>

      <main className="container mx-auto px-4 py-16 relative z-10">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
          
          {/* Columna de contenido */}
          <div className="lg:w-3/5 space-y-8">
            
            {/* Badge animado */}
            <div className={`inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-50 to-indigo-50 
              dark:from-blue-900/30 dark:to-indigo-900/30 text-blue-600 dark:text-blue-300 rounded-full 
              text-sm font-semibold tracking-widest uppercase shadow-md backdrop-blur-sm border 
              border-blue-100 dark:border-blue-800 transform transition-all duration-1000 ${
                isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'
              }`}>
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3 animate-pulse" />
              Developer • Designer • Creative
            </div>

            {/* Título principal */}
            <h1 className={`text-5xl md:text-6xl lg:text-7xl font-bold text-gray-900 dark:text-white 
              leading-none tracking-tight transform transition-all duration-1000 delay-200 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
              <span className="block bg-gradient-to-r from-gray-900 via-blue-800 to-indigo-800 
                dark:from-white dark:via-blue-200 dark:to-indigo-200 bg-clip-text text-transparent">
                Creator &
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 
                bg-clip-text text-transparent">
                Artist
              </span>
            </h1>

            {/* Descripción principal */}
            <div className={`space-y-6 transform transition-all duration-1000 delay-400 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <div className="relative">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-full" />
                <p className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 leading-relaxed pl-6 tracking-wide">
                  Con más de <span className="font-bold text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 
                    bg-clip-text text-2xl md:text-3xl">{experience} años de trayectoria</span>,
                  transformo conceptos en experiencias digitales que <em className="text-blue-600 dark:text-blue-400 not-italic">capturan la atención</em> y
                  <em className="text-indigo-600 dark:text-indigo-400 not-italic"> generan resultados</em>.
                </p>
              </div>

              {/* Estadísticas */}
              <div className="grid grid-cols-3 gap-6 py-6">
                <AnimatedStat value="+16" label="Años Experiencia" delay={600} />
                <AnimatedStat value="100+" label="Proyectos" delay={800} />
                <AnimatedStat value="50+" label="Clientes" delay={1000} />
              </div>
            </div>

            {/* Tarjetas de habilidades */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillCard
                icon={<DesignIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                title="Diseño UX Estratégico"
                description="Como Diseñador SR UX en Truper, combino investigación de usuarios con diseño visual para crear soluciones que impulsan los resultados de negocio."
                technologies={["Figma", "Design Systems", "User Research", "Prototyping"]}
                delay={1200}
              />
              
              <SkillCard
                icon={<CodeIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />}
                title="Desarrollo Frontend"
                description="Implemento mis diseños con JavaScript y React.js, garantizando que la visión creativa se traduzca en código de alta calidad y rendimiento."
                technologies={["React.js", "Next.js", "TypeScript", "Tailwind CSS"]}
                delay={1400}
              />
            </div>

            {/* Filosofía de trabajo */}
            <div className={`bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 
              dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 p-8 rounded-2xl 
              backdrop-blur-sm border border-blue-100 dark:border-blue-800 shadow-xl
              transform transition-all duration-1000 delay-1600 ${
                isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
              }`}>
              <div className="space-y-4">
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
                  Mi enfoque trasciende el diseño convencional, situándome en la valiosa intersección entre
                  <span className="font-bold mx-1 text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text"> diseño</span>,
                  <span className="font-bold mx-1 text-transparent bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text"> tecnología</span> y
                  <span className="font-bold mx-1 text-transparent bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text"> arte</span>.
                </p>
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
                  Cada proyecto refleja mi compromiso con la <span className="underline decoration-blue-400 decoration-2 underline-offset-4 font-semibold">excelencia</span>,
                  creando interfaces intuitivas que no solo cumplen objetivos, sino que transforman positivamente la experiencia digital y
                  <span className="font-bold text-emerald-600 dark:text-emerald-400"> generan valor medible</span> para las organizaciones.
                </p>
              </div>
            </div>

            {/* Botones CTA */}
            <div className={`flex flex-wrap gap-4 transform transition-all duration-1000 delay-1800 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
            }`}>
              <Link
                href="/portfolio"
                className="group inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 
                  hover:from-blue-700 hover:to-indigo-700 text-white font-semibold rounded-xl 
                  transition-all duration-300 shadow-lg hover:shadow-2xl transform hover:scale-105 
                  tracking-wide"
              >
                VER PORTAFOLIO
                <ExternalLinkIcon className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>

              <a
                href="mailto:carlos.boor@gmail.com"
                className="group inline-flex items-center px-8 py-4 bg-white/80 dark:bg-gray-800/80 
                  backdrop-blur-sm border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 
                  dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 hover:text-blue-600 
                  dark:hover:text-blue-400 font-semibold rounded-xl transition-all duration-300 
                  shadow-lg hover:shadow-2xl transform hover:scale-105 tracking-wide"
              >
                <EmailIcon className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform duration-300" />
                CONTACTARME
              </a>
            </div>
          </div>

          {/* Columna de imagen */}
          <div className="lg:w-2/5 relative">
            <div className={`relative z-10 transform transition-all duration-1000 delay-1000 ${
              isLoaded ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-12 opacity-0 scale-95'
            }`}>
              
              {/* Container de la imagen con efectos */}
              <div className="relative group">
                {/* Imagen principal */}
                <div className="relative rounded-2xl overflow-hidden shadow-2xl transform transition-all duration-700 
                  hover:scale-105 hover:rotate-1 group-hover:shadow-3xl">
                  <Image
                    src="/images/home/hero-image.png" // Asume que tienes la imagen en esta ruta
                    alt="Carlos Armando Boyzo - UX Designer & Frontend Developer"
                    width={500}
                    height={600}
                    className="w-full h-auto object-cover"
                    priority
                  />
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-blue-900/20 via-transparent to-transparent 
                    opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Elementos decorativos flotantes */}
                <div className="absolute -top-6 -right-6 w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-500 
                  rounded-2xl blur-xl opacity-30 animate-pulse group-hover:scale-125 transition-transform duration-700" />
                <div className="absolute -bottom-6 -left-6 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 
                  rounded-full blur-xl opacity-25 animate-pulse delay-1000 group-hover:scale-125 transition-transform duration-700" />
                
                {/* Efecto de cristal */}
                <div className="absolute inset-0 rounded-2xl border border-white/20 backdrop-blur-sm opacity-0 
                  group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              {/* Indicadores de tecnologías flotantes */}
              <div className="absolute -right-4 top-1/4 transform -translate-y-1/2">
                <div className="flex flex-col space-y-4">
                  <div className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg 
                    hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-blue-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M14.23 12.004a2.236 2.236 0 0 1-2.235 2.236 2.236 2.236 0 0 1-2.236-2.236 2.236 2.236 0 0 1 2.235-2.236 2.236 2.236 0 0 1 2.236 2.236zm2.648-10.69c-1.346 0-3.107.96-4.888 2.622-1.78-1.653-3.542-2.602-4.887-2.602-.41 0-.783.093-1.106.278-1.375.793-1.683 3.264-.973 6.365C1.98 8.917 0 10.42 0 12.004c0 1.59 1.99 3.097 5.043 4.03-.704 3.113-.39 5.588.988 6.38.32.187.69.275 1.102.275 1.345 0 3.107-.96 4.888-2.624 1.78 1.654 3.542 2.603 4.887 2.603.41 0 .783-.09 1.106-.275 1.374-.792 1.683-3.263.973-6.365C22.02 15.096 24 13.59 24 12.004c0-1.59-1.99-3.097-5.043-4.032.704-3.11.39-5.587-.988-6.38-.318-.184-.688-.277-1.092-.278zm-.005 1.09v.006c.225 0 .406.044.558.127.666.382.955 1.835.73 3.704-.054.46-.142.945-.25 1.44-.96-.236-2.006-.417-3.107-.534-.66-.905-1.345-1.727-2.035-2.447 1.592-1.48 3.087-2.292 4.105-2.295zm-9.77.02c1.012 0 2.514.808 4.11 2.28-.686.72-1.37 1.537-2.02 2.442-1.107.117-2.154.298-3.113.538-.112-.49-.195-.964-.254-1.42-.23-1.868.054-3.32.714-3.707.19-.09.4-.127.563-.132zm4.882 3.05c.455.468.91.992 1.36 1.564-.44-.02-.89-.034-1.345-.034-.46 0-.915.01-1.36.034.44-.572.895-1.096 1.345-1.565zM12 8.1c.74 0 1.477.034 2.202.093.406.582.802 1.203 1.183 1.86.372.64.71 1.29 1.018 1.946-.308.655-.646 1.31-1.013 1.95-.38.66-.773 1.288-1.18 1.87-.728.063-1.466.098-2.21.098-.74 0-1.477-.035-2.202-.093-.406-.582-.802-1.204-1.183-1.86-.372-.64-.71-1.29-1.018-1.946.303-.657.646-1.313 1.013-1.954.38-.66.773-1.286 1.18-1.868.728-.064 1.466-.099 2.21-.099zm-3.635.254c-.24.377-.48.763-.704 1.16-.225.39-.435.782-.635 1.174-.265-.656-.49-1.31-.676-1.947.64-.15 1.315-.283 2.015-.386zm7.26 0c.695.103 1.365.23 2.006.387-.18.632-.405 1.282-.66 1.933-.2-.39-.41-.783-.64-1.174-.225-.392-.465-.774-.705-1.146zm3.063.675c.484.15.944.317 1.375.498 1.732.74 2.852 1.708 2.852 2.476-.005.768-1.125 1.74-2.857 2.475-.42.18-.88.342-1.355.493-.28-.958-.646-1.956-1.1-2.98.45-1.017.81-2.01 1.085-2.964zm-13.395.004c.278.96.645 1.957 1.1 2.98-.45 1.017-.812 2.01-1.086 2.964-.484-.15-.944-.318-1.37-.5-1.732-.737-2.852-1.706-2.852-2.474 0-.768 1.12-1.742 2.852-2.476.42-.18.88-.342 1.356-.494zm11.678 4.28c.265.657.49 1.312.676 1.948-.64.157-1.316.29-2.016.39.24-.375.48-.762.705-1.158.225-.39.435-.788.636-1.18zm-9.945.02c.2.392.41.783.64 1.175.23.39.465.772.705 1.143-.695-.102-1.365-.23-2.006-.386.18-.63.406-1.282.66-1.933zM17.92 16.32c.112.493.2.968.254 1.423.23 1.868-.054 3.32-.714 3.708-.147.09-.338.128-.563.128-1.012 0-2.514-.807-4.11-2.28.686-.72 1.37-1.536 2.02-2.44 1.107-.118 2.154-.3 3.113-.54zm-11.83.01c.96.234 2.006.415 3.107.532.66.905 1.345 1.727 2.035 2.446-1.595 1.483-3.092 2.295-4.11 2.295-.22-.005-.406-.05-.553-.132-.666-.38-.955-1.834-.73-3.703.054-.46.142-.944.25-1.438zm4.56.64c.44.02.89.034 1.345.034.46 0 .915-.01 1.36-.034-.44.572-.895 1.095-1.345 1.565-.455-.47-.91-.993-1.36-1.565z"/>
                    </svg>
                  </div>
                  <div className="p-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full shadow-lg 
                    hover:scale-110 transition-transform duration-300 delay-100">
                    <svg className="w-6 h-6 text-indigo-500" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.174-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.749.099.12.112.225.083.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.402.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.92-7.252 4.158 0 7.392 2.967 7.392 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.357-.629-2.748-1.378 0 0-.599 2.283-.744 2.845-.282 1.084-1.064 2.456-1.549 3.235C9.584 23.815 10.77 24.001 12.017 24.001c6.624 0 11.99-5.367 11.99-11.988C24.007 5.367 18.641.001 12.017.001z"/>
                    </svg>
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
