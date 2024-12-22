import React from 'react';

export default function ServicesPage() {
  const services = [
    {
      title: "UX Design & Research",
      items: [
        "User Experience Research",
        "User Interface Design",
        "Prototyping and Wireframing",
        "Usability Testing",
        "Design Systems Creation",
        "Mobile and Web UI/UX Optimization"
      ],
      tags: ["UX Design", "Research", "Usability"]
    },
    {
      title: "Front-End Development",
      items: [
        "React.js and React Native Development",
        "Responsive Web Design",
        "Performance Optimization",
        "Integration with APIs",
        "Cross-Browser Compatibility",
        "Component-Based Architecture"
      ],
      tags: ["Front-End", "React", "Development"]
    },
    {
      title: "Creative Digital Projects",
      items: [
        "Interactive Digital Art",
        "Motion Graphics with Code",
        "3D Web Experiences",
        "Generative Design Systems",
        "Custom Animations",
        "Projection Mapping"
      ],
      tags: ["Digital Art", "Creative", "Interactive"]
    },
    {
      title: "Workshops & Education",
      items: [
        "1-on-1 UX Design Coaching",
        "Workshops on React and JavaScript",
        "Digital Art and Creative Coding Training",
        "Custom Training Programs for Teams"
      ],
      tags: ["Education", "Coaching", "Training"]
    }
  ];

  return (
    <div className="min-h-screen ">
      <div className="max-w-3xl mx-auto px-6 sm:px-8 lg:px-10 py-16">
        {/* Header */}
        <header className="mb-14 bg-white text-gray-900 rounded-lg  p-10">
          <h1 className="text-4xl font-extrabold">My Services</h1>
          <p className="mt-4 text-lg">
            Delivering tailored solutions with expertise in design, development, and creativity.
          </p>
        </header>

        {/* Services List */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {services.map((service) => (
            <article
              key={service.title}
              className="bg-white rounded-lg  hover: transition-shadow duration-300"
            >
              <div className="p-6">
                {/* Service Title */}
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  {service.title}
                </h2>

                {/* Service Items */}
                <ul className="space-y-3 text-gray-700 mb-4">
                  {service.items.map((item, index) => (
                    <li key={index} className="flex items-start">
                      <span className="mr-2 text-gray-500">✔</span>
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
        <footer className="mt-16 bg-white text-gray-900 rounded-lg  p-10">
          <h2 className="text-3xl font-bold mb-4">Get in Touch</h2>
          <div className="space-y-3 text-lg">
            <p className="flex items-center">
              <span className="mr-3">📧</span>
              <a
                href="mailto:carlosboyzo@gmail.com"
                className="underline hover:text-blue-500 transition-colors"
              >
                carlosboyzo@gmail.com
              </a>
            </p>
            <p className="flex items-center">
              <span className="mr-3">🔗</span>
              <a
                href="https://www.linkedin.com/in/carlosboyzo/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline hover:text-blue-500 transition-colors"
              >
                LinkedIn
              </a>
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
