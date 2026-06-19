"use client";

import { useEffect, useRef, useState } from "react";
import { slugify } from "@/lib/slug";

const STARTER = `## Kirish

Bu yerdan yozishni boshlang. Markdown ishlaydi:

- **qalin**, *qiya* matn
- ro'yxatlar
- kod bloklari

\`\`\`js
console.log("Salom, duck.dev!");
\`\`\`
`;

export default function AdminPage() {
  const today = new Date().toISOString().slice(0, 10);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [slugEdited, setSlugEdited] = useState(false);
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(today);
  const [tags, setTags] = useState("");
  const [content, setContent] = useState(STARTER);

  const [html, setHtml] = useState("");
  const [status, setStatus] = useState(null); // {type, msg}
  const [saving, setSaving] = useState(false);
  const [existing, setExisting] = useState([]);

  // Sarlavhadan slugni avtomatik yaratish (agar foydalanuvchi o'zi tahrirlamagan bo'lsa)
  useEffect(() => {
    if (!slugEdited) setSlug(slugify(title));
  }, [title, slugEdited]);

  // Mavjud maqolalar ro'yxati
  useEffect(() => {
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setExisting(d.posts || []))
      .catch(() => {});
  }, [status]);

  // Jonli preview (debounce 300ms)
  const timer = useRef(null);
  useEffect(() => {
    clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      fetch("/api/preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      })
        .then((r) => r.json())
        .then((d) => setHtml(d.html || ""))
        .catch(() => {});
    }, 300);
    return () => clearTimeout(timer.current);
  }, [content]);

  async function save() {
    setStatus(null);
    if (!title.trim()) {
      setStatus({ type: "err", msg: "Sarlavha kiriting." });
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, slug, description, date, tags, content }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ type: "err", msg: data.error || "Xatolik yuz berdi." });
      } else {
        setStatus({
          type: "ok",
          msg: `Saqlandi: ${data.file}`,
          url: data.url,
        });
      }
    } catch (e) {
      setStatus({ type: "err", msg: String(e) });
    } finally {
      setSaving(false);
    }
  }

  function reset() {
    setTitle("");
    setSlug("");
    setSlugEdited(false);
    setDescription("");
    setDate(today);
    setTags("");
    setContent(STARTER);
    setStatus(null);
  }

  return (
    <div className="admin">
      <div className="admin-head">
        <h1>✍️ Yangi maqola</h1>
        <p className="admin-note">
          Bu sahifa faqat sizning kompyuteringizda (npm run dev) ishlaydi.
          Saqlangach <code>git push</code> qiling.
        </p>
      </div>

      <div className="admin-grid">
        {/* CHAP: forma */}
        <div className="admin-form">
          <label>
            Sarlavha
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Masalan: React asoslari"
            />
          </label>

          <label>
            Slug (URL) <span className="hint">/blog/{slug || "..."}</span>
            <input
              value={slug}
              onChange={(e) => {
                setSlugEdited(true);
                setSlug(slugify(e.target.value));
              }}
              placeholder="react-asoslari"
            />
          </label>

          <label>
            Tavsif
            <input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Qisqa tavsif (ro'yxatda va Google'da ko'rinadi)"
            />
          </label>

          <div className="row">
            <label>
              Sana
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </label>
            <label>
              Teglar (vergul bilan)
              <input
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="react, javascript"
              />
            </label>
          </div>

          <label className="grow">
            Matn (Markdown)
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              spellCheck={false}
            />
          </label>

          <div className="admin-actions">
            <button onClick={save} disabled={saving} className="btn-primary">
              {saving ? "Saqlanmoqda..." : "💾 Saqlash"}
            </button>
            <button onClick={reset} className="btn-ghost">
              Tozalash
            </button>
          </div>

          {status && (
            <div className={`admin-status ${status.type}`}>
              {status.msg}
              {status.url && (
                <>
                  {" — "}
                  <a href={status.url} target="_blank" rel="noreferrer">
                    ko'rish ↗
                  </a>
                  <div className="git-tip">
                    Internetga chiqarish uchun:
                    <pre>git add . && git commit -m "yangi maqola" && git push</pre>
                  </div>
                </>
              )}
            </div>
          )}

          {existing.length > 0 && (
            <div className="existing">
              <div className="existing-title">
                Mavjud maqolalar ({existing.length}):
              </div>
              <div className="existing-list">
                {existing.map((s) => (
                  <span key={s} className="tag">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* O'NG: jonli ko'rinish */}
        <div className="admin-preview">
          <div className="preview-label">Jonli ko'rinish</div>
          <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
        </div>
      </div>
    </div>
  );
}
