import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap } from "lucide-react";

const KEY = "edushare_intro_seen";

export function IntroAnimation({ siteName = "EduShare" }: { siteName?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    setShow(true);
    sessionStorage.setItem(KEY, "1");
    const t = setTimeout(() => setShow(false), 2200);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          <div className="absolute inset-0 overflow-hidden">
            <motion.div
              className="absolute -top-32 -left-32 h-[40rem] w-[40rem] rounded-full blur-3xl"
              style={{ background: "radial-gradient(closest-side, oklch(0.85 0.12 30 / 0.6), transparent)" }}
              animate={{ scale: [1, 1.2, 1], rotate: [0, 60, 0] }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
            <motion.div
              className="absolute -bottom-32 -right-32 h-[40rem] w-[40rem] rounded-full blur-3xl"
              style={{ background: "radial-gradient(closest-side, oklch(0.82 0.1 200 / 0.55), transparent)" }}
              animate={{ scale: [1, 1.3, 1], rotate: [0, -60, 0] }}
              transition={{ duration: 2.2, ease: "easeInOut" }}
            />
          </div>
          <motion.div
            className="relative flex flex-col items-center gap-4"
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="h-20 w-20 rounded-2xl bg-primary text-primary-foreground flex items-center justify-center shadow-2xl"
              animate={{ rotate: [0, -10, 10, 0] }}
              transition={{ duration: 1.4, ease: "easeInOut" }}
            >
              <GraduationCap className="h-10 w-10" />
            </motion.div>
            <motion.h1
              className="font-display text-4xl font-bold"
              initial={{ y: 12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              {siteName}
            </motion.h1>
            <motion.div
              className="h-1 w-32 rounded-full bg-gradient-to-r from-primary to-primary/40 overflow-hidden"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
            >
              <motion.div className="h-full w-full bg-primary-foreground/30"
                initial={{ x: "-100%" }} animate={{ x: "100%" }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }} />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
