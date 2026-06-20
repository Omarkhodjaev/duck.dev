import fs from "fs";
import path from "path";
import { cache } from "react";
import matter from "gray-matter";
import { markdownToHtml } from "./posts";
import { youtubeId } from "./youtube";

// Bitta kursning metama'lumotlari (frontmatter).
export interface CourseMeta {
  slug: string;
  title: string;
  date: string | null;
  description: string;
  tags: string[];
  youtube: string; // 11 belgilik YouTube video ID
  order: number; // ro'yxatdagi tartib (kichikdan kattaga)
}

interface RawCourse extends CourseMeta {
  content: string;
}

// To'liq kurs: HTMLga aylantirilgan tavsif bilan.
export interface Course extends CourseMeta {
  contentHtml: string;
}

// Kurslar saqlanadigan papka — maqolalardan alohida.
export const coursesDirectory = path.join(process.cwd(), "courses");

// Barcha .md kurs fayllari (slug ko'rinishida).
export const getAllCourseSlugs = cache((): string[] => {
  if (!fs.existsSync(coursesDirectory)) return [];
  return fs
    .readdirSync(coursesDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
});

// Bitta kursning frontmatter'i + xom matni.
const readCourseMeta = cache((slug: string): RawCourse => {
  const fullPath = path.join(coursesDirectory, `${slug}.md`);
  const raw = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(raw);
  return {
    slug,
    title: data.title || slug,
    date: data.date || null,
    description: data.description || "",
    tags: data.tags || [],
    youtube: youtubeId(data.youtube),
    order: typeof data.order === "number" ? data.order : 999,
    content,
  };
});

// Ro'yxat uchun: barcha kurslar — avval `order` bo'yicha, so'ng sana bo'yicha.
export const getAllCourses = cache((): CourseMeta[] =>
  getAllCourseSlugs()
    .map((slug) => {
      const { content, ...meta } = readCourseMeta(slug);
      return meta;
    })
    .sort(
      (a, b) =>
        a.order - b.order || (b.date || "").localeCompare(a.date || "")
    )
);

// Bitta kurs: HTMLga aylantirilgan tavsif bilan.
export async function getCourse(slug: string): Promise<Course> {
  const { content, ...meta } = readCourseMeta(slug);
  const contentHtml = await markdownToHtml(content);
  return { ...meta, contentHtml };
}
