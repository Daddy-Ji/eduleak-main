import { motion } from "framer-motion";
import heroChar from "@/assets/hero-character.png";

// Staged-entry hero illustration with continuous micro-gestures:
//  - Gentle float on Y
//  - Slow "neck-turn" tilt every ~6s (Tone-Segurado-style)
//  - Floating SVG accents around the character at different speeds
export function HeroIllustration() {
  return (
    <div className="relative w-full max-w-[520px] mx-auto aspect-square">
      {/* Soft backdrop */}
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.9, ease: "easeOut" }}
        className="absolute inset-6 rounded-full blur-2xl"
        style={{ background: "radial-gradient(closest-side, oklch(0.88 0.09 50 / 0.55), transparent 70%)" }}
      />

      {/* Floating accents */}
      <Accent className="top-[6%] left-[2%]" delay={0.7} duration={5}>
        <svg viewBox="0 0 32 32" className="h-9 w-9" fill="oklch(0.72 0.13 30 / 0.9)">
          <path d="M16 3l3.2 8.8L28 12.4l-6.8 6L23.2 27 16 22.6 8.8 27l2-8.6L4 12.4l8.8-.6L16 3z" />
        </svg>
      </Accent>
      <Accent className="top-[10%] right-[4%]" delay={0.9} duration={6.5}>
        <svg viewBox="0 0 40 40" className="h-12 w-12" fill="none" stroke="oklch(0.55 0.09 195 / 0.85)" strokeWidth="2.2">
          <rect x="6" y="10" width="24" height="20" rx="2" />
          <path d="M6 14h24" />
        </svg>
      </Accent>
      <Accent className="bottom-[14%] left-[0%]" delay={1.1} duration={7}>
        <svg viewBox="0 0 32 32" className="h-10 w-10" fill="oklch(0.78 0.13 60 / 0.85)">
          <circle cx="16" cy="16" r="10" />
        </svg>
      </Accent>
      <Accent className="bottom-[6%] right-[6%]" delay={1.3} duration={5.8}>
        <svg viewBox="0 0 36 36" className="h-11 w-11" fill="none" stroke="oklch(0.72 0.13 30 / 0.9)" strokeWidth="2.4">
          <path d="M6 26 L18 6 L30 26 Z" />
        </svg>
      </Accent>
      <Accent className="top-[42%] right-[-2%]" delay={1.5} duration={4.5}>
        <svg viewBox="0 0 24 24" className="h-7 w-7" fill="oklch(0.42 0.08 195 / 0.85)">
          <path d="M12 2l2.4 6.6L21 9.3l-5.1 4.5L17.4 21 12 17.3 6.6 21l1.5-7.2L3 9.3l6.6-.7L12 2z" />
        </svg>
      </Accent>

      {/* The character — staged entry then continuous float + subtle head-turn */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.92 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="absolute inset-0 flex items-end justify-center"
      >
        <motion.img
          src={heroChar}
          alt="A young student reading, surrounded by books"
          width={1024}
          height={1024}
          fetchPriority="high"
          className="w-full h-full object-contain select-none drop-shadow-[0_25px_40px_rgba(180,90,40,0.25)]"
          draggable={false}
          animate={{
            y: [0, -10, 0],
            rotate: [0, -1.5, 1.2, -0.6, 0],
          }}
          transition={{
            y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 9, repeat: Infinity, ease: "easeInOut", times: [0, 0.25, 0.55, 0.8, 1] },
          }}
        />
      </motion.div>
    </div>
  );
}

function Accent({
  children, className, delay, duration,
}: { children: React.ReactNode; className: string; delay: number; duration: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, scale: 1, y: [0, -12, 0], rotate: [0, 8, -6, 0] }}
      transition={{
        opacity: { delay, duration: 0.6 },
        scale: { delay, duration: 0.6, type: "spring", stiffness: 160 },
        y: { delay, duration, repeat: Infinity, ease: "easeInOut" },
        rotate: { delay, duration: duration * 1.4, repeat: Infinity, ease: "easeInOut" },
      }}
      className={`absolute ${className}`}
    >
      {children}
    </motion.div>
  );
}
