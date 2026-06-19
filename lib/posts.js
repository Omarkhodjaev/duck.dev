import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import readingTime from "reading-time";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

// Maqolalar saqlanadigan papka — butun loyiha bo'ylab yagona manba.
export const postsDirectory = path.join(process.cwd(), "posts");

// Markdown -> HTML quvuri bir marta quriladi va qayta ishlatiladi.
const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeHighlight)
  .use(rehypeStringify);

// Markdown matnni saytdagidek HTMLga aylantiradi.
// Preview ham, maqola sahifasi ham aynan shu funksiyadan foydalanadi.
export async function markdownToHtml(content) {
  const processed = await processor.process(content || "");
  return String(processed);
}

// Barcha .md fayllar ro'yxati (slug ko'rinishida).
// cache(): bitta so'rov ichida disk faqat bir marta o'qiladi.
export const getAllSlugs = cache(() => {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
});

// Bitta maqolaning metama'lumotlari (frontmatter) + xom matni.
const readPostMeta = cache((slug) => {
  const fullPath = path.join(postsDirectory, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    date: data.date || null,
    description: data.description || "",
    tags: data.tags || [],
    readingTime: readingTime(content).text,
    content,
  };
});

// Ro'yxat uchun: barcha maqolalar, sanasi bo'yicha kamayish tartibida.
// localeCompare null'ga ham bardoshli (sanasiz maqolalar oxirida turadi).
export const getAllPosts = cache(() =>
  getAllSlugs()
    .map((slug) => {
      const { content, ...meta } = readPostMeta(slug);
      return meta;
    })
    .sort((a, b) => (b.date || "").localeCompare(a.date || ""))
);

// Bitta maqola: HTMLga aylantirilgan kontent bilan.
export async function getPost(slug) {
  const meta = readPostMeta(slug);
  const contentHtml = await markdownToHtml(meta.content);
  return { ...meta, contentHtml };
}

// Barcha teglar (keshlangan getAllPosts'dan — disk qayta o'qilmaydi).
export const getAllTags = cache(() => {
  const tags = new Set();
  getAllPosts().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return [...tags].sort();
});
