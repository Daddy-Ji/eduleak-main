import { useEffect, useState } from "react";
import { Bell, BellRing, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const SEEN_KEY = "edushare_notifs_seen";

type Notif = { id: string; title: string; body: string | null; link_url: string | null; created_at: string };

export function NotificationBell() {
  const [items, setItems] = useState<Notif[]>([]);
  const [open, setOpen] = useState(false);
  const [seenIds, setSeenIds] = useState<string[]>([]);

  useEffect(() => {
    setSeenIds(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]"));
    supabase.from("notifications").select("*").eq("is_active", true)
      .order("created_at", { ascending: false }).limit(20)
      .then(({ data }) => {
        const list = (data ?? []) as Notif[];
        setItems(list);
        // Browser push: show native notification for new items if granted
        const seen = new Set(JSON.parse(localStorage.getItem(SEEN_KEY) ?? "[]"));
        if (typeof Notification !== "undefined" && Notification.permission === "granted") {
          list.filter((n) => !seen.has(n.id)).slice(0, 3).forEach((n) => {
            try { new Notification(n.title, { body: n.body ?? "" }); } catch {}
          });
        }
      });
  }, []);

  const unread = items.filter((n) => !seenIds.includes(n.id)).length;

  const markAll = () => {
    const ids = items.map((n) => n.id);
    localStorage.setItem(SEEN_KEY, JSON.stringify(ids));
    setSeenIds(ids);
  };

  const enablePush = async () => {
    if (typeof Notification === "undefined") return;
    const perm = await Notification.requestPermission();
    if (perm === "granted") new Notification("Notifications enabled", { body: "We'll keep you posted." });
  };

  return (
    <div className="relative">
      <button
        onClick={() => { setOpen(!open); if (!open) markAll(); }}
        className="relative p-2 rounded-md hover:bg-muted"
        aria-label="Notifications"
      >
        {unread > 0 ? <BellRing className="h-4 w-4 text-primary" /> : <Bell className="h-4 w-4" />}
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-4 w-4 rounded-full bg-coral text-[10px] font-bold text-white flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              className="absolute right-0 mt-2 w-80 max-h-96 overflow-auto rounded-2xl border bg-card shadow-xl z-50"
            >
              <div className="flex items-center justify-between p-3 border-b">
                <h3 className="font-semibold text-sm">Notifications</h3>
                <button onClick={() => setOpen(false)} className="p-1 rounded hover:bg-muted">
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
              {typeof Notification !== "undefined" && Notification.permission === "default" && (
                <button onClick={enablePush} className="w-full px-3 py-2 text-xs bg-primary/10 text-primary border-b hover:bg-primary/20 transition">
                  Enable browser push notifications
                </button>
              )}
              {items.length === 0 ? (
                <p className="text-sm text-muted-foreground p-6 text-center">No notifications yet.</p>
              ) : (
                <ul className="divide-y">
                  {items.map((n) => (
                    <li key={n.id} className="p-3 hover:bg-muted/50">
                      {n.link_url ? (
                        <a href={n.link_url} target="_blank" rel="noreferrer" className="block">
                          <div className="font-medium text-sm">{n.title}</div>
                          {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                        </a>
                      ) : (
                        <div>
                          <div className="font-medium text-sm">{n.title}</div>
                          {n.body && <p className="text-xs text-muted-foreground mt-0.5">{n.body}</p>}
                        </div>
                      )}
                      <div className="text-[10px] text-muted-foreground mt-1">{new Date(n.created_at).toLocaleDateString()}</div>
                    </li>
                  ))}
                </ul>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
