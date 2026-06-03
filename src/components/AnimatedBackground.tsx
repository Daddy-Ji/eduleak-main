// Continuous, low-distraction ambient background.
// Large blobs drift slowly; small shapes drift faster.
// Pointer-events: none so nothing blocks UI.

export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
      {/* Big slow blobs */}
      <div className="absolute -top-40 -left-32 h-[42rem] w-[42rem] rounded-full opacity-50 blur-3xl animate-blob-slow"
        style={{ background: "radial-gradient(closest-side, oklch(0.88 0.09 50 / 0.55), transparent)" }} />
      <div className="absolute top-1/3 -right-40 h-[36rem] w-[36rem] rounded-full opacity-50 blur-3xl animate-blob-slower"
        style={{ background: "radial-gradient(closest-side, oklch(0.85 0.12 30 / 0.45), transparent)" }} />
      <div className="absolute bottom-0 left-1/4 h-[34rem] w-[34rem] rounded-full opacity-40 blur-3xl animate-blob-slow"
        style={{ background: "radial-gradient(closest-side, oklch(0.82 0.07 200 / 0.45), transparent)" }} />

      {/* Small drifting shapes */}
      <svg className="absolute top-[12%] left-[8%] h-8 w-8 text-coral/70 animate-float-fast" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l2.4 6.6L21 9.3l-5.1 4.5L17.4 21 12 17.3 6.6 21l1.5-7.2L3 9.3l6.6-.7L12 2z" />
      </svg>
      <svg className="absolute top-[22%] right-[12%] h-6 w-6 text-primary/60 animate-float-slow" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="12" cy="12" r="6" />
      </svg>
      <svg className="absolute top-[55%] left-[6%] h-10 w-10 animate-float-medium" viewBox="0 0 40 40" fill="none">
        <path d="M5 30 L20 8 L35 30 Z" stroke="oklch(0.72 0.13 30 / 0.55)" strokeWidth="1.8" />
      </svg>
      <svg className="absolute top-[68%] right-[18%] h-7 w-7 animate-float-fast" viewBox="0 0 24 24" fill="none" stroke="oklch(0.55 0.09 195 / 0.55)" strokeWidth="2">
        <path d="M4 12c0-4 4-8 8-8s8 4 8 8-4 8-8 8" />
      </svg>
      <svg className="absolute top-[40%] left-[45%] h-5 w-5 animate-twinkle" viewBox="0 0 24 24" fill="oklch(0.78 0.13 60 / 0.7)">
        <path d="M12 0l2 10 10 2-10 2-2 10-2-10L0 12l10-2z" />
      </svg>
      <svg className="absolute top-[80%] left-[30%] h-6 w-6 animate-float-medium" viewBox="0 0 24 24" fill="oklch(0.88 0.06 30 / 0.7)">
        <rect x="4" y="4" width="16" height="16" rx="4" />
      </svg>
      <svg className="absolute top-[15%] right-[35%] h-4 w-4 animate-twinkle" style={{ animationDelay: "1.5s" }} viewBox="0 0 24 24" fill="oklch(0.72 0.13 30 / 0.8)">
        <circle cx="12" cy="12" r="6" />
      </svg>
    </div>
  );
}
