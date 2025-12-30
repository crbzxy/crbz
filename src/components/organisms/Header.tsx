import { Link } from '@/src/components/atoms/Link';
import { routes } from '@/src/constants/routes';
import { person } from '@/src/constants/person';

export function Header() {
  return (
    <header className="fixed top-0 w-full z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link
            href="/"
            className="text-xl font-bold tracking-tight text-gray-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
          >
            {person.name}
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {routes.map((route) => (
              <a
                key={route.href}
                href={route.href}
                className="text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 font-medium tracking-wide transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-3 py-2"
              >
                {route.name}
              </a>
            ))}
          </div>
        </div>
      </nav>
    </header>
  );
}
