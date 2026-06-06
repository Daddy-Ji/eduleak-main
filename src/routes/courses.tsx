import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { listCourses, listCoachings, listExams } from "@/lib/courses.functions";
import { CourseCard } from "@/components/CourseCard";
import { Search } from "lucide-react";

export const Route = createFileRoute("/courses")({
  head: () => ({
    meta: [
      { title: "All Free Courses | EduLeak" },
      { name: "description", content: "Browse every free course on EduLeak. Filter by coaching, exam, or content type." },
      { property: "og:title", content: "All Free Courses | EduLeak" },
      { property: "og:description", content: "Browse every free course on EduLeak." },
      { rel: "canonical", href: "/courses" } as any,
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const [q, setQ] = useState("");
  const [coachingSlug, setCoachingSlug] = useState<string>("");
  const [examSlug, setExamSlug] = useState<string>("");
  const [type, setType] = useState<string>("");

  const { data: coachings = [] } = useQuery({ queryKey: ["coachings"], queryFn: () => listCoachings() });
  const { data: exams = [] } = useQuery({ queryKey: ["exams"], queryFn: () => listExams() });
  const { data: courses = [], isLoading } = useQuery({
    queryKey: ["courses", { q, coachingSlug, examSlug, type }],
    queryFn: () => listCourses({ data: {
      q: q || undefined,
      coachingSlug: coachingSlug || undefined,
      examSlug: examSlug || undefined,
      type: (type || undefined) as any,
    }}),
  });

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold">All courses</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">
        Every lesson on EduLeak, organised by exam and coaching. Use the filters to narrow it down.
      </p>

      <div className="mt-8 grid gap-3 lg:grid-cols-[1fr_auto_auto_auto]">
        <label className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={q} onChange={(e) => setQ(e.target.value)}
            placeholder="Search courses..."
            className="w-full pl-10 pr-4 py-3 rounded-xl border bg-card focus:outline-none focus:ring-2 focus:ring-ring"
          />
        </label>
        <select value={coachingSlug} onChange={(e) => setCoachingSlug(e.target.value)}
          className="px-4 py-3 rounded-xl border bg-card">
          <option value="">All coachings</option>
          {coachings.map((c: any) => <option key={c.id} value={c.slug}>{c.name}</option>)}
        </select>
        <select value={examSlug} onChange={(e) => setExamSlug(e.target.value)}
          className="px-4 py-3 rounded-xl border bg-card">
          <option value="">All exams</option>
          {exams.map((e: any) => <option key={e.id} value={e.slug}>{e.name}</option>)}
        </select>
        <select value={type} onChange={(e) => setType(e.target.value)}
          className="px-4 py-3 rounded-xl border bg-card">
          <option value="">All types</option>
          <option value="youtube">Video</option>
          <option value="pdf">Notes / PDF</option>
          <option value="external">External</option>
        </select>
      </div>

      <div className="mt-10">
        {isLoading ? (
          <p className="text-muted-foreground">Loading…</p>
        ) : courses.length === 0 ? (
          <div className="rounded-2xl border bg-card p-12 text-center text-muted-foreground">
            No courses match your filters.
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((c: any, i: number) => <CourseCard key={c.id} course={c} index={i} />)}
          </div>
        )}
      </div>
    </div>
  );
}
