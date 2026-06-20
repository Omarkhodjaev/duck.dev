import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { slugify } from "@/lib/slug";
import { todayISO } from "@/lib/format";
import { getAllSlugs, postsDirectory } from "@/lib/posts";

// Admin formadan keladigan maqola ma'lumotlari.
interface PostPayload {
  title?: string;
  slug?: string;
  description?: string;
  date?: string;
  tags?: string | string[];
  content?: string;
  overwrite?: boolean;
}

// Faqat lokal ishlash (npm run dev) uchun. Jonli saytda fayl yozib bo'lmaydi.
function devOnly(): boolean {
  return process.env.NODE_ENV !== "production";
}

// Mavjud maqolalar ro'yxati (admin panelda ko'rsatish uchun)
export async function GET() {
  if (!devOnly()) {
    return NextResponse.json({ error: "Faqat lokal rejimda" }, { status: 403 });
  }
  return NextResponse.json({ posts: getAllSlugs() });
}

// Yangi maqolani .md fayl sifatida posts/ ga saqlaydi
export async function POST(request: Request) {
  if (!devOnly()) {
    return NextResponse.json(
      { error: "Maqola faqat lokal rejimda (npm run dev) saqlanadi." },
      { status: 403 }
    );
  }

  try {
    const body = (await request.json()) as PostPayload;
    const title = (body.title || "").trim();
    const content = body.content || "";

    if (!title) {
      return NextResponse.json(
        { error: "Sarlavha (title) majburiy." },
        { status: 400 }
      );
    }

    const slug = (body.slug && slugify(body.slug)) || slugify(title);
    if (!slug) {
      return NextResponse.json(
        { error: "Slug yaratib bo'lmadi — sarlavhada lotin harflari bo'lsin." },
        { status: 400 }
      );
    }

    const filePath = path.join(postsDirectory, `${slug}.md`);
    if (!body.overwrite && fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `"${slug}.md" allaqachon mavjud. Boshqa nom tanlang.` },
        { status: 409 }
      );
    }

    // tags: vergul bilan ajratilgan matn -> massiv
    let tags: string[] = [];
    if (typeof body.tags === "string") {
      tags = body.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    } else if (Array.isArray(body.tags)) {
      tags = body.tags;
    }

    const frontmatter = {
      title,
      date: body.date || todayISO(),
      description: (body.description || "").trim(),
      tags,
    };

    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    const fileContents = matter.stringify(content, frontmatter);
    fs.writeFileSync(filePath, fileContents, "utf8");

    return NextResponse.json({
      ok: true,
      slug,
      file: `posts/${slug}.md`,
      url: `/blog/${slug}`,
    });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
