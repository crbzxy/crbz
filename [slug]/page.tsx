import { getPostBySlug } from "@/lib/posts";

export default async function PostPage({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug);

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="text-gray-500">{post.date}</p>
      <div className="prose mt-6" dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
    </div>
  );
}
