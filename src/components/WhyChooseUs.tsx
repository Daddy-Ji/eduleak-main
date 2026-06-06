import { motion } from "framer-motion";

type Item = { id: string; title: string; description: string | null; icon: string | null };

export function WhyChooseUs({ items, title, subtitle }: { items: Item[]; title: string; subtitle: string }) {
  if (items.length === 0) return null;
  return (
    <section className="py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">Why Choose Us</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">{title}</h2>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((it, i) => (
            <motion.div key={it.id}
              initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border bg-card p-6 hover:shadow-soft hover:-translate-y-1 transition">
              <div className="text-3xl mb-3">{it.icon}</div>
              <h3 className="font-display text-lg font-semibold">{it.title}</h3>
              {it.description && <p className="text-sm text-muted-foreground mt-1.5">{it.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AudienceSection({ items, title, subtitle }: { items: Item[]; title: string; subtitle: string }) {
  if (items.length === 0) return null;
  return (
    <section className="py-20 bg-gradient-to-b from-transparent to-primary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="inline-block px-3 py-1 rounded-full bg-accent/40 text-accent-foreground text-xs font-medium mb-3">🎯 Built for You</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold">{title}</h2>
          <p className="text-muted-foreground mt-2">{subtitle}</p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {items.map((it, i) => (
            <motion.div key={it.id}
              initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }} transition={{ delay: i * 0.05 }}
              className="rounded-2xl border bg-card p-6 text-center hover:-translate-y-1 transition">
              <div className="text-4xl mb-3">{it.icon}</div>
              <h3 className="font-display text-lg font-semibold">{it.title}</h3>
              {it.description && <p className="text-sm text-muted-foreground mt-1.5">{it.description}</p>}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ReadyToStart({ title, subtitle, buttonText, buttonUrl }: { title: string; subtitle: string; buttonText: string; buttonUrl: string }) {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-5xl px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="rounded-3xl bg-gradient-to-br from-primary via-primary to-primary/70 text-primary-foreground p-12 sm:p-16 text-center shadow-2xl relative overflow-hidden"
        >
          <motion.div className="absolute -top-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 6, repeat: Infinity }} />
          <motion.div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"
            animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 6, repeat: Infinity }} />
          <div className="relative">
            <h2 className="font-display text-3xl sm:text-5xl font-semibold">{title}</h2>
            <p className="mt-3 max-w-xl mx-auto opacity-90 text-lg">{subtitle}</p>
            <a href={buttonUrl} className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl bg-background text-foreground font-semibold hover:scale-105 transition">
              {buttonText}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
