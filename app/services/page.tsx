import React from 'react';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      title: "UX Design & Research",
      description: "Creación de experiencias digitales centradas en el usuario que resuelven problemas reales y generan valor.",
      items: [
        "User Experience Research",
        "User Interface Design",
        "Prototyping and Wireframing",
        "Usability Testing",
        "Design Systems Creation",
        "Mobile and Web UI/UX Optimization"
      ],
      tags: ["UX Design", "Research", "Usability"],
      icon: "📱",
    },
    {
      title: "Front-End Development",
      description: "Desarrollo de interfaces y aplicaciones web modernas con las tecnologías más actuales del mercado.",
      items: [
        "React.js and React Native Development",
        "Responsive Web Design",
        "Performance Optimization",
        "Integration with APIs",
        "Cross-Browser Compatibility",
        "Component-Based Architecture"
      ],
      tags: ["Front-End", "React", "Development"],
      icon: "💻",
    },
    {
      title: "Creative Digital Projects",
      description: "Proyectos digitales innovadores que combinan estética, interactividad y experiencias inmersivas.",
      items: [
        "Interactive Digital Art",
        "Motion Graphics with Code",
        "3D Web Experiences",
        "Generative Design Systems",
        "Custom Animations",
        "Projection Mapping"
      ],
      tags: ["Digital Art", "Creative", "Interactive"],
      icon: "🎨",
    },
    {
      title: "Workshops & Education",
      description: "Capacitación especializada para equipos y profesionales que quieren mejorar sus habilidades digitales.",
      items: [
        "1-on-1 UX Design Coaching",
        "Workshops on React and JavaScript",
        "Digital Art and Creative Coding Training",
        "Custom Training Programs for Teams"
      ],
      tags: ["Education", "Coaching", "Training"],
      icon: "📚",
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 font-roboto-condensed pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Servicios
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 tracking-wide">
            Soluciones personalizadas con experiencia en diseño, desarrollo y creatividad.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {services.map((service) => (
            <article
              key={service.title}
              className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
            >
              <div className="p-6 sm:p-8 flex flex-col h-full">
                {/* Service Header */}
                <div className="flex items-center mb-4">
                  <span className="text-2xl p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg mr-4 text-blue-600 dark:text-blue-400">
                    {service.icon}
                  </span>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white tracking-wide">
                    {service.title}
                  </h2>
                </div>
                
                {/* Service Description */}
                <p className="text-gray-600 dark:text-gray-300 mb-6 tracking-wide">
                  {service.description}
                </p>

                {/* Service Items */}
                <ul className="space-y-3 text-gray-700 dark:text-gray-300 mb-6 flex-grow">
                  {service.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-blue-500 dark:text-blue-400 font-medium">✦</span>
                      <span className="tracking-wide">{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                  {service.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Contact Section */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl p-8 sm:p-10">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">Contáctame</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 tracking-wide">
              ¿Interesado en colaborar? Escríbeme para discutir tu proyecto y encontrar la mejor solución.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
              <a
                href="mailto:carlosboyzo@gmail.com"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-300 shadow-md hover:shadow-lg flex items-center tracking-wide w-full sm:w-auto justify-center"
              >
                📩 Envíame un Email
              </a>
              
              <Link
                href="/portfolio"
                className="px-6 py-3 border border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-500 text-gray-700 dark:text-gray-200 hover:text-blue-600 dark:hover:text-blue-400 font-medium rounded-lg transition-all duration-300 flex items-center tracking-wide w-full sm:w-auto justify-center"
              >
                📂 Ver Portafolio
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
