import fs from "fs";
import path from "path";
import matter from "gray-matter";
import readingTime from "reading-time";
import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeHighlight from "rehype-highlight";
import rehypeStringify from "rehype-stringify";

const postsDirectory = path.join(process.cwd(), "posts");

// Markdown matnni saytdagidek HTMLga aylantiradi.
// Preview ham, maqola sahifasi ham aynan shu funksiyadan foydalanadi.
export async function markdownToHtml(content) {
  const processed = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSlug)
    .use(rehypeHighlight)
    .use(rehypeStringify)
    .process(content || "");
  return String(processed);
}

// Barcha maqola fayllari (.md) ro'yxatini oladi
function getPostFiles() {
  if (!fs.existsSync(postsDirectory)) return [];
  return fs.readdirSync(postsDirectory).filter((f) => f.endsWith(".md"));
}

// Slug -> .md fayl nomidan kengaytmasiz qism
export function getAllSlugs() {
  return getPostFiles().map((file) => file.replace(/\.md$/, ""));
}

// Bitta maqolaning metama'lumotlari (frontmatter)
function readPostMeta(slug) {
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
}

// Ro'yxat uchun: barcha maqolalar, sanasi bo'yicha kamayish tartibida
export function getAllPosts() {
  return getAllSlugs()
    .map((slug) => {
      const { content, ...meta } = readPostMeta(slug);
      return meta;
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
}

// Bitta maqola: HTMLga aylantirilgan kontent bilan
export async function getPost(slug) {
  const meta = readPostMeta(slug);
  const contentHtml = await markdownToHtml(meta.content);
  return { ...meta, contentHtml };
}

// Barcha teglar
export function getAllTags() {
  const tags = new Set();
  getAllPosts().forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return [...tags].sort();
}
