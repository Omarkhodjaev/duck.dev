import type { Metadata } from "next";
import { siteConfig } from "@/lib/config";

export const metadata: Metadata = {
  title: "Men haqimda",
  description:
    "duck.dev muallifi haqida: tajriba, ko'nikmalar va dasturlashga bo'lgan qiziqishlar.",
};

interface Stat {
  value: string;
  label: string;
}

interface SkillGroup {
  title: string;
  items: string[];
}

interface TimelineEntry {
  year: string;
  title: string;
  text: string;
}

interface Interest {
  icon: string;
  text: string;
}

const stats: Stat[] = [
  { value: "5+", label: "yillik tajriba" },
  { value: "40+", label: "loyiha" },
  { value: "∞", label: "qahva 🐥" },
];

const skills: SkillGroup[] = [
  {
    title: "Frontend",
    items: ["JavaScript / TypeScript", "React & Next.js", "HTML & CSS", "UI/UX"],
  },
  {
    title: "Backend",
    items: ["Node.js", "REST & GraphQL API", "PostgreSQL / MongoDB", "Auth & Security"],
  },
  {
    title: "Vositalar",
    items: ["Git & GitHub", "Docker", "Linux", "CI/CD"],
  },
];

const timeline: TimelineEntry[] = [
  {
    year: "Hozir",
    title: "duck.dev blogini yuritaman",
    text: "O'rganganlarimni maqolalar ko'rinishida ulashaman — JavaScript, web va algoritmlar.",
  },
  {
    year: "2023",
    title: "Full-stack dasturchi",
    text: "Real loyihalarda frontend va backendni birgalikda olib bordim.",
  },
  {
    year: "2021",
    title: "Web-dasturlashni boshladim",
    text: "Birinchi HTML sahifadan to interaktiv ilovalargacha bo'lgan yo'l.",
  },
  {
    year: "2019",
    title: "Kod bilan tanishuv",
    text: "Birinchi marta «Hello, World!» yozib, dasturlashga oshiq bo'ldim.",
  },
];

const interests: Interest[] = [
  { icon: "⚡", text: "Tezkor va toza kod yozish" },
  { icon: "📚", text: "Yangi texnologiyalarni o'rganish" },
  { icon: "🎨", text: "Chiroyli interfeyslar dizayni" },
  { icon: "🧩", text: "Algoritmik masalalar yechish" },
  { icon: "✍️", text: "Bilim ulashish va yozish" },
  { icon: "☕", text: "Yaxshi qahva ustida kod" },
];

export default function AboutPage() {
  return (
    <article className="article about">
      {/* Hero */}
      <header className="about-hero" data-reveal>
        <div className="about-avatar" aria-hidden="true">
          <img src="/logo.svg" alt="" width={64} height={64} />
        </div>
        <h1>Salom, men {siteConfig.author}!</h1>
        <p className="about-lead">
          Men web-dasturchiman va <strong>{siteConfig.name}</strong> blogining
          muallifiman. Bu yerda kod, g&apos;oyalar va o&apos;rganish jarayonimni
          ulashib boraman.
        </p>
        <div className="about-actions">
          <a className="btn-primary" href={siteConfig.social.github}>
            GitHub
          </a>
          <a className="btn-ghost" href={siteConfig.social.email}>
            Yozib qoldirish
          </a>
        </div>
      </header>

      {/* Stats */}
      <section className="about-stats" data-reveal>
        {stats.map((s) => (
          <div className="about-stat" data-tilt key={s.label}>
            <span className="about-stat-value" data-count={s.value}>
              {s.value}
            </span>
            <span className="about-stat-label">{s.label}</span>
          </div>
        ))}
      </section>

      {/* Bio */}
      <section className="prose" data-reveal>
        <h2>Bir oz o&apos;zim haqimda</h2>
        <p>
          Dasturlash men uchun shunchaki kasb emas — bu fikrlashning bir usuli.
          Murakkab muammoni kichik, tushunarli bo&apos;laklarga ajratib, ularni
          birma-bir hal qilishni yaxshi ko&apos;raman. Eng katta zavqni esa
          ishlamayotgan narsa nihoyat ishlay boshlagan paytda olaman.
        </p>
        <p>
          Asosan <strong>JavaScript</strong> ekotizimida ishlayman:
          frontend tomonda React va Next.js, backend tomonda Node.js.
          Lekin yangi tilni yoki vositani sinab ko&apos;rishdan hech qachon
          qo&apos;rqmayman — har bir texnologiya dunyoga boshqacha qarashni
          o&apos;rgatadi.
        </p>
        <blockquote>
          Kod yozish — bu kelajakdagi o&apos;zingga (va boshqalarga)
          xat yozish demakdir. Shuning uchun uni toza yozing.
        </blockquote>
      </section>

      {/* Skills */}
      <section className="about-section" data-reveal>
        <h2>Ko&apos;nikmalar</h2>
        <div className="skill-grid">
          {skills.map((group) => (
            <div className="skill-card" data-tilt key={group.title}>
              <h3>{group.title}</h3>
              <ul>
                {group.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline */}
      <section className="about-section" data-reveal>
        <h2>Mening yo&apos;lim</h2>
        <ol className="timeline">
          {timeline.map((t) => (
            <li className="timeline-item" key={t.year}>
              <span className="timeline-year">{t.year}</span>
              <div className="timeline-body">
                <h3>{t.title}</h3>
                <p>{t.text}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Interests */}
      <section className="about-section" data-reveal>
        <h2>Nimani yaxshi ko&apos;raman</h2>
        <div className="interest-grid">
          {interests.map((i) => (
            <div className="interest-item" key={i.text}>
              <span className="interest-icon" aria-hidden="true">
                {i.icon}
              </span>
              <span>{i.text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <section className="about-cta" data-reveal>
        <h2>Keling, bog&apos;lanamiz</h2>
        <p>
          Savol, taklif yoki shunchaki suhbat uchun — istalgan platformada
          yozishingiz mumkin. Doim ochiqman 🐥
        </p>
        <div className="about-links">
          <a href={siteConfig.social.github}>GitHub</a>
          <a href={siteConfig.social.twitter}>Twitter</a>
          <a href={siteConfig.social.telegram}>Telegram</a>
          <a href={siteConfig.social.email}>Email</a>
        </div>
      </section>
    </article>
  );
}
