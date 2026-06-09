import { siteConfig } from "@/lib/config";

export const metadata = {
  title: "Men haqimda",
};

export default function AboutPage() {
  return (
    <article className="article">
      <div className="article-header">
        <h1>Men haqimda</h1>
      </div>
      <div className="prose">
        <p>
          Salom! Bu <strong>{siteConfig.name}</strong> — dasturlashga oid
          maqolalar yozib boradigan blogim.
        </p>
        <p>
          Bu yerda JavaScript, web-dasturlash, algoritmlar va o&apos;zim
          o&apos;rganayotgan texnologiyalar haqida yozaman.
        </p>
        <p>
          Bog&apos;lanish uchun:{" "}
          <a href={siteConfig.social.github}>GitHub</a> ·{" "}
          <a href={siteConfig.social.twitter}>Twitter</a>
        </p>
      </div>
    </article>
  );
}
