import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllCourseSlugs, getCourse, type Course } from "@/lib/courses";
import { youtubeEmbedUrl } from "@/lib/youtube";
import { formatDate } from "@/lib/format";

interface PageProps {
  params: Promise<{ slug: string }>;
}

// Statik generatsiya uchun barcha slug'lar
export function generateStaticParams() {
  return getAllCourseSlugs().map((slug) => ({ slug }));
}

// Har bir kurs uchun SEO metama'lumotlari
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const course = await getCourse(slug);
    return {
      title: course.title,
      description: course.description,
    };
  } catch {
    return {};
  }
}

export default async function CoursePage({ params }: PageProps) {
  const { slug } = await params;

  let course: Course;
  try {
    course = await getCourse(slug);
  } catch {
    notFound();
  }

  return (
    <article className="article">
      <div className="article-header">
        <Link href="/kurslar" className="back-link">
          ← kurslar
        </Link>
        <h1>{course.title}</h1>
        <div className="post-meta">
          {course.date && <span>{formatDate(course.date)}</span>}
        </div>
        {course.tags.length > 0 && (
          <div className="tags">
            {course.tags.map((t) => (
              <span key={t} className="tag">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>

      {course.youtube ? (
        <div className="video-embed">
          <iframe
            src={youtubeEmbedUrl(course.youtube)}
            title={course.title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : (
        <p className="muted">Bu kursga hali video biriktirilmagan.</p>
      )}

      {course.contentHtml && (
        <div
          className="prose"
          dangerouslySetInnerHTML={{ __html: course.contentHtml }}
        />
      )}
    </article>
  );
}
