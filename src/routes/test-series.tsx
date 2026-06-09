import { createFileRoute, ErrorComponent } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { getTestSeries } from "@/lib/courses.functions";
import { PortalsSection } from "@/components/PortalsSection";
import { Loader2, FileText } from "lucide-react";

export const Route = createFileRoute("/test-series")({
  head: () => ({
    meta: [
      { title: "Test Series — EduLeak" },
      { name: "description", content: "Explore free mock tests and test series for JEE, NEET, UPSC and more — all in one place." },
      { property: "og:title", content: "Test Series — EduLeak" },
      { property: "og:description", content: "Free mock tests and test series for every major exam, curated in one place." },
    ],
  }),
  component: TestSeriesPage,
  errorComponent: ErrorComponent,
  notFoundComponent: () => <div className="p-12 text-center text-muted-foreground">Not found.</div>,
});

function TestSeriesPage() {
  const { data, isLoading } = useQuery({ queryKey: ["test_series"], queryFn: () => getTestSeries() });
  const items = (data ?? []) as any[];

  return (
    <div>
      <section className="py-14 border-b bg-gradient-to-br from-card to-primary/5">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium mb-4">
            <FileText className="h-3.5 w-3.5" /> All Test Series in one place
          </div>
          <h1 className="font-display text-4xl sm:text-5xl font-semibold tracking-tight">Explore all Test Series</h1>
          <p className="text-muted-foreground mt-3 max-w-2xl mx-auto">
            Mock tests, full-length tests and topic-wise series from across the web — open inside our site or jump to the source.
          </p>
        </div>
      </section>

      {isLoading ? (
        <div className="p-16 text-center text-muted-foreground"><Loader2 className="inline animate-spin mr-2" /> Loading test series…</div>
      ) : items.length === 0 ? (
        <div className="p-16 text-center text-muted-foreground">No test series added yet. Check back soon.</div>
      ) : (
        <PortalsSection portals={items} title="All Test Series" subtitle="Filter by category to find what you need" />
      )}
    </div>
  );
}
