import { Link } from "@tanstack/react-router";
import { GraduationCap, Send } from "lucide-react";

export function Footer({ telegramUrl }: { telegramUrl?: string | null }) {
  return (
    <footer className="mt-24 border-t bg-card/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-12 grid gap-8 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 font-display font-bold text-xl">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <GraduationCap className="h-5 w-5" />
            </span>
            EduLeak
          </div>
          <p className="mt-3 text-sm text-muted-foreground max-w-md">
            A calm, ad-free home for India's best free educational content. Curated lessons from leading coachings —
            organised by exam, taught by the teachers students already trust.
          </p>
          {telegramUrl && (
            <a href={telegramUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 mt-4 text-sm px-4 py-2 rounded-full bg-primary text-primary-foreground hover:opacity-90 transition">
              <Send className="h-4 w-4" /> Join Telegram
            </a>
          )}
        </div>
        <div>
          <h4 className="font-semibold mb-3">Explore</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><a href="/#portals" className="hover:text-foreground">Portals</a></li>
            <li><Link to="/coachings" className="hover:text-foreground">Coachings</Link></li>
            <li><Link to="/exams" className="hover:text-foreground">Exams</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Company</h4>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-foreground">Masterminds</Link></li>
            <li><Link to="/auth" className="hover:text-foreground">Sign in</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t py-5 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} EduLeak. Made for learners, by learners.
      </div>
    </footer>
  );
}
