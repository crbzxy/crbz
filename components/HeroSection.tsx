import Image from "next/image";
import home1 from "../public/images/home/hero-image.png";
import Link from "next/link";
import { Roboto_Condensed } from "next/font/google";

// Configuración de Roboto Condensed
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "700"],
  display: "swap",
  variable: "--font-roboto-condensed",
});

export default function HeroSection() {
    return (
        <div className={`min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 ${robotoCondensed.className}`}>
            {/* Hero Section */}
            <main className="container mx-auto px-4 py-16">
                <div className="flex flex-col lg:flex-row items-center gap-8">
                    {/* Content Column - Aparece primero en móvil */}
                    <div className="lg:w-3/5 order-1 lg:order-1">
                        <div className="inline-block mb-4 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium tracking-wide">
                            DEVELOPER • DESIGNER • CREATIVE
                        </div>

                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight tracking-tight">
                            Creator & Artist
                        </h1>

                        <div className="space-y-6 max-w-none">
                            <div className="relative">
                                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed pl-4 border-l-4 border-blue-500 tracking-wide">
                                    Con más de <span className="font-bold text-blue-600 dark:text-blue-400 text-xl">16 años de trayectoria</span>,
                                    transformo conceptos en experiencias digitales que <span className="italic">capturan la atención</span> y
                                    <span className="italic"> generan resultados</span>.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 my-8">
                                <div className="bg-white/50 dark:bg-gray-800/50 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center mb-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white tracking-wide">Diseño UX Estratégico</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 tracking-wide">
                                        Como Diseñador SR UX en <span className="font-medium">Truper</span>, combino investigación de usuarios con diseño visual para crear soluciones que impulsan los resultados de negocio.
                                    </p>
                                </div>

                                <div className="bg-white/50 dark:bg-gray-800/50 p-5 rounded-xl shadow-sm hover:shadow-md transition-all duration-300">
                                    <div className="flex items-center mb-3">
                                        <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-3">
                                            <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                                            </svg>
                                        </div>
                                        <h3 className="font-semibold text-gray-900 dark:text-white tracking-wide">Desarrollo Frontend</h3>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-300 tracking-wide">
                                        Implemento mis diseños con <span className="font-medium">JavaScript</span> y <span className="font-medium">React.js</span>, garantizando que la visión creativa se traduzca en código de alta calidad y rendimiento.
                                    </p>
                                </div>
                            </div>

                            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl">
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4 tracking-wide">
                                    Mi enfoque trasciende el diseño convencional, situándome en la valiosa intersección entre
                                    <span className="font-semibold mx-1 text-indigo-600 dark:text-indigo-400">diseño</span>,
                                    <span className="font-semibold mx-1 text-blue-600 dark:text-blue-400">tecnología</span> y
                                    <span className="font-semibold mx-1 text-purple-600 dark:text-purple-400">arte</span>.
                                </p>
                                <p className="text-gray-700 dark:text-gray-300 leading-relaxed tracking-wide">
                                    Cada proyecto refleja mi compromiso con la <span className="underline decoration-blue-400 decoration-2 underline-offset-2">excelencia</span>,
                                    creando interfaces intuitivas que no solo cumplen objetivos, sino que transforman positivamente la experiencia digital y
                                    <span className="font-medium"> generan valor medible</span> para las organizaciones.
                                </p>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mt-8 mb-12 lg:mb-0">
                            <Link
                                href="/portfolio"
                                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center tracking-wide"
                            >
                                VER PORTAFOLIO
                                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
                                </svg>
                            </Link>

                            <a
                                href="mailto:carlos.boor@gmail.com"
                                className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-all duration-300 flex items-center tracking-wide"
                            >
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                                </svg>
                                CONTACTARME
                            </a>
                        </div>
                    </div>

                    {/* Image Column - Aparece segundo en móvil */}
                    <div className="lg:w-2/5 order-2 lg:order-none relative lg:sticky lg:top-16 lg:h-[calc(100vh-8rem)] flex items-center justify-center">
                        <div className="relative z-10 rounded-lg overflow-hidden transform transition-all duration-500 hover:scale-[1.01]">
                            <Image
                                src={home1}
                                alt="Carlos Armando Boyzo"
                                width={400}
                                height={450}
                                className="w-full object-fill"
                                priority
                            />
                        </div>
                        <div className="absolute -bottom-4 -left-4 w-24 h-24 bg-blue-600 rounded-full blur-2xl opacity-20 dark:opacity-30 z-0"></div>
                        <div className="absolute -top-4 -right-4 w-32 h-32 bg-purple-600 rounded-full blur-2xl opacity-20 dark:opacity-30 z-0"></div>
                    </div>
                </div>
            </main>
        </div>
    );
}