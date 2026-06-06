import { createFileRoute, Link, useParams } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, ExternalLink, Loader2 } from "lucide-react";

export const Route = createFileRoute("/embed/$id")({
  head: () => ({ meta: [{ title: "Loading…" }, { name: "robots", content: "noindex" }] }),
  component: EmbedPage,
});

function EmbedPage() {
  const { id } = useParams({ from: "/embed/$id" });
  const [portal, setPortal] = useState<any | null>(null);
  const [failed, setFailed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    supabase.from("portals").select("*").eq("id", id).maybeSingle().then(({ data }) => setPortal(data));
  }, [id]);

  useEffect(() => {
    if (!portal?.link_url) return;
    // Fallback: if iframe doesn't load in 6s, assume blocked
    const t = setTimeout(() => { if (!ready) setFailed(true); }, 6000);
    return () => clearTimeout(t);
  }, [portal, ready]);

  if (!portal) return <div className="p-12 text-center text-muted-foreground"><Loader2 className="inline animate-spin mr-2" /> Loading…</div>;

  return (
    <div className="fixed inset-0 top-16 flex flex-col bg-background">
      <div className="flex items-center gap-3 px-4 py-2 border-b bg-card">
        <Link to="/" className="p-2 rounded hover:bg-muted"><ArrowLeft className="h-4 w-4" /></Link>
        <div className="flex-1 min-w-0">
          <div className="font-semibold truncate">{portal.title}</div>
          {portal.subtitle && <div className="text-xs text-muted-foreground truncate">{portal.subtitle}</div>}
        </div>
        <a href={portal.link_url} target="_blank" rel="noreferrer"
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm hover:bg-muted">
          <ExternalLink className="h-3.5 w-3.5" /> Open
        </a>
      </div>
      <div className="flex-1 relative bg-muted/30">
        {failed ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
            <p className="text-muted-foreground mb-4">This site doesn't allow embedding.</p>
            <a href={portal.link_url} target="_blank" rel="noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90">
              <ExternalLink className="h-4 w-4" /> Open in new tab
            </a>
          </div>
        ) : (
          <iframe
            src={portal.link_url}
            title={portal.title}
            className="absolute inset-0 w-full h-full border-0"
            onLoad={() => setReady(true)}
            sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-presentation"
            referrerPolicy="no-referrer"
          />
        )}
      </div>
    </div>
  );
}
