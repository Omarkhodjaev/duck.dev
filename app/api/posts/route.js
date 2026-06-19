import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import matter from "gray-matter";
import { slugify } from "@/lib/slug";

const postsDirectory = path.join(process.cwd(), "posts");

// Faqat lokal ishlash (npm run dev) uchun. Jonli saytda fayl yozib bo'lmaydi.
function devOnly() {
  return process.env.NODE_ENV !== "production";
}

// Mavjud maqolalar ro'yxati (admin panelda ko'rsatish uchun)
export async function GET() {
  if (!devOnly()) {
    return NextResponse.json({ error: "Faqat lokal rejimda" }, { status: 403 });
  }
  if (!fs.existsSync(postsDirectory)) return NextResponse.json({ posts: [] });
  const posts = fs
    .readdirSync(postsDirectory)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""));
  return NextResponse.json({ posts });
}

// Yangi maqolani .md fayl sifatida posts/ ga saqlaydi
export async function POST(request) {
  if (!devOnly()) {
    return NextResponse.json(
      { error: "Maqola faqat lokal rejimda (npm run dev) saqlanadi." },
      { status: 403 }
    );
  }

  try {
    const body = await request.json();
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
    let tags = body.tags || [];
    if (typeof tags === "string") {
      tags = tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean);
    }

    const frontmatter = {
      title,
      date: body.date || new Date().toISOString().slice(0, 10),
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
