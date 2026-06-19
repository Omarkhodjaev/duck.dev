import "./globals.css";
import Link from "next/link";
import { siteConfig } from "@/lib/config";
import ThemeToggle from "./components/ThemeToggle";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.title,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    title: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    siteName: siteConfig.name,
    type: "website",
  },
};

// Sahifa chizilishidan OLDIN temani o'rnatamiz — "flash" bo'lmasligi uchun
const themeScript = `
(function() {
  try {
    var t = localStorage.getItem('theme');
    if (!t) t = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.setAttribute('data-theme', t);
  } catch (e) {
    document.documentElement.setAttribute('data-theme', 'light');
  }
})();
`;

export default function RootLayout({ children }) {
  return (
    <html lang="uz" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>
        <header className="site-header">
          <div className="container inner">
            <Link href="/" className="logo">
              <span className="logo-mark">🦆</span>
              <span className="logo-text">{siteConfig.name}</span>
            </Link>
            <nav className="nav">
              <Link href="/">Maqolalar</Link>
              <Link href="/about">Men haqimda</Link>
              <ThemeToggle />
            </nav>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="site-footer">
          <div className="container inner">
            <span>
              © {new Date().getFullYear()} {siteConfig.name}
            </span>
            <span className="muted">Next.js · Markdown</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
