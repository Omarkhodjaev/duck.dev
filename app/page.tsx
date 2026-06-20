import Link from "next/link";
import { getAllPosts, getAllTags } from "@/lib/posts";
import { formatDate } from "@/lib/format";
import { siteConfig } from "@/lib/config";

interface Feature {
  icon: string;
  title: string;
  text: string;
}

const features: Feature[] = [
  {
    icon: "📝",
    title: "Maqolalar",
    text: "Chuqur, amaliy yozuvlar — tushuntirish bilan, kod bilan.",
  },
  {
    icon: "🧪",
    title: "Tajribalar",
    text: "Kichik demolar, kod parchalari va sinovdan o'tgan g'oyalar.",
  },
  {
    icon: "🌱",
    title: "Eslatmalar",
    text: "O'rganish jarayonidagi qaydlar — qisqa, lekin foydali.",
  },
];

export default function Home() {
  const posts = getAllPosts();
  const tags = getAllTags();

  return (
    <>
      {/* ---------- Hero ---------- */}
      <section className="hero">
        <div className="hero-badge" data-reveal>
          <span className="hero-rings" aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
          <img
            className="hero-logo"
            src="/logo.svg"
            alt=""
            width={84}
            height={84}
          />
        </div>

        <span className="eyebrow" data-reveal>
          {siteConfig.name} · dasturlash blogi
        </span>

        <h1 className="hero-title" data-reveal>
          <span className="line">Kod ortidagi</span>{" "}
          <span className="line word-accent">hikoyalar</span>
        </h1>

        <p data-reveal>{siteConfig.description}</p>

        <div className="hero-cta" data-reveal>
          <a href="#posts" className="btn-primary">
            Maqolalarni o&apos;qish
          </a>
          <Link href="/about" className="btn-ghost">
            Men haqimda
          </Link>
        </div>

        {tags.length > 0 && (
          <div className="hero-tags" data-reveal>
            {tags.slice(0, 8).map((t) => (
              <span key={t} className="chip">
                #{t}
              </span>
            ))}
          </div>
        )}

        <a href="#posts" className="scroll-cue" aria-label="Pastga">
          <span />
        </a>
      </section>

      {/* ---------- Bu yerda nima bor ---------- */}
      <section className="features" data-reveal>
        {features.map((f) => (
          <article className="feature-card" data-tilt key={f.title}>
            <div className="feature-glow" aria-hidden="true" />
            <span className="feature-icon" aria-hidden="true">
              {f.icon}
            </span>
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </article>
        ))}
      </section>

      {/* ---------- Maqolalar ---------- */}
      <section id="posts" className="posts-section">
        <header className="section-head" data-reveal>
          <h2>So&apos;nggi maqolalar</h2>
          <span className="section-count">{posts.length} ta</span>
        </header>

        {posts.length === 0 ? (
          <p className="muted" data-reveal>
            Hozircha maqolalar yo&apos;q. <code>posts/</code> papkasiga{" "}
            <code>.md</code> fayl qo&apos;shing.
          </p>
        ) : (
          <ul className="post-list">
            {posts.map((post, i) => (
              <li key={post.slug} className="post-item" data-reveal>
                <Link
                  href={`/blog/${post.slug}`}
                  className="post-card"
                  data-tilt
                >
                  <span className="post-glow" aria-hidden="true" />
                  <span className="post-index" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="post-body">
                    <h3>{post.title}</h3>
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
                  </div>
                  <span className="post-arrow" aria-hidden="true">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}
