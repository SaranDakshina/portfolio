export default function MoonPlaygroundBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Light sky */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 120% 80% at 50% 100%, var(--color-grey-border) 0%, var(--color-canvas) 50%, color-mix(in oklab, var(--color-canvas) 90%, var(--color-accent) 10%) 100%)",
        }}
      />

      {/* Distant planet glow */}
      <div
        className="absolute -top-8 -left-8 w-32 h-32 md:w-40 md:h-40 rounded-full opacity-30"
        style={{
          background:
            "radial-gradient(circle at 40% 40%, rgba(196, 83, 42, 0.1) 0%, var(--color-grey-light) 35%, transparent 70%)",
          boxShadow: "0 0 60px 20px rgba(196, 83, 42, 0.1)",
        }}
      />

      {/* Orange star field */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 12% 18%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 28% 42%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 45% 12%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 62% 28%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 78% 8%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 88% 35%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 8% 55%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 22% 72%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 55% 65%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 72% 58%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 92% 68%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 38% 88%, rgba(196, 83, 42, 0.1) 50%, transparent 50%)
          `,
        }}
      />

      {/* Comets */}
      <div className="moon-comet moon-comet--1" />
      <div className="moon-comet moon-comet--2" />
      <div className="moon-comet moon-comet--3" />

      {/* Moon disc */}
      <div
        className="absolute -bottom-[35%] -right-[15%] w-[75%] aspect-square rounded-full"
        style={{
          background: `
            radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--color-canvas) 90%, var(--color-accent) 10%) 0%, color-mix(in oklab, var(--color-canvas) 92%, var(--color-accent) 8%) 40%, var(--color-canvas) 100%)
          `,
          boxShadow: "inset -12px -12px 40px rgba(255, 255, 255, 0.5), 0 0 80px rgba(196, 83, 42, 0.1)",
        }}
      />

      {/* Moon craters */}
      <div
        className="absolute -bottom-[35%] -right-[15%] w-[75%] aspect-square rounded-full opacity-40"
        style={{
          background: `
            radial-gradient(circle at 25% 35%, rgba(196, 83, 42, 0.1) 0%, transparent 8%),
            radial-gradient(circle at 55% 25%, rgba(196, 83, 42, 0.08) 0%, transparent 6%),
            radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.35) 0%, transparent 10%),
            radial-gradient(circle at 40% 60%, rgba(196, 83, 42, 0.06) 0%, transparent 7%),
            radial-gradient(circle at 60% 70%, rgba(196, 83, 42, 0.08) 0%, transparent 9%),
            radial-gradient(circle at 30% 75%, rgba(196, 83, 42, 0.07) 0%, transparent 5%)
          `,
        }}
      />

      {/* Surface grain */}
      <div className="grain-overlay grain-overlay--inline absolute inset-0" />
    </div>
  );
}
