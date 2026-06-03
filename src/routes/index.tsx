import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getHomeData } from "@/lib/courses.functions";
import { CourseCard } from "@/components/CourseCard";
import { SignedImage } from "@/components/SignedImage";
import { HeroIllustration } from "@/components/HeroIllustration";
import { ArrowRight, Sparkles, BookOpen, Users, Award } from "lucide-react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EduShare — Free Courses for JEE, NEET, UPSC & more" },
      { name: "description", content: "Discover free, curated courses from India's top coachings — Allen, Physics Wallah, Unacademy and more. Calm UI, zero distractions." },
      { property: "og:title", content: "EduShare — Free Quality Education" },
      { property: "og:description", content: "Free courses from India's top coachings, organised by exam." },
      { rel: "canonical", href: "/" } as any,
    ],
  }),
  component: HomePage,
});

const stats = [
  { icon: BookOpen, value: "100+", label: "Curated courses" },
  { icon: Users, value: "10k+", label: "Active learners" },
  { icon: Award, value: "Top", label: "Indian coachings" },
];

function HomePage() {
  const { data } = useQuery({ queryKey: ["home"], queryFn: () => getHomeData() });
  const coachings = data?.coachings ?? [];
  const exams = data?.exams ?? [];
  const latest = data?.latest ?? [];
  const settings = data?.settings;

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.15, duration: 0.5 }}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 text-accent-foreground text-xs font-medium mb-5"
              >
                <Sparkles className="h-3.5 w-3.5" /> 100% free • No ads • No paywalls
              </motion.div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.04] tracking-tight">
                {settings?.hero_title ?? (
                  <>
                    Free quality education for every{" "}
                    <span className="text-gradient">Indian student.</span>
                  </>
                )}
              </h1>
              <motion.p
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.45, duration: 0.6 }}
                className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed"
              >
                {settings?.hero_subtitle ?? "Curated lessons from India's best coachings, organised by exam. Watch, read and learn — all in one calm, distraction-free place."}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, duration: 0.5 }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Link to="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 hover:-translate-y-0.5 transition">
                  Browse courses <ArrowRight className="h-4 w-4" />
                </Link>
                <Link to="/about" className="inline-flex items-center px-6 py-3 rounded-xl border bg-card hover:bg-muted font-medium transition">
                  Meet the team
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85, duration: 0.6 }}
                className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg"
              >
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl border bg-card/80 backdrop-blur p-4 text-center">
                    <s.icon className="h-5 w-5 mx-auto text-primary mb-2" />
                    <div className="font-display text-2xl font-semibold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            <div className="order-first lg:order-none">
              <HeroIllustration />
            </div>
          </div>
        </div>
      </section>


      {/* Coachings strip */}
      {coachings.length > 0 && (
        <section className="py-12 border-y bg-card/40">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <p className="text-xs uppercase tracking-widest text-muted-foreground mb-6">Featured coachings</p>
            <div className="flex flex-wrap items-center gap-x-10 gap-y-6">
              {coachings.map((c: any, i: number) => (
                <motion.div
                  key={c.id}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                >
                  <Link to="/coachings/$slug" params={{ slug: c.slug }}
                    className="flex items-center gap-3 hover:opacity-80 transition">
                    <SignedImage bucket="coaching-logos" path={c.logo_url}
                      alt={c.name}
                      className="h-10 w-10 rounded-xl object-cover bg-muted" />
                    <span className="font-display font-semibold">{c.name}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Exams */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold">Pick your exam</h2>
              <p className="text-muted-foreground mt-2">Jump straight to courses for the exam you're preparing for.</p>
            </div>
            <Link to="/exams" className="text-sm text-primary hover:underline hidden sm:inline">All exams →</Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {exams.map((e: any, i: number) => (
              <motion.div key={e.id}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Link to="/exams/$slug" params={{ slug: e.slug }}
                  className="block p-6 rounded-2xl border bg-card hover:shadow-soft hover:-translate-y-1 transition-all">
                  <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-display font-bold">
                    {e.name.slice(0, 2)}
                  </div>
                  <h3 className="font-display text-xl font-semibold mt-4">{e.name}</h3>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{e.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest courses */}
      <section className="py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold">Recently added</h2>
              <p className="text-muted-foreground mt-2">Fresh lessons hand-picked from across the web.</p>
            </div>
            <Link to="/courses" className="text-sm text-primary hover:underline">All courses →</Link>
          </div>
          {latest.length === 0 ? (
            <div className="rounded-2xl border bg-card p-10 text-center text-muted-foreground">
              No courses yet — admins can add the first one from the dashboard.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {latest.map((c: any, i: number) => <CourseCard key={c.id} course={c} index={i} />)}
            </div>
          )}
        </div>
      </section>

      {/* Masterminds teaser */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-3xl bg-gradient-to-br from-primary to-primary/80 text-primary-foreground p-10 sm:p-14 text-center">
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">The Masterminds Behind EduShare</h2>
            <p className="mt-3 max-w-xl mx-auto opacity-90">
              A small team obsessed with making world-class education accessible to every student in India.
            </p>
            <Link to="/about" className="inline-flex items-center gap-2 mt-6 px-5 py-2.5 rounded-xl bg-background text-foreground font-medium">
              Meet the team <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
