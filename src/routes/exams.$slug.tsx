import { createFileRoute, notFound } from "@tanstack/react-router";
import { getExamBySlug } from "@/lib/courses.functions";
import { CourseCard } from "@/components/CourseCard";

export const Route = createFileRoute("/exams/$slug")({
  loader: async ({ params }) => {
    const r = await getExamBySlug({ data: { slug: params.slug } });
    if (!r) throw notFound();
    return r;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.exam.name} Free Courses & Prep | EduShare` },
      { name: "description", content: loaderData.exam.description ?? `Free ${loaderData.exam.name} preparation courses on EduShare.` },
      { rel: "canonical", href: `/exams/${loaderData.exam.slug}` } as any,
    ] : [],
  }),
  component: ExamPage,
});

function ExamPage() {
  const { exam, courses } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="mb-8">
        <p className="text-sm text-muted-foreground uppercase tracking-widest">Exam</p>
        <h1 className="font-display text-4xl sm:text-5xl font-semibold mt-2">{exam.name} preparation</h1>
        {exam.description && <p className="text-muted-foreground mt-2 max-w-2xl">{exam.description}</p>}
      </div>
      {courses.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">No courses yet for {exam.name}.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c: any, i: number) => <CourseCard key={c.id} course={c} index={i} />)}
        </div>
      )}
    </div>
  );
}
