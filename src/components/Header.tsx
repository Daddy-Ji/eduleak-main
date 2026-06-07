import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, GraduationCap, Sun, Moon, ShieldCheck, Home, Layers, Users, Award, Info, LogOut, LogIn } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { NotificationBell } from "@/components/NotificationBell";
import { SignedImage } from "@/components/SignedImage";
import { motion, AnimatePresence } from "framer-motion";

type NavItem = { to: string; label: string; icon: any; hash?: boolean };
const nav: NavItem[] = [
  { to: "/", label: "Home", icon: Home },
  { to: "/#portals", label: "Portals", icon: Layers, hash: true },
  { to: "/coachings", label: "Coachings", icon: Users },
  { to: "/exams", label: "Exams", icon: Award },
  { to: "/about", label: "About", icon: Info },
];

export function Header() {
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const [site, setSite] = useState<{ site_name?: string | null; site_logo_url?: string | null }>({});
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const saved = localStorage.getItem("theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
    supabase.from("site_settings").select("site_name, site_logo_url").eq("id", "singleton").maybeSingle()
      .then(({ data }) => { if (data) setSite(data); });
  }, []);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const siteName = site.site_name ?? "EduLeak";
  const logo = site.site_logo_url;

  return (
    <>
      <header className="sticky top-0 z-40 glass border-b">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center h-16 gap-4">
          <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground overflow-hidden">
              {logo ? (
                logo.startsWith("http")
                  ? <img src={logo} alt={siteName} className="h-full w-full object-cover" />
                  : <SignedImage bucket="coaching-logos" path={logo} alt={siteName} className="h-full w-full object-cover" />
              ) : <GraduationCap className="h-5 w-5" />}
            </span>
            <span>{siteName}</span>
          </Link>

          <nav className="hidden md:flex items-center gap-1 ml-6">
            {nav.map((n) => (
              n.hash ? (
                <a key={n.to} href={n.to} className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors">{n.label}</a>
              ) : (
                <Link
                  key={n.to}
                  to={n.to}
                  className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                  activeProps={{ className: "px-3 py-2 rounded-md text-sm font-medium text-primary bg-secondary" }}
                  activeOptions={{ exact: n.to === "/" }}
                >
                  {n.label}
                </Link>
              )
            ))}
          </nav>

          <div className="ml-auto flex items-center gap-1">
            <NotificationBell />
            <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-muted" aria-label="Toggle theme">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            {isAdmin && (
              <Link to="/admin" className="hidden sm:inline-flex ml-1">
                <Button size="sm" variant="outline" className="gap-1.5"><ShieldCheck className="h-4 w-4" />Admin</Button>
              </Link>
            )}
            {!user && (
              <Link to="/auth" className="hidden sm:inline-flex ml-1"><Button size="sm">Sign in</Button></Link>
            )}
            <button onClick={() => setOpen(true)} className="p-2 rounded-md hover:bg-muted ml-1" aria-label="Menu">
              <Menu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-80 max-w-[85vw] bg-card border-l shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b">
                <span className="font-display font-bold text-lg">Menu</span>
                <button onClick={() => setOpen(false)} className="p-2 rounded hover:bg-muted">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <nav className="flex-1 overflow-auto p-3 space-y-1">
                {nav.map((n) => (
                  n.hash ? (
                    <a key={n.to} href={n.to} onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium">
                      <n.icon className="h-4 w-4 text-primary" /> {n.label}
                    </a>
                  ) : (
                    <Link key={n.to} to={n.to} onClick={() => setOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium">
                      <n.icon className="h-4 w-4 text-primary" /> {n.label}
                    </Link>
                  )
                ))}
                {isAdmin && (
                  <Link to="/admin" onClick={() => setOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-sm font-medium">
                    <ShieldCheck className="h-4 w-4 text-primary" /> Admin
                  </Link>
                )}
              </nav>
              <div className="p-4 border-t">
                {user ? (
                  <Button variant="outline" className="w-full gap-2" onClick={() => { supabase.auth.signOut(); setOpen(false); }}>
                    <LogOut className="h-4 w-4" /> Sign out
                  </Button>
                ) : (
                  <Link to="/auth" onClick={() => setOpen(false)}>
                    <Button className="w-full gap-2"><LogIn className="h-4 w-4" /> Sign in</Button>
                  </Link>
                )}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
