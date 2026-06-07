import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { ArrowRight, MessageCircle } from "lucide-react";
import { SignedImage } from "@/components/SignedImage";

type Portal = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  emoji: string | null;
  logo_url?: string | null;
  link_url: string | null;
  whatsapp_url: string | null;
  embed_in_app: boolean;
  category?: string | null;
};

export function PortalsSection({ portals, title, subtitle }: { portals: Portal[]; title: string; subtitle: string }) {
  const [active, setActive] = useState<string>("All");
  const categories = useMemo(() => {
    const set = new Set<string>();
    portals.forEach((p) => { if (p.category && p.category.trim()) set.add(p.category.trim()); });
    return ["All", ...Array.from(set)];
  }, [portals]);
  const filtered = active === "All" ? portals : portals.filter((p) => (p.category ?? "").trim() === active);

  if (portals.length === 0) return null;
  return (
    <section id="portals" className="py-20 scroll-mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-8">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">{title}</h2>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        {categories.length > 1 && (
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium border transition ${
                  active === c
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-card hover:bg-muted border-border text-muted-foreground"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((p, i) => {
            const isInternalEmbed = p.embed_in_app && p.link_url;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
                whileHover={{ y: -4 }}
                className="group rounded-3xl border bg-card p-6 shadow-sm hover:shadow-lg transition-all relative overflow-hidden"
              >
                <div className="absolute -top-8 -right-8 h-28 w-28 rounded-full bg-primary/10 group-hover:bg-primary/20 transition" />
                <div className="relative">
                  {p.category && (
                    <span className="inline-block text-[10px] uppercase tracking-wider font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full mb-2">{p.category}</span>
                  )}
                  {p.logo_url ? (
                    p.logo_url.startsWith("http")
                      ? <img src={p.logo_url} alt={p.title} className="h-14 w-14 mb-3 object-contain rounded-xl bg-card border p-1.5" />
                      : <SignedImage bucket="coaching-logos" path={p.logo_url} alt={p.title} className="h-14 w-14 mb-3 object-contain rounded-xl bg-card border p-1.5" />
                  ) : (
                    <div className="text-4xl mb-3">{p.emoji ?? "📚"}</div>
                  )}
                  <h3 className="font-display text-xl font-semibold">{p.title}</h3>
                  {p.subtitle && <p className="text-sm font-medium text-primary mt-1">{p.subtitle}</p>}
                  {p.description && <p className="text-sm text-muted-foreground mt-2">{p.description}</p>}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {p.link_url && (
                      isInternalEmbed ? (
                        <Link to="/embed/$id" params={{ id: p.id }} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                          Explore Now <ArrowRight className="h-3.5 w-3.5" />
                        </Link>
                      ) : (
                        <a href={p.link_url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
                          Explore Now <ArrowRight className="h-3.5 w-3.5" />
                        </a>
                      )
                    )}
                    {p.whatsapp_url && (
                      <a href={p.whatsapp_url} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border bg-card text-sm font-medium hover:bg-muted">
                        <MessageCircle className="h-3.5 w-3.5" /> Join channel
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
