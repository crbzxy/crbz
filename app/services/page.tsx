import React from 'react';
import Link from 'next/link';

export default function ServicesPage() {
  const services = [
    {
      title: "Live / Visuals",
      items: [
        "Live Visuals & VJ with TouchDesigner",
        "Audio-Reactive",
        "Live 3D Cameras",
        "Live Footage",
        "Pre-made / Looped Visuals",
        "Projection Mapped Visuals",
        "Artworks"
      ],
      tags: ["Performance", "Visual", "Real-time"]
    },
    {
      title: "Installations",
      items: [
        "Interactive Projections",
        "Motion Reactive",
        "Audio Reactive",
        "Live 3D Cameras or Footage",
        "Projection Mapped Installations"
      ],
      tags: ["Interactive", "Installation", "Spatial"]
    },
    {
      title: "Teaching",
      items: [
        "1-on-1 Private Tutoring for TouchDesigner",
        "TouchDesigner Workshops (Coming Soon)"
      ],
      tags: ["Education", "TouchDesigner"]
    },
    {
      title: "Other Services",
      items: [
        "Please contact for more information"
      ],
      tags: ["Custom", "Consulting"]
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Header */}
        <header className="mb-12 bg-white rounded-lg shadow-sm p-8">
          <h1 className="text-4xl font-bold text-gray-900">Services</h1>
          <p className="mt-4 text-gray-600">
            Exploring the intersection of technology, art, and interactive experiences
          </p>
        </header>

        {/* Services List */}
        <div className="space-y-8">
          {services.map((service) => (
            <article 
              key={service.title} 
              className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="p-8">
                {/* Service Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {service.title}
                </h2>

                {/* Service Items */}
                <ul className="space-y-4 text-gray-700 mb-6">
                  {service.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-3 text-gray-400">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* Tags */}
                <div className="flex flex-wrap gap-2">
                  {service.tags.map((tag) => (
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
          ))}
        </div>

        {/* Contact Section */}
        <footer className="mt-12 bg-white rounded-lg shadow-sm p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Get in Touch</h2>
          <div className="space-y-4 text-gray-700">
            <p className="flex items-center">
              <span className="mr-3">📧</span>
              <a 
                href="mailto:nicholaspjm@gmail.com" 
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                nicholaspjm@gmail.com
              </a>
            </p>
            <p className="flex items-center">
              <span className="mr-3">📱</span>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-gray-900 hover:text-gray-600 transition-colors"
              >
                Instagram
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}