import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { getHomeData } from "@/lib/courses.functions";
import { CourseCard } from "@/components/CourseCard";
import { HeroIllustration } from "@/components/HeroIllustration";
import { PortalsSection } from "@/components/PortalsSection";
import { InstitutesMarquee } from "@/components/InstitutesMarquee";
import { WhyChooseUs, AudienceSection, ReadyToStart } from "@/components/WhyChooseUs";
import { ArrowRight, Sparkles, BookOpen, Users, Award } from "lucide-react";
import heroChar from "@/assets/hero-character.webp";

export const Route = createFileRoute("/")({
  head: () => ({
    links: [
      { rel: "preload", as: "image", href: heroChar },
    ],
    meta: [
      { title: "EduLeak — Free Courses for JEE, NEET, UPSC & more" },
      { name: "description", content: "Discover free, curated courses from India's top coachings. Calm UI, zero distractions." },
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
  const settings: any = data?.settings ?? {};
  const exams = data?.exams ?? [];
  const latest = data?.latest ?? [];
  const portals = data?.portals ?? [];
  const institutes = data?.institutes ?? [];
  const why = data?.why ?? [];
  const audience = data?.audience ?? [];

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 pt-12 pb-16 sm:pt-20 sm:pb-24">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr] gap-10 lg:gap-16 items-center">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/50 text-accent-foreground text-xs font-medium mb-5">
                <Sparkles className="h-3.5 w-3.5" /> 100% free • No ads • No paywalls
              </div>
              <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold leading-[1.04] tracking-tight">
                {settings?.hero_title ?? (<>Free quality education for every <span className="text-gradient">Indian student.</span></>)}
              </h1>
              <p className="mt-6 text-lg text-muted-foreground max-w-2xl leading-relaxed">
                {settings?.hero_subtitle ?? "Curated lessons from India's best coachings, organised by exam."}
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#portals" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
                  Browse portals <ArrowRight className="h-4 w-4" />
                </a>
                <Link to="/about" className="inline-flex items-center px-6 py-3 rounded-xl border bg-card hover:bg-muted font-medium transition">
                  Meet the team
                </Link>
              </div>
              <div className="mt-10 grid grid-cols-3 gap-3 sm:gap-4 max-w-lg">
                {stats.map((s) => (
                  <div key={s.label} className="rounded-2xl border bg-card/80 backdrop-blur p-4 text-center">
                    <s.icon className="h-5 w-5 mx-auto text-primary mb-2" />
                    <div className="font-display text-2xl font-semibold">{s.value}</div>
                    <div className="text-xs text-muted-foreground">{s.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>
            <div className="order-first lg:order-none"><HeroIllustration /></div>
          </div>
        </div>
      </section>

      <PortalsSection portals={portals as any} title={settings?.portals_title ?? "Explore our Portals"} subtitle={settings?.portals_subtitle ?? "Everything you need — categorised"} />




      <InstitutesMarquee institutes={institutes as any} title={settings?.institutes_title ?? "Featured Institutions"} subtitle={settings?.institutes_subtitle ?? "India's top coaching platforms — all in one place"} />

      <WhyChooseUs items={why as any} title={settings?.why_title ?? "Why Choose Us?"} subtitle={settings?.why_subtitle ?? "Everything you need — organised, free & effective"} />

      <AudienceSection items={audience as any} title={settings?.who_title ?? "Who is this for?"} subtitle={settings?.who_subtitle ?? "Designed for Indian competitive exam aspirants"} />

      {exams.length > 0 && (
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
                <motion.div key={e.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Link to="/exams/$slug" params={{ slug: e.slug }} className="block p-6 rounded-2xl border bg-card hover:shadow-soft hover:-translate-y-1 transition-all">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center font-display font-bold">{e.name.slice(0, 2)}</div>
                    <h3 className="font-display text-xl font-semibold mt-4">{e.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{e.description}</p>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {(() => {
        const recentPortals = [...portals]
          .sort((a: any, b: any) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
          .slice(0, 4)
          .map((p: any) => ({ kind: "portal", ...p }));
        const recentCourses = latest.map((c: any) => ({ kind: "course", ...c }));
        const mixed = [...recentCourses, ...recentPortals]
          .sort((a: any, b: any) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))
          .slice(0, 9);
        if (mixed.length === 0) return null;
        return (
          <section className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6">
              <div className="flex items-end justify-between mb-8">
                <div>
                  <h2 className="font-display text-3xl sm:text-4xl font-semibold">Recently added</h2>
                  <p className="text-muted-foreground mt-2">Fresh lessons & portals hand-picked from across the web.</p>
                </div>
                <a href="#portals" className="text-sm text-primary hover:underline">All portals →</a>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {mixed.map((item: any, i: number) =>
                  item.kind === "course"
                    ? <CourseCard key={`c-${item.id}`} course={item} index={i} />
                    : (
                      <motion.a
                        key={`p-${item.id}`}
                        href={item.embed_in_app && item.link_url ? `/embed/${item.id}` : (item.link_url ?? "#portals")}
                        target={item.embed_in_app ? "_self" : "_blank"}
                        rel="noreferrer"
                        initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
                        transition={{ delay: i * 0.05 }}
                        className="block rounded-2xl border bg-card p-5 hover:shadow-soft hover:-translate-y-1 transition-all"
                      >
                        <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-semibold text-primary mb-2">
                          <span className="bg-primary/10 px-2 py-0.5 rounded-full">Portal</span>
                          {item.category && <span className="text-muted-foreground">· {item.category}</span>}
                        </div>
                        <div className="text-3xl mb-2">{item.emoji ?? "📚"}</div>
                        <h3 className="font-display text-lg font-semibold">{item.title}</h3>
                        {item.subtitle && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{item.subtitle}</p>}
                      </motion.a>
                    )
                )}
              </div>
            </div>
          </section>
        );
      })()}

      <ReadyToStart
        title={settings?.cta_title ?? "Ready to Start?"}
        subtitle={settings?.cta_subtitle ?? "Join thousands of students who cracked their exams."}
        buttonText={settings?.cta_button_text ?? "Get Started"}
        buttonUrl={settings?.cta_button_url ?? "/courses"}
      />
    </div>
  );
}
