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
            {person.name.toUpperCase()}
          </Link>

          <div className="hidden md:flex items-center space-x-6">
            {routes
              .filter((route) => route.href !== '/')
              .map((route) => (
                <Link
                  key={route.href}
                  href={route.href}
                  variant="nav"
                >
                  {route.name}
                </Link>
              ))}
          </div>
        </div>
      </nav>
    </header>
  );
}

