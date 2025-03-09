import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { remark } from "remark";
import html from "remark-html";

const postsDirectory = path.join(process.cwd(), "app/blog/posts");

export function getPosts() {
  const folders = fs.readdirSync(postsDirectory).filter(folder => 
    fs.statSync(path.join(postsDirectory, folder)).isDirectory()
  );

  return folders.map(folder => {
    const filePath = path.join(postsDirectory, folder, "content.md");
    if (!fs.existsSync(filePath)) return null;

    const fileContent = fs.readFileSync(filePath, "utf-8");
    const { data } = matter(fileContent);
    return {
      id: folder,
      title: data.title || "Sin título",
      excerpt: data.description || "Sin descripción.",
      date: data.date || new Date().toISOString().split("T")[0],
      readTime: data.readTime || "3 min",
      tags: data.tags || [],
      image: data.image || null,
    };
  }).filter(Boolean);
}

export async function getPostBySlug(slug: string) {
  const filePath = path.join(postsDirectory, slug, "content.md");
  if (!fs.existsSync(filePath)) return null;

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data, content } = matter(fileContent);

  const processedContent = await remark().use(html).process(content);
  const contentHtml = processedContent.toString();

  return {
    id: slug,
    title: data.title || "Sin título",
    excerpt: data.description || "Sin descripción.",
    date: data.date || new Date().toISOString().split("T")[0],
    readTime: data.readTime || "3 min",
    tags: data.tags || [],
    contentHtml,
  };
}
