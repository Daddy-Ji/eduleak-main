import { Link, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Menu, X, GraduationCap, Sun, Moon, ShieldCheck } from "lucide-react";
import { useAuth } from "@/lib/use-auth";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

const nav = [
  { to: "/", label: "Home" },
  { to: "/courses", label: "Courses" },
  { to: "/coachings", label: "Coachings" },
  { to: "/exams", label: "Exams" },
  { to: "/about", label: "About" },
];

export function Header() {
  const { user, isAdmin } = useAuth();
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => { setOpen(false); }, [path]);
  useEffect(() => {
    const saved = localStorage.getItem("theme") === "dark";
    setDark(saved);
    document.documentElement.classList.toggle("dark", saved);
  }, []);
  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  return (
    <header className="sticky top-0 z-40 glass border-b">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 flex items-center h-16 gap-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </span>
          <span>EduShare</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-6">
          {nav.map((n) => (
            <Link
              key={n.to}
              to={n.to}
              className="px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              activeProps={{ className: "px-3 py-2 rounded-md text-sm font-medium text-primary bg-secondary" }}
              activeOptions={{ exact: n.to === "/" }}
            >
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-muted" aria-label="Toggle theme">
            {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          {isAdmin && (
            <Link to="/admin" className="hidden sm:inline-flex">
              <Button size="sm" variant="outline" className="gap-1.5"><ShieldCheck className="h-4 w-4" />Admin</Button>
            </Link>
          )}
          {user ? (
            <Button size="sm" variant="ghost" onClick={() => supabase.auth.signOut()}>Sign out</Button>
          ) : (
            <Link to="/auth"><Button size="sm">Sign in</Button></Link>
          )}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-md hover:bg-muted" aria-label="Menu">
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t bg-background">
          <nav className="px-4 py-3 flex flex-col gap-1">
            {nav.map((n) => (
              <Link key={n.to} to={n.to} className="px-3 py-2 rounded-md hover:bg-muted">{n.label}</Link>
            ))}
            {isAdmin && <Link to="/admin" className="px-3 py-2 rounded-md hover:bg-muted">Admin</Link>}
          </nav>
        </div>
      )}
    </header>
  );
}
