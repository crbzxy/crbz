import Image from "next/image";
import Link from "next/link";
import { Playfair_Display } from "next/font/google";
import { Inter } from "next/font/google";

// Configuración de fuentes
const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-playfair",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

export default function Portfolio() {
  return (
    <div className={`min-h-screen bg-black text-white ${playfair.variable} ${inter.className}`}>
      {/* Header */}
      <header className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="text-sm font-medium">CARLOS BOYZO</div>
        <div className="flex items-center">
          <Link 
            href="/contact" 
            className="text-xs text-blue-400 hover:text-blue-300 mr-4"
          >
            contact me
          </Link>
          <button className="bg-blue-500 hover:bg-blue-400 text-white text-xs px-3 py-1 rounded-full">
            cv
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6">
        {/* Hero Section */}
        <section className="py-16">
          <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold mb-4">
            UX & Experience
            <br />
            engineer
          </h1>
          
          <p className="text-blue-400 mb-16 max-w-xl">
            I'm a Mexican creative developer specialized in user experience, 
            frontend solutions and internal systems optimization.
          </p>
          
          <p className="text-gray-400 mb-8">
            I collaborate with brands and businesses to create effective
            digital solutions focused on user experience.
          </p>
        </section>
        
        {/* Projects Section */}
        <section className="py-4">
          <div className="bg-blue-500 bg-opacity-20 text-blue-400 py-2 px-4 text-sm font-medium mb-6">
            RECENT PROJECTS
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project 1 */}
            <div className="mb-8">
              <div className="bg-gray-900 h-56 mb-3 rounded overflow-hidden">
                <Image 
                  src="/placeholder-project1.jpg" 
                  alt="Business Apps Optimization"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white text-lg">Business Apps Optimization</h3>
            </div>
            
            {/* Project 2 */}
            <div className="mb-8">
              <div className="bg-gray-900 h-56 mb-3 rounded overflow-hidden">
                <Image 
                  src="/placeholder-project2.jpg" 
                  alt="Design System Implementation"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white text-lg">
                <Link href="#" className="text-blue-400 hover:text-blue-300">
                  Design System Implementation
                </Link>
              </h3>
            </div>
            
            {/* Project 3 */}
            <div className="mb-8">
              <div className="bg-gray-900 h-56 mb-3 rounded overflow-hidden">
                <Image 
                  src="/placeholder-project3.jpg" 
                  alt="Adaptive Workflows"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white text-lg">Adaptive Workflows</h3>
            </div>
            
            {/* Project 4 */}
            <div className="mb-8">
              <div className="bg-gray-900 h-56 mb-3 rounded overflow-hidden">
                <Image 
                  src="/placeholder-project4.jpg" 
                  alt="Enterprise UX Solutions"
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-white text-lg">Enterprise UX Solutions</h3>
            </div>
          </div>
        </section>
        
        {/* Skills Section */}
        <section className="py-8">
          <div className="bg-blue-500 bg-opacity-20 text-blue-400 py-2 px-4 text-sm font-medium mb-6">
            SKILLS & TECHNOLOGIES
          </div>
          
          <div className="bg-blue-500 bg-opacity-10 p-6 text-lg">
            <span className="text-gray-400">INTERACTION DESIGN</span> / 
            <span className="text-blue-300"> DESIGN SYSTEM</span> / 
            <span className="text-gray-400"> AGILE</span> / 
            <span className="text-blue-300"> USER FLOWS</span> / 
            <span className="text-gray-400"> HTML, CSS & SASS</span> / 
            <span className="text-blue-300"> USER INTERFACE</span> / 
            <span className="text-gray-400"> DESIGN THINKING</span> / 
            <span className="text-blue-300"> MICROINTERACTIONS</span> / 
            <span className="text-gray-400"> FRONTEND</span> / 
            <span className="text-blue-300"> REACT</span> / 
            <span className="text-gray-400"> BACKEND</span> / 
            <span className="text-blue-300"> NODE.JS</span> / 
            <span className="text-gray-400"> PYTHON</span> / 
            <span className="text-blue-300"> GO</span>
          </div>
        </section>
        
        {/* Interests Section */}
        <section className="py-8">
          <div className="text-blue-400 py-2 px-4 text-sm font-medium mb-6 border-t border-gray-800">
            INTERESTS
          </div>
          
          <div className="bg-gray-900 bg-opacity-50 p-6 text-lg">
            <span className="text-gray-400">MUSIC</span> / 
            <span className="text-blue-400"> CONTEMPORARY DESIGN</span> / 
            <span className="text-gray-400"> CODING</span> / 
            <span className="text-blue-400"> VIDEOGAMES</span> / 
            <span className="text-gray-400"> FAMILY</span>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="container mx-auto px-6 py-12 mt-12">
        <div className="flex justify-start space-x-4">
          <Link href="https://linkedin.com/" className="text-white hover:text-blue-400">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 01-1.548-1.549 1.548 1.548 0 111.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z"/>
            </svg>
          </Link>
          <Link href="https://behance.net/" className="text-white hover:text-blue-400">
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M22 7h-7V5h7v2zm1.726 10c-.442 1.297-2.029 3-5.101 3-3.074 0-5.564-1.729-5.564-5.675 0-3.91 2.325-5.92 5.466-5.92 3.082 0 4.964 1.782 5.375 4.426.078.506.109 1.188.095 2.14H15.97c.13 3.211 3.483 3.312 4.588 2.029h3.168zm-7.686-4h4.965c-.105-1.547-1.136-2.219-2.477-2.219-1.466 0-2.277.768-2.488 2.219zm-9.574 6.988H0V5.021h6.953c5.476.081 5.58 5.444 2.72 6.906 3.461 1.26 3.577 8.061-3.207 8.061zM3 11h3.584c2.508 0 2.906-3-.312-3H3v3zm3.391 3H3v3.016h3.341c3.055 0 2.868-3.016.05-3.016z"/>
            </svg>
          </Link>
        </div>
        
        <div className="flex justify-center mt-12">
          <div className="border border-gray-700 rounded-full p-8 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-black px-4 text-xs text-orange-400">
              CONTACT ME
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </footer>
    </div>
  );
}