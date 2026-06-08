import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getSiteSettings } from "@/lib/courses.functions";
import { Sparkles, Send } from "lucide-react";
import { SignedImage } from "@/components/SignedImage";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Masterminds Behind EduLeak" },
      { name: "description", content: "Meet the small team obsessed with making world-class education free for every Indian student." },
      { rel: "canonical", href: "/about" } as any,
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  const { data } = useQuery({ queryKey: ["site_settings"], queryFn: () => getSiteSettings() });
  const founders = (data?.founders as any[]) ?? [];

  return (
    <div className="mx-auto max-w-5xl px-4 sm:px-6 py-16">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/40 text-accent-foreground text-xs font-medium mb-4">
          <Sparkles className="h-3.5 w-3.5" /> Our story
        </div>
        <h1 className="font-display text-5xl sm:text-6xl font-semibold leading-tight">The Masterminds Behind EduLeak</h1>
        <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
          EduLeak began with a simple belief: every student in India deserves access to the same world-class
          teachers, regardless of their pin code or family income. We curate the best free content from across
          the web, organise it by exam and coaching, and present it in a calm, distraction-free place.
        </p>
      </motion.div>

      <div className="mt-16 grid sm:grid-cols-2 gap-6">
        {founders.map((f, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }} transition={{ delay: i * 0.1 }}
            className="rounded-3xl border bg-card p-6 hover:shadow-soft transition"
          >
            <div className="flex items-center gap-4">
              {f.avatar ? (
                f.avatar.startsWith("http")
                  ? <img src={f.avatar} alt={f.name} className="h-16 w-16 rounded-full object-cover border" />
                  : <SignedImage bucket="coaching-logos" path={f.avatar} alt={f.name} className="h-16 w-16 rounded-full object-cover border" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gradient-to-br from-primary to-coral flex items-center justify-center text-primary-foreground font-display font-bold text-2xl">
                  {f.name?.[0]}
                </div>
              )}
              <div>
                <h3 className="font-display text-xl font-semibold">{f.name}</h3>
                <p className="text-sm text-primary">{f.role}</p>
              </div>
            </div>
            <p className="mt-4 text-muted-foreground text-sm leading-relaxed">{f.bio}</p>
          </motion.div>
        ))}
      </div>

      <div className="mt-20 rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-10 text-center">
        <h2 className="font-display text-3xl font-semibold">Want to help us grow?</h2>
        <p className="mt-3 opacity-90 max-w-xl mx-auto">
          Reach out on Telegram — we're always looking for educators, contributors and good ideas.
        </p>
      </div>
    </div>
  );
}
