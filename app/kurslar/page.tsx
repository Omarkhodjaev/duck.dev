import type { Metadata } from "next";
import Link from "next/link";
import { getAllCourses } from "@/lib/courses";
import { youtubeThumb } from "@/lib/youtube";
import { formatDate } from "@/lib/format";

export const metadata: Metadata = {
  title: "Kurslar",
  description:
    "duck.dev video kurslari — YouTube darslari bilan amaliy dasturlash.",
};

export default function CoursesPage() {
  const courses = getAllCourses();

  return (
    <section className="posts-section">
      <header className="section-head" data-reveal>
        <h1>Kurslar</h1>
        <span className="section-count">{courses.length} ta</span>
      </header>

      <p className="muted" data-reveal>
        Video darslar — har birida YouTube dars va qisqacha izoh.
      </p>

      {courses.length === 0 ? (
        <p className="muted" data-reveal>
          Hozircha kurslar yo&apos;q. <code>courses/</code> papkasiga{" "}
          <code>.md</code> fayl qo&apos;shing.
        </p>
      ) : (
        <ul className="course-grid">
          {courses.map((course) => (
            <li key={course.slug} className="course-item" data-reveal>
              <Link
                href={`/kurslar/${course.slug}`}
                className="course-card"
                data-tilt
              >
                <span className="course-glow" aria-hidden="true" />
                {course.youtube && (
                  <span className="course-thumb">
                    <img
                      src={youtubeThumb(course.youtube)}
                      alt=""
                      loading="lazy"
                    />
                    <span className="course-play" aria-hidden="true">
                      ▶
                    </span>
                  </span>
                )}
                <div className="course-body">
                  <h3>{course.title}</h3>
                  {course.description && (
                    <p className="course-excerpt">{course.description}</p>
                  )}
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
              </Link>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
