// lib/posts.ts
import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// مسیر پوشه مقالات با process.cwd() که روی ورسل دقیق کار می‌کند
const postsDirectory = path.join(process.cwd(), 'content', 'posts');

export interface PostItem {
  slug: string;
  entry: {
    title: string;
    description?: string;
    date?: string;
    coverImage?: string;
    content: string;
  };
}

export function getAllPosts(): PostItem[] {
  // اگر پوشه وجود نداشت، آرایه خالی بدهد و کرش نکند
  if (!fs.existsSync(postsDirectory)) {
    return [];
  }

  const fileNames = fs.readdirSync(postsDirectory);

  const posts = fileNames
    .filter((fileName) => fileName.endsWith('.mdx') || fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.(mdx|md)$/, '');
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, 'utf8');

      // جدا کردن متادیتا (frontmatter) از بدنه متن
      const { data, content } = matter(fileContents);

      return {
        slug,
        entry: {
          title: data.title || slug,
          description: data.description || '',
          date: data.date ? String(data.date) : '',
          coverImage: data.coverImage || null,
          content: content,
        },
      };
    });

  // مرتب‌سازی بر اساس تاریخ (جدیدترین اول)
  return posts.sort((a, b) => {
    if (!a.entry.date || !b.entry.date) return 0;
    return new Date(b.entry.date).getTime() - new Date(a.entry.date).getTime();
  });
}

export function getPostBySlug(slug: string): PostItem | null {
  const mdxPath = path.join(postsDirectory, `${slug}.mdx`);
  const mdPath = path.join(postsDirectory, `${slug}.md`);

  let targetPath = '';
  if (fs.existsSync(mdxPath)) targetPath = mdxPath;
  else if (fs.existsSync(mdPath)) targetPath = mdPath;
  else return null;

  const fileContents = fs.readFileSync(targetPath, 'utf8');
  const { data, content } = matter(fileContents);

  return {
    slug,
    entry: {
      title: data.title || slug,
      description: data.description || '',
      date: data.date ? String(data.date) : '',
      coverImage: data.coverImage || null,
      content,
    },
  };
}
