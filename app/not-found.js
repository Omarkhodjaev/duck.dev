import Link from "next/link";

export default function NotFound() {
  return (
    <article className="article">
      <div className="article-header">
        <h1>404 — topilmadi</h1>
      </div>
      <div className="prose">
        <p>
          <code>Error: bunday sahifa mavjud emas</code>
        </p>
        <p>
          <Link href="/">← bosh sahifaga qaytish</Link>
        </p>
      </div>
    </article>
  );
}
