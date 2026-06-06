import { Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle } from "lucide-react";

type Portal = {
  id: string;
  title: string;
  subtitle: string | null;
  description: string | null;
  emoji: string | null;
  link_url: string | null;
  whatsapp_url: string | null;
  embed_in_app: boolean;
};

export function PortalsSection({ portals, title, subtitle }: { portals: Portal[]; title: string; subtitle: string }) {
  if (portals.length === 0) return null;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">{title}</h2>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {portals.map((p, i) => {
            const href = p.embed_in_app && p.link_url
              ? `/embed/${p.id}`
              : p.link_url ?? "#";
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
                  <div className="text-4xl mb-3">{p.emoji ?? "📚"}</div>
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
                        <a href={href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium hover:opacity-90">
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
