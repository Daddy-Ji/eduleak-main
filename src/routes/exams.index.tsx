import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { listExams } from "@/lib/courses.functions";
import { motion } from "framer-motion";

export const Route = createFileRoute("/exams/")({
  head: () => ({
    meta: [
      { title: "Exams | EduLeak" },
      { name: "description", content: "Free preparation for JEE, NEET, UPSC and other top Indian exams." },
      { rel: "canonical", href: "/exams" } as any,
    ],
  }),
  component: ExamsIndex,
});

function ExamsIndex() {
  const { data = [] } = useQuery({ queryKey: ["exams"], queryFn: () => listExams() });
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12">
      <h1 className="font-display text-4xl sm:text-5xl font-semibold">Exams</h1>
      <p className="text-muted-foreground mt-2 max-w-2xl">Pick your exam to see free, curated prep material.</p>
      <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {data.map((e: any, i: number) => (
          <motion.div key={e.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
            <Link to="/exams/$slug" params={{ slug: e.slug }}
              className="block p-6 rounded-2xl border bg-card hover:shadow-soft hover:-translate-y-1 transition-all">
              <div className="h-12 w-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-display font-bold">
                {e.name.slice(0, 2)}
              </div>
              <h3 className="font-display text-xl font-semibold mt-4">{e.name}</h3>
              {e.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{e.description}</p>}
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
