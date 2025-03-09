import React from 'react';

export default function Manifesto() {
  const sections = [
    {
      id: 'introduction',
      title: 'Manifesto of the Temporal Creator',
      excerpt: 'Harmony in Innovation and Connection',
      content: [
        "The Temporal Creator sees technology as a fundamental language, a force that shapes our interaction and understanding of the world. They commit to mastering this language, exploring and revealing its capacity to mold our reality.",
        "In their journey, the Temporal Creator perceives each technological tool as a double-edged sword: a sea of possibilities and, simultaneously, a source of dependency. They immerse themselves in understanding these tools, deciphering their secrets with a critical and universal perspective.",
        "Each advancement becomes a new challenge for the Temporal Creator, driving them to expand their technological and political literacy, and to deeply understand the interconnection of our digital world with society.",
        "The Temporal Creator deconstructs digital experiences, examining each interaction and interface as part of a broader network of collective understanding, seeking to comprehend and decipher the hidden mysteries behind each dialogue between human and machine.",
        "Conscious of technology's impact on our social and cultural network, the Temporal Creator approaches each project as an opportunity to understand and transform, seeking a balance that respects individual autonomy and strengthens human interaction.",
        "In designing and coding, the Temporal Creator seeks a balance that respects individuality while strengthening the bonds in the network of human interaction, conscious of the delicate power of their creations.",
        "The Temporal Creator redefines the concept of 'machine', seeing beyond devices and algorithms, and recognizing the network of connections, interactions, and relationships that give life to the digital experience, uniting technology, creativity, and humanity.",
        "Observing the continuous flow between creation and consumption, the Temporal Creator acts with agility and consideration, always seeking to enrich and balance the digital experience, ensuring that each intervention strengthens the bonds of our common network.",
        "Nourished by knowledge from various disciplines, the Temporal Creator integrates strategies and methods to innovate in the interaction with digital and physical reality, expanding the connectivity and resonance of the universal network.",
        "The Temporal Creator understands technology's power to influence the psychological and social network. They commit to conscious and responsible use, seeking to strengthen and enrich this network, promoting a positive and cohesive impact.",
        "As an ethical custodian of technology, the Temporal Creator values each exploration of vulnerability as an opportunity to weave stronger, educate, and improve, contributing to a more secure and reliable digital network."
      ],
      conclusion: "The Temporal Creator, in their extended journey, positions themselves at the intersection of technology, art, and ethics. With each project, they seek not only to innovate but also to weave connections, inspire, and transform, strengthening the threads that unite our digital and human cosmos in a network of knowledge, creation, and shared responsibility."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 font-roboto-condensed pt-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-2">
          
          <h1 className="inline-block mb-4 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium tracking-wide">
            MANIFIESTO
          </h1>
        
        </div>

        {/* Main Content */}
        <article className="bg-white/80 dark:bg-gray-800/50 rounded-xl shadow-md overflow-hidden">
          <div className="p-6 sm:p-10">
            {/* Article Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
              <div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white tracking-tight mb-2">
                  {sections[0].title}
                </h2>
                <p className="text-xl text-blue-600 dark:text-blue-400 tracking-wide">
                  {sections[0].excerpt}
                </p>
              </div>
              <div className="text-right">
                <time className="text-sm text-gray-500 dark:text-gray-400 tracking-wide">
                  December 21, 2024
                </time>
              </div>
            </div>

            {/* Content with visual separator */}
            <div className="relative">
              <div className="absolute left-[24px] top-0 bottom-0 w-[2px] bg-gradient-to-b from-blue-500/80 via-indigo-500/80 to-purple-500/80 dark:from-blue-500/50 dark:via-indigo-500/50 dark:to-purple-500/50"></div>
              
              <div className="space-y-8 text-gray-700 dark:text-gray-300">
                {sections[0].content.map((paragraph, index) => (
                  <div key={index} className="flex gap-8 group">
                    <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                      <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-400 font-bold text-sm border border-blue-200 dark:border-blue-800 shadow-sm group-hover:scale-110 transition-transform">
                        {(index + 1).toString().padStart(2, '0')}
                      </span>
                    </div>
                    <p className="leading-relaxed tracking-wide">{paragraph}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Conclusion */}
            <div className="mt-16 p-8 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/10 dark:to-indigo-900/10 rounded-xl border-l-4 border-blue-500 dark:border-blue-600">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Conclusión</h3>
              <p className="text-gray-700 dark:text-gray-300 italic tracking-wide leading-relaxed">
                {sections[0].conclusion}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
