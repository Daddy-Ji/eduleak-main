import { QueryClient, QueryClientProvider, useQueryClient } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  useRouterState,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { TelegramPopup } from "@/components/TelegramPopup";
import { getSiteSettings } from "@/lib/courses.functions";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { AnimatedBackground } from "@/components/AnimatedBackground";
import { IntroAnimation } from "@/components/IntroAnimation";

function NotFoundComponent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="max-w-md text-center py-24">
          <h1 className="font-display text-8xl font-bold text-gradient">404</h1>
          <p className="mt-4 text-lg text-muted-foreground">This page doesn't exist (yet).</p>
          <a href="/" className="inline-block mt-6 px-5 py-2.5 rounded-xl bg-primary text-primary-foreground hover:opacity-90">Back home</a>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <h1 className="font-display text-2xl">Something went wrong</h1>
        <p className="mt-2 text-muted-foreground text-sm">{error.message}</p>
        <button onClick={() => { router.invalidate(); reset(); }} className="mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground">Try again</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "EduLeak - Quality Education for Free" },
      { name: "description", content: "Premium courses for free from India's top coachings for every competitive exams like JEE, NEET, UPSC and more. Calm, ad-free, and organised." },
      { name: "author", content: "EduLeak" },
      { property: "og:title", content: "EduLeak - Quality Education for Free" },
      { property: "og:description", content: "Premium courses for free from India's top coachings for every competitive exams like JEE, NEET, UPSC and more. Calm, ad-free, and organised." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "EduLeak - Quality Education for Free" },
      { name: "twitter:description", content: "Premium courses for free from India's top coachings for every competitive exams like JEE, NEET, UPSC and more. Calm, ad-free, and organised." },
      { property: "og:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/7GtJziyJz7hFTFfEdW8HuPnsOm62/social-images/social-1780899260531-1000373964.webp" },
      { name: "twitter:image", content: "https://storage.googleapis.com/gpt-engineer-file-uploads/7GtJziyJz7hFTFfEdW8HuPnsOm62/social-images/social-1780899260531-1000373964.webp" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function AppShell() {
  const router = useRouter();
  const qc = useQueryClient();
  const path = useRouterState({ select: (s) => s.location.pathname });
  const isAdmin = path.startsWith("/admin");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      router.invalidate();
      qc.invalidateQueries();
    });
    return () => subscription.unsubscribe();
  }, [router, qc]);

  const { data: settings } = useQuery({
    queryKey: ["site_settings"],
    queryFn: () => getSiteSettings(),
  });

  return (
    <div className="min-h-screen flex flex-col relative">
      {!isAdmin && <AnimatedBackground />}
      {!isAdmin && (settings?.intro_animation_enabled !== false) && <IntroAnimation siteName={(settings as any)?.site_name ?? "EduLeak"} />}
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      {!isAdmin && <Footer telegramUrl={settings?.telegram_url} />}
      {!isAdmin && (settings?.telegram_popup_enabled !== false) && <TelegramPopup url={settings?.telegram_url} />}
      <Toaster richColors position="top-right" />
    </div>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <AppShell />
    </QueryClientProvider>
  );
}
