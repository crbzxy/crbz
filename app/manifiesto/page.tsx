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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="mb-12 bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900">Manifesto</h1>
          
        </header>

        {/* Main Content */}
        <article className="bg-white rounded-lg shadow-sm">
          <div className="p-8">
            {/* Article Header */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
              <time>December 21, 2024</time>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {sections[0].title}
            </h2>
            <p className="text-gray-600 mb-8 text-lg">
              {sections[0].excerpt}
            </p>

            {/* Content */}
            <div className="space-y-6 text-gray-700">
              {sections[0].content.map((paragraph, index) => (
                <div key={index} className="flex gap-4">
                  <span className="flex-shrink-0 text-gray-400 font-medium">
                    {(index + 1).toString().padStart(2, '0')}
                  </span>
                  <p className="leading-relaxed">{paragraph}</p>
                </div>
              ))}
            </div>

            {/* Conclusion */}
            <blockquote className="mt-12 p-6 bg-gray-50 border-l-4 border-gray-900 text-gray-700 italic">
              {sections[0].conclusion}
            </blockquote>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {['Philosophy', 'Technology', 'Innovation', 'Ethics'].map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}