import { createFileRoute, notFound } from "@tanstack/react-router";
import { getCoachingBySlug } from "@/lib/courses.functions";
import { SignedImage } from "@/components/SignedImage";
import { CourseCard } from "@/components/CourseCard";

export const Route = createFileRoute("/coachings/$slug")({
  loader: async ({ params }) => {
    const r = await getCoachingBySlug({ data: { slug: params.slug } });
    if (!r) throw notFound();
    return r;
  },
  head: ({ loaderData }) => ({
    meta: loaderData ? [
      { title: `${loaderData.coaching.name} Courses | EduLeak` },
      { name: "description", content: loaderData.coaching.description ?? `Free courses from ${loaderData.coaching.name} on EduLeak.` },
      { rel: "canonical", href: `/coachings/${loaderData.coaching.slug}` } as any,
    ] : [],
  }),
  component: CoachingPage,
});

function CoachingPage() {
  const { coaching, courses } = Route.useLoaderData();
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <div className="flex items-center gap-5 mb-8">
        <SignedImage bucket="coaching-logos" path={coaching.logo_url} alt={coaching.name}
          className="h-20 w-20 rounded-2xl object-cover bg-muted" />
        <div>
          <h1 className="font-display text-4xl font-semibold">{coaching.name}</h1>
          {coaching.description && <p className="text-muted-foreground mt-1">{coaching.description}</p>}
        </div>
      </div>
      {courses.length === 0 ? (
        <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">No courses yet.</div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {courses.map((c: any, i: number) => <CourseCard key={c.id} course={c} index={i} />)}
        </div>
      )}
    </div>
  );
}
