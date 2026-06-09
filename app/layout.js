import "./globals.css";
import Link from "next/link";
import { siteConfig } from "@/lib/config";

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

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>
        <header className="site-header">
          <div className="container inner">
            <Link href="/" className="logo">
              <span className="prompt">$ </span>
              <span className="name">{siteConfig.name}</span>
              <span className="cursor">_</span>
            </Link>
            <nav className="nav">
              <Link href="/">Maqolalar</Link>
              <Link href="/about">Men haqimda</Link>
            </nav>
          </div>
        </header>

        <main className="container">{children}</main>

        <footer className="site-footer">
          <div className="container inner">
            <span>
              © {new Date().getFullYear()} {siteConfig.name}
            </span>
            <span>Next.js bilan qurilgan · Markdown</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
