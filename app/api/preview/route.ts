import { NextResponse } from "next/server";
import { markdownToHtml } from "@/lib/posts";

// Jonli ko'rinish (preview) uchun: markdown matnni HTMLga aylantiradi.
export async function POST(request: Request) {
  try {
    const { content } = (await request.json()) as { content?: string };
    const html = await markdownToHtml(content || "");
    return NextResponse.json({ html });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 400 });
  }
}
