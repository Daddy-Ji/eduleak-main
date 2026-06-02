import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, X } from "lucide-react";

const KEY = "edushare_telegram_dismissed_at";
const REMIND_AFTER_DAYS = 7;

export function TelegramPopup({ url }: { url?: string | null }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!url) return;
    const ts = Number(localStorage.getItem(KEY) ?? "0");
    const stale = Date.now() - ts > REMIND_AFTER_DAYS * 86400 * 1000;
    if (stale) {
      const t = setTimeout(() => setOpen(true), 1200);
      return () => clearTimeout(t);
    }
  }, [url]);

  const dismiss = () => {
    localStorage.setItem(KEY, String(Date.now()));
    setOpen(false);
  };

  if (!url) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          onClick={dismiss}
        >
          <motion.div
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md rounded-3xl bg-card p-8 shadow-soft border"
            initial={{ y: 40, scale: 0.96, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 40, scale: 0.96, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
          >
            <button onClick={dismiss} className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-muted">
              <X className="h-4 w-4" />
            </button>
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground mb-4">
              <Send className="h-7 w-7" />
            </div>
            <h2 className="font-display text-2xl font-semibold mb-2">Join our Telegram family</h2>
            <p className="text-muted-foreground text-sm mb-6">
              Get every new course, free notes, and exam updates the moment they drop.
              No spam — just learning.
            </p>
            <div className="flex gap-3">
              <a
                href={url} target="_blank" rel="noopener noreferrer" onClick={dismiss}
                className="flex-1 text-center px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90"
              >
                Join channel
              </a>
              <button onClick={dismiss} className="px-4 py-3 rounded-xl border hover:bg-muted text-sm">
                Maybe later
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
