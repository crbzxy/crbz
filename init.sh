#!/bin/bash

set -e # Detiene el script si hay un error

echo "🚀 Configurando Blog en Next.js basado en Markdown..."

# Definir rutas
ROOT_DIR=$(pwd)
BLOG_DIR="$ROOT_DIR/app/blog"
LIB_DIR="$BLOG_DIR/lib"
POSTS_DIR="$BLOG_DIR/posts"

# Crear estructura de carpetas
echo "📂 Creando estructura de archivos..."
mkdir -p "$LIB_DIR"
mkdir -p "$POSTS_DIR/primer-post"

# Instalar dependencias necesarias
echo "📦 Instalando dependencias..."
npm install gray-matter remark remark-html fs path

# Crear un post de ejemplo
echo "✍ Creando post de ejemplo..."
cat > "$POSTS_DIR/primer-post/content.md" <<EOL
---
title: "Mi Primer Post"
date: "$(date +%Y-%m-%d)"
description: "Este es un post de prueba en Markdown."
readTime: "3 min"
tags: ["Next.js", "Markdown", "Blog"]
image: ""
---

# Bienvenido a mi Blog

Este es un **post** escrito en _Markdown_. 🚀
EOL

# Crear función para leer los posts (lib/posts.ts)
echo "📝 Creando lógica para leer archivos Markdown..."
cat > "$LIB_DIR/posts.ts" <<EOL
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'app/blog/posts');

export function getPosts() {
  const folders = fs.readdirSync(postsDirectory).filter(folder => 
    fs.statSync(path.join(postsDirectory, folder)).isDirectory()
  );

  return folders.map(folder => {
    const filePath = path.join(postsDirectory, folder, 'content.md');
    if (!fs.existsSync(filePath)) return null;

    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data } = matter(fileContent);
    return {
      id: folder,
      title: data.title || 'Sin título',
      excerpt: data.description || 'Sin descripción.',
      date: data.date || new Date().toISOString().split('T')[0],
      readTime: data.readTime || '3 min',
      tags: data.tags || [],
      image: data.image || null,
    };
  }).filter(Boolean).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}
EOL

# Crear página principal del blog (app/blog/page.tsx)
echo "🖥 Creando página de lista de posts..."
cat > "$BLOG_DIR/page.tsx" <<EOL
import Link from 'next/link';
import { getPosts } from '@/app/blog/lib/posts';

export default function BlogPage() {
  const posts = getPosts();

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-3xl font-bold mb-6'>📖 Blog</h1>
      {posts.length === 0 ? (
        <p className='text-gray-500'>No hay posts disponibles.</p>
      ) : (
        <ul className='space-y-6'>
          {posts.map(post => (
            <li key={post.id} className='border-b pb-4'>
              <Link href={\`/blog/\${post.id}\`} className='text-xl font-semibold text-blue-600 hover:underline'>
                {post.title}
              </Link>
              <p className='text-gray-500 text-sm'>{post.date} - {post.readTime}</p>
              <p className='text-gray-700'>{post.excerpt}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
EOL

# Crear página de post individual (app/blog/[slug]/page.tsx)
echo "📄 Creando página para mostrar cada post..."
mkdir -p "$BLOG_DIR/[slug]"
cat > "$BLOG_DIR/[slug]/page.tsx" <<EOL
import { getPosts } from '@/app/blog/lib/posts';
import { notFound } from 'next/navigation';

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPosts().find(p => p.id === params.slug);
  if (!post) return notFound();

  return (
    <div className='max-w-3xl mx-auto p-6'>
      <h1 className='text-3xl font-bold'>{post.title}</h1>
      <p className='text-gray-500'>{post.date} - {post.readTime}</p>
      <p className='text-gray-700'>{post.excerpt}</p>
    </div>
  );
}
EOL

# Mensaje final
echo "✅ Blog creado con éxito! 🎉"
echo "🔥 Ejecuta 'npm run dev' para verlo en acción."