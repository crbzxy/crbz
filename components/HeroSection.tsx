import Image from "next/image";
import Link from "next/link";
import { Inter } from "next/font/google";

// Configuración de fuente Inter (más minimalista)
const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
  variable: "--font-inter",
});

export default function MinimalistHeroSection() {
  return (
    <div className={`min-h-screen bg-white dark:bg-gray-950 ${inter.className}`}>
      <header className="container mx-auto px-6 py-6 flex justify-between items-center">
        <div className="text-xl font-bold">CB</div>
        <nav>
          <Link href="/contact" className="text-sm text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400">
            contact me
          </Link>
        </nav>
      </header>
      
      <main className="container mx-auto px-6 py-16">
        <div className="flex flex-col md:flex-row gap-16">
          {/* Content Column */}
          <div className="md:w-1/2 space-y-8">
            <h1 className="text-4xl md:text-5xl font-medium text-gray-900 dark:text-white space-y-1">
              <div>UX & Development</div>
              <div className="text-gray-400 dark:text-gray-500">engineer</div>
            </h1>
            
            <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
              I'm a Mexican creative developer specialized in user experience, frontend solutions and internal systems optimization.
            </p>
            
            <div className="pt-4">
              <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                RECENT PROJECTS
              </h2>
              <ul className="space-y-3">
                <li className="text-gray-800 dark:text-gray-200">Business Apps Optimization</li>
                <li className="text-gray-800 dark:text-gray-200">Design System Implementation</li>
                <li className="text-gray-800 dark:text-gray-200">Adaptive Workflows</li>
                <li className="text-gray-800 dark:text-gray-200">Enterprise UX Solutions</li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                SKILLS & TECHNOLOGIES
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                UX/UI DESIGN / DESIGN SYSTEMS / FRONTEND (REACT, REACT NATIVE) / BACKEND (NODE.JS, PYTHON, GO) / DATABASE / CYBERSECURITY / SOFTWARE ARCHITECTURE / AGILE & BUSINESS OPTIMIZATION
              </p>
            </div>
            
            <div>
              <h2 className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-4">
                INTERESTS
              </h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm">
                ART / MUSIC / CONTEMPORARY DESIGN / CODING / VIDEOGAMES / FAMILY
              </p>
            </div>
          </div>
          
          {/* Image Column - simplified with neutral styling */}
          <div className="md:w-1/2 flex items-center justify-center">
            <div className="w-full max-w-md h-96 relative bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden">
              {/* Replace 'profileImage' with your actual image */}
              <Image 
                src="/profile-image.jpg" 
                alt="Carlos Boyzo Oregon"
                layout="fill"
                objectFit="cover"
                className="mix-blend-multiply dark:mix-blend-normal opacity-90"
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Minimal footer */}
      <footer className="container mx-auto px-6 py-8 mt-16 border-t border-gray-100 dark:border-gray-800">
        <div className="flex justify-center space-x-6">
          <Link href="https://linkedin.com/" className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">LinkedIn</span>
            <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.335 18.339H15.67v-4.177c0-.996-.02-2.278-1.39-2.278-1.389 0-1.601 1.084-1.601 2.205v4.25h-2.666V9.75h2.56v1.17h.035c.358-.674 1.228-1.387 2.528-1.387 2.7 0 3.2 1.778 3.2 4.091v4.715zM7.003 8.575a1.546 1.546 0 01-1.548-1.549 1.548 1.548 0 111.547 1.549zm1.336 9.764H5.666V9.75H8.34v8.589zM19.67 3H4.329C3.593 3 3 3.58 3 4.297v15.406C3 20.42 3.594 21 4.328 21h15.338C20.4 21 21 20.42 21 19.703V4.297C21 3.58 20.4 3 19.666 3h.003z"/>
            </svg>
          </Link>
        </div>
      </footer>
    </div>
  );
}