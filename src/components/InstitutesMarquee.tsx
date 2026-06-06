import { SignedImage } from "@/components/SignedImage";

type Institute = { id: string; name: string; logo_url: string | null; link_url: string | null };

export function InstitutesMarquee({ institutes, title, subtitle }: { institutes: Institute[]; title: string; subtitle: string }) {
  if (institutes.length === 0) return null;
  const loop = [...institutes, ...institutes];
  return (
    <section className="py-16 border-y bg-card/30 overflow-hidden">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 mb-8 text-center">
        <h2 className="font-display text-3xl sm:text-4xl font-semibold">{title}</h2>
        <p className="text-muted-foreground mt-2">{subtitle}</p>
      </div>
      <div className="relative">
        <div className="flex gap-10 animate-marquee whitespace-nowrap">
          {loop.map((inst, i) => {
            const card = (
              <div className="flex flex-col items-center gap-2 min-w-[140px]">
                {inst.logo_url ? inst.logo_url.startsWith("http") ? (
                  <img src={inst.logo_url} alt={inst.name} className="h-20 w-20 rounded-2xl object-contain bg-card border p-2" />
                ) : (
                  <SignedImage bucket="coaching-logos" path={inst.logo_url} alt={inst.name}
                    className="h-20 w-20 rounded-2xl object-contain bg-card border p-2" />
                ) : (
                  <div className="h-20 w-20 rounded-2xl bg-primary/10 flex items-center justify-center font-display text-xl font-bold text-primary">
                    {inst.name.slice(0, 2)}
                  </div>
                )}
                <span className="text-sm font-medium">{inst.name}</span>
              </div>
            );
            return inst.link_url ? (
              <a key={i} href={inst.link_url} target="_blank" rel="noreferrer" className="hover:scale-105 transition-transform">{card}</a>
            ) : (
              <div key={i}>{card}</div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
