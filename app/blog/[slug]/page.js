import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPost } from "@/lib/posts";
import { formatDate } from "@/lib/format";

// Statik generatsiya uchun barcha slug'lar
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// Har bir maqola uchun SEO metama'lumotlari
export async function generateMetadata({ params }) {
  const { slug } = await params;
  try {
    const post = await getPost(slug);
    return {
      title: post.title,
      description: post.description,
    };
  } catch {
    return {};
  }
}

export default async function PostPage({ params }) {
  const { slug } = await params;

  let post;
  try {
    post = await getPost(slug);
  } catch {
    notFound();
  }

  return (
    <article className="article">
      <div className="article-header">
        <Link href="/" className="back-link">
          ← orqaga
        </Link>
        <h1>{post.title}</h1>
        <div className="post-meta">
          <span>{formatDate(post.date)}</span>
          <span>{post.readingTime}</span>
        </div>
        {post.tags.length > 0 && (
          <div className="tags">
            {post.tags.map((t) => (
              <span key={t} className="tag">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: post.contentHtml }}
      />
    </article>
  );
}
