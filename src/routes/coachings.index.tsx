import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listCoachings } from "@/lib/courses.functions";
import { SignedImage } from "@/components/SignedImage";
import { motion } from "framer-motion";

export const Route = createFileRoute("/coachings/")({
  head: () => ({
    meta: [
      { title: "Coachings | EduLeak" },
      { name: "description", content: "Free courses organised by India's top coaching institutes." },
      { rel: "canonical", href: "/coachings" } as any,
    ],
  }),
  component: CoachingsIndex,
});

function CoachingsIndex() {
  const { data = [] } = useQuery({ queryKey: ["coachings"], queryFn: () => listCoachings() });
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold">Coachings</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">Browse free courses organised by coaching institute.</p>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((c: any, i: number) => (
          <motion.div key={c.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
            <Link to="/coachings/$slug" params={{ slug: c.slug }}
              className="block p-6 rounded-2xl border bg-card hover:shadow-soft hover:-translate-y-1 transition-all">
              <SignedImage bucket="coaching-logos" path={c.logo_url} alt={c.name}
                className="h-14 w-14 rounded-xl object-cover" />
              <h3 className="font-display text-xl font-semibold mt-4">{c.name}</h3>
              {c.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{c.description}</p>}
            </Link>
          </motion.div>
        ))}
        {data.length === 0 && (
          <div className="col-span-full rounded-2xl border bg-card p-10 text-center text-muted-foreground">
            No coachings yet — add some from the admin dashboard.
          </div>
        )}
      </div>
    </div>
  );
}
