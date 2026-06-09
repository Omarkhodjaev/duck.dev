import Link from "next/link";
import { getAllPosts } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/config";

export default function Home() {
  const posts = getAllPosts();

  return (
    <>
      <section className="hero">
        <div className="comment">{"// dasturlash haqida yozib boraman"}</div>
        <h1>{siteConfig.name}</h1>
        <p>{siteConfig.description}</p>
      </section>

      {posts.length === 0 ? (
        <p style={{ color: "var(--text-dim)" }}>
          Hozircha maqolalar yo&apos;q. <code>posts/</code> papkasiga{" "}
          <code>.md</code> fayl qo&apos;shing.
        </p>
      ) : (
        <ul className="post-list">
          {posts.map((post) => (
            <li key={post.slug} className="post-item">
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <div className="post-meta">
                <span>{formatDate(post.date)}</span>
                <span>{post.readingTime}</span>
              </div>
              {post.description && (
                <p className="post-excerpt">{post.description}</p>
              )}
              {post.tags.length > 0 && (
                <div className="tags">
                  {post.tags.map((t) => (
                    <span key={t} className="tag">
                      #{t}
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
