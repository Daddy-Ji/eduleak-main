import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap } from "lucide-react";

const KEY = "eduleak_intro_seen";

export function IntroAnimation({ siteName = "EduLeak" }: { siteName?: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem(KEY)) return;
    setShow(true);
    sessionStorage.setItem(KEY, "1");
    const t = setTimeout(() => setShow(false), 2600);
    return () => clearTimeout(t);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-background overflow-hidden"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.08, filter: "blur(8px)" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Soft gradient orbs */}
          <motion.div
            className="absolute -top-40 -left-40 h-[44rem] w-[44rem] rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, oklch(0.85 0.14 30 / 0.55), transparent)" }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.15, 1], opacity: [0, 0.9, 0.7], rotate: [0, 40, 80] }}
            transition={{ duration: 2.6, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute -bottom-40 -right-40 h-[44rem] w-[44rem] rounded-full blur-3xl"
            style={{ background: "radial-gradient(closest-side, oklch(0.82 0.12 220 / 0.55), transparent)" }}
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: [0.6, 1.2, 1], opacity: [0, 0.85, 0.65], rotate: [0, -40, -80] }}
            transition={{ duration: 2.6, ease: "easeInOut" }}
          />

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-2 w-2 rounded-full bg-primary/60"
              initial={{
                x: Math.cos((i / 6) * Math.PI * 2) * 40,
                y: Math.sin((i / 6) * Math.PI * 2) * 40,
                opacity: 0,
              }}
              animate={{
                x: Math.cos((i / 6) * Math.PI * 2) * 180,
                y: Math.sin((i / 6) * Math.PI * 2) * 180,
                opacity: [0, 1, 0],
              }}
              transition={{ duration: 2.2, delay: 0.2 + i * 0.04, ease: "easeOut" }}
            />
          ))}

          <motion.div
            className="relative flex flex-col items-center gap-5"
            initial={{ scale: 0.7, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div
              className="h-24 w-24 rounded-3xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center shadow-2xl"
              animate={{
                rotate: [0, -8, 8, -4, 0],
                scale: [1, 1.05, 1, 1.03, 1],
              }}
              transition={{ duration: 2, ease: "easeInOut" }}
            >
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 2.4, ease: "easeInOut" }}
              >
                <GraduationCap className="h-12 w-12" />
              </motion.div>
            </motion.div>
            <motion.h1
              className="font-display text-5xl font-bold tracking-tight"
              initial={{ y: 16, opacity: 0, letterSpacing: "0.2em" }}
              animate={{ y: 0, opacity: 1, letterSpacing: "-0.02em" }}
              transition={{ delay: 0.4, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            >
              {siteName}
            </motion.h1>
            <motion.div
              className="h-1 w-40 rounded-full bg-muted overflow-hidden"
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 160 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <motion.div
                className="h-full bg-gradient-to-r from-primary to-primary/40"
                initial={{ x: "-100%" }}
                animate={{ x: "0%" }}
                transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1], delay: 0.6 }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
