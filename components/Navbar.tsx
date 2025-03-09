"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Roboto_Condensed } from "next/font/google";


// Carga la fuente Roboto Condensed
const robotoCondensed = Roboto_Condensed({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-roboto-condensed",
});

interface NavItem {
  name: string;
  href: string;
}

const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  const navItems: NavItem[] = [
    { name: "Services", href: "/services" },
    { name: "Manifesto", href: "/manifiesto" },
    { name: "Poemario", href: "/poemario" },
    { name: "Blog", href: "/blog" },
  ];

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);
  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <nav
      className={`${robotoCondensed.variable} font-sans fixed top-0 w-full z-[1000] transition-all duration-300 ${
        scrolled
          ? "bg-white/95 dark:bg-gray-900 backdrop-blur-md shadow-md py-2 dark:text-white"
          : "bg-white/90 dark:bg-gray-950 py-4 md:py-6 dark:text-white"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            onClick={closeMenu}
          >
            CARLOS BOYZO
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`relative tracking-wide transition-all duration-200 px-3 py-2 rounded-md font-medium text-sm uppercase font-sans ${
                isActive(item.href)
                  ? "text-blue-600 font-bold after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-1/2 after:h-0.5 after:bg-blue-600"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500 hover:after:content-[''] hover:after:absolute hover:after:bottom-0 hover:after:left-1/2 hover:after:-translate-x-1/2 hover:after:w-1/2 hover:after:h-0.5 hover:after:bg-blue-300"
              }`}
            >
              {item.name}
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center">
          <button
            onClick={toggleMenu}
            type="button"
            className="rounded-md p-2 inline-flex items-center justify-center text-gray-600 dark:text-white hover:text-blue-600 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
            aria-expanded={isOpen}
          >
            <span className="sr-only">Abrir menú principal</span>
            {isOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-60 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-2 space-y-1 border-t border-gray-200 dark:border-gray-700">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`block w-full py-3 text-base font-sans ${
                isActive(item.href)
                  ? "text-blue-600 font-bold"
                  : "text-gray-600 dark:text-gray-300 hover:text-blue-500"
              }`}
              onClick={closeMenu}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
