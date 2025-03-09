import Link from 'next/link';
import { getPosts } from '@/app/blog/lib/posts';

interface Post {
  id: string;
  date: string;
  readTime: string;
  title: string;
  excerpt: string;
  tags: string[];
  image: string | null;
}

export default function BlogPage() {
  const posts = getPosts().filter((post): post is Post => post !== null);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 font-roboto-condensed pt-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="inline-block mb-4 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium tracking-wide">
            📚 Pensamientos & Reflexiones
          </h1>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 tracking-tight">
            Blog
          </h1>
          <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 tracking-wide">
            Explorando las intersecciones entre tecnología, diseño y creatividad digital.
          </p>
        </div>

        {/* Post List */}
        {posts.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 dark:text-gray-400 text-lg">
              No hay entradas de blog disponibles por el momento.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {posts.map((post) => post && (
              <article
                key={post.id}
                className="bg-white/50 dark:bg-gray-800/50 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                <Link href={`/blog/${post.id}`} className="block">
                  <div className="p-6 sm:p-8 flex flex-col h-full">
                    {/* Post Header */}
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
                      <time className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        {post.date}
                      </time>
                      <span className="text-gray-300 dark:text-gray-600">•</span>
                      <span className="flex items-center">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {post.readTime} de lectura
                      </span>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 tracking-wide">
                      {post.title}
                    </h2>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-300 mb-6 line-clamp-2">
                      {post.excerpt}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium tracking-wide"
                        >
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>

                    {/* Read More */}
                    <div className="mt-6 text-blue-600 dark:text-blue-400 font-medium flex items-center">
                      Leer más
                      <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                    </div>
                  </div>
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
