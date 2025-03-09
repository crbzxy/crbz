import { getPostBySlug } from '@/app/blog/lib/posts';
import { notFound } from 'next/navigation';
import { Roboto_Condensed } from 'next/font/google';

// Configuración de la fuente Roboto Condensed
const robotoCondensed = Roboto_Condensed({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  display: 'swap',
  variable: '--font-roboto-condensed',
});

// Skip type checking with "any" to work around Next.js 15 type issues
export default async function PostPage(props: any) {
  const { params } = props;
  console.log("Params recibidos:", params);
  
  if (!params?.slug) return notFound();

  const post = await getPostBySlug(params.slug);
  console.log("Post obtenido:", post);

  if (!post) return notFound();

  return (
    <div className={`min-h-screen bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 ${robotoCondensed.className} mt-16`}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <article className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
          <header className="mb-6">
            <div className="inline-block mb-4 px-3 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-full text-sm font-medium tracking-wide">
              📝 Blog Post
            </div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
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
          </header>

          <section className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg space-y-6">
            <p>{post.excerpt}</p>
            {post.contentHtml ? (
              <div
                className="prose dark:prose-invert max-w-none tracking-wide"
                dangerouslySetInnerHTML={{ __html: post.contentHtml }}
              />
            ) : (
              <p className="text-gray-500 dark:text-gray-400">Contenido no disponible.</p>
            )}
          </section>

          {post.tags && post.tags.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-gray-100 dark:border-gray-700 pt-4">
              {post.tags.map((tag: string) => (
                <span key={tag} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-xs font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </article>
      </div>
    </div>
  );
}