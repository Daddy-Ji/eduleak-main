import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { getCourseBySlug } from "@/lib/courses.functions";
import { SignedImage } from "@/components/SignedImage";
import { getSignedUrl } from "@/lib/storage";
import { youtubeEmbed } from "@/lib/utils-youtube";
import { ExternalLink, FileText, PlayCircle, ChevronLeft } from "lucide-react";
import { useEffect } from "react";

export const Route = createFileRoute("/courses/$slug")({
  loader: async ({ params }) => {
    const res = await getCourseBySlug({ data: { slug: params.slug } });
    if (!res) throw notFound();
    return res;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.course.title} | EduLeak` },
      { name: "description", content: loaderData.course.description ?? `Free course on EduLeak: ${loaderData.course.title}` },
      { property: "og:title", content: loaderData.course.title },
      { property: "og:description", content: loaderData.course.description ?? "" },
      { rel: "canonical", href: `/courses/${loaderData.course.slug}` } as any,
    ] : [],
  }),
  component: CourseDetail,
});

function CourseDetail() {
  const { course, lessons, files } = Route.useLoaderData();
  const [activeId, setActiveId] = useState<string | null>(lessons[0]?.id ?? null);
  const active = lessons.find((l: any) => l.id === activeId) ?? lessons[0];

  // JSON-LD
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": course.title,
    "description": course.description ?? undefined,
    "provider": { "@type": "Organization", "name": "EduLeak" },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <Link to="/courses" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-6">
        <ChevronLeft className="h-4 w-4" /> All courses
      </Link>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground mb-3">
            {course.coaching && (
              <Link to="/coachings/$slug" params={{ slug: course.coaching.slug }} className="hover:text-foreground">
                {course.coaching.name}
              </Link>
            )}
            {course.coaching && course.exam && <span>•</span>}
            {course.exam && (
              <Link to="/exams/$slug" params={{ slug: course.exam.slug }} className="hover:text-foreground">
                {course.exam.name}
              </Link>
            )}
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-semibold leading-tight">{course.title}</h1>
          {course.description && <p className="mt-4 text-muted-foreground leading-relaxed">{course.description}</p>}

          <div className="mt-6">
            {course.course_type === "youtube" && active && (
              <motion.div
                key={active.id}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}
                className="aspect-video rounded-2xl overflow-hidden border bg-black shadow-soft"
              >
                <iframe
                  src={youtubeEmbed(active.youtube_id)}
                  title={active.title}
                  className="w-full h-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </motion.div>
            )}

            {course.course_type === "external" && course.external_url && (
              <div className="rounded-2xl border bg-card p-8">
                <ExternalLink className="h-8 w-8 text-primary mb-3" />
                <h3 className="font-display text-xl font-semibold">External resource</h3>
                <p className="text-sm text-muted-foreground mt-1">This course lives on another website.</p>
                <a href={course.external_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90">
                  Open resource <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            )}

            {course.course_type === "pdf" && (
              <div className="rounded-2xl border bg-card overflow-hidden">
                <SignedImage bucket="course-covers" path={course.cover_url} alt={course.title}
                  className="w-full aspect-video object-cover" />
              </div>
            )}
          </div>

          {active?.description && (
            <p className="mt-4 text-muted-foreground text-sm">{active.description}</p>
          )}

          {files.length > 0 && (
            <div className="mt-8">
              <h2 className="font-display text-2xl font-semibold mb-4">Notes & PDFs</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {files.map((f: any) => <PdfRow key={f.id} file={f} />)}
              </div>
            </div>
          )}
        </div>

        {course.course_type === "youtube" && lessons.length > 0 && (
          <aside className="lg:sticky lg:top-20 self-start rounded-2xl border bg-card overflow-hidden">
            <div className="px-5 py-4 border-b">
              <h3 className="font-display font-semibold">Lessons</h3>
              <p className="text-xs text-muted-foreground">{lessons.length} videos</p>
            </div>
            <ul className="max-h-[600px] overflow-auto">
              {lessons.map((l: any, i: number) => (
                <li key={l.id}>
                  <button
                    onClick={() => setActiveId(l.id)}
                    className={`w-full text-left px-5 py-3 flex gap-3 hover:bg-muted transition border-l-2 ${
                      active?.id === l.id ? "bg-secondary border-primary" : "border-transparent"
                    }`}
                  >
                    <span className="text-xs text-muted-foreground w-5 mt-0.5">{i + 1}</span>
                    <div className="flex-1">
                      <div className="text-sm font-medium leading-snug">{l.title}</div>
                    </div>
                    <PlayCircle className="h-4 w-4 mt-0.5 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </aside>
        )}
      </div>
    </div>
  );
}

function PdfRow({ file }: { file: any }) {
  const [url, setUrl] = useState<string | null>(null);
  useEffect(() => {
    if (file.file_url?.startsWith("http")) setUrl(file.file_url);
    else getSignedUrl("course-files", file.file_url).then(setUrl);
  }, [file.file_url]);
  return (
    <a href={url ?? "#"} target="_blank" rel="noopener noreferrer"
      className="flex items-center gap-3 p-4 rounded-xl border bg-card hover:bg-muted transition">
      <div className="h-10 w-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
        <FileText className="h-5 w-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="font-medium truncate">{file.name}</div>
        <div className="text-xs text-muted-foreground">Open PDF</div>
      </div>
    </a>
  );
}
