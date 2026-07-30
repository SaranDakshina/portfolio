const TWINKLE_STARS = [
  { left: "8%", top: "22%", size: 2, delay: "0s", duration: "4.5s" },
  { left: "18%", top: "58%", size: 1.5, delay: "1.2s", duration: "5.5s" },
  { left: "30%", top: "14%", size: 2, delay: "2.4s", duration: "4s" },
  { left: "58%", top: "10%", size: 1.5, delay: "0.8s", duration: "6s" },
  { left: "74%", top: "30%", size: 2, delay: "3.1s", duration: "4.8s" },
  { left: "86%", top: "16%", size: 1.5, delay: "1.8s", duration: "5.2s" },
  { left: "90%", top: "62%", size: 2, delay: "2.7s", duration: "4.2s" },
  { left: "12%", top: "80%", size: 1.5, delay: "3.6s", duration: "5.8s" },
];

export default function HeroSpaceBackground() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Static star field */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 15% 35%, rgba(196, 83, 42, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 25% 25%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 42% 45%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 50% 20%, rgba(196, 83, 42, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 66% 42%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 80% 48%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 94% 38%, rgba(196, 83, 42, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 6% 50%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 36% 70%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 62% 76%, rgba(196, 83, 42, 0.1) 50%, transparent 50%),
            radial-gradient(1px 1px at 82% 84%, rgba(196, 83, 42, 0.1) 50%, transparent 50%)
          `,
        }}
      />

      {/* Twinkling stars */}
      {TWINKLE_STARS.map((star, i) => (
        <span
          key={i}
          className="space-star space-star--light"
          style={{
            left: star.left,
            top: star.top,
            width: star.size,
            height: star.size,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {/* Rare, slow comets */}
      <div className="moon-comet moon-comet--hero-1" />
      <div className="moon-comet moon-comet--hero-2" />

      {/* Faint full moon, upper left — echoes the Skills playground moon */}
      <div
        className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full"
        style={{
          left: "clamp(1rem, 6vw, 5rem)",
          top: "18%",
          background: `
            radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--color-canvas) 90%, var(--color-accent) 10%) 0%, color-mix(in oklab, var(--color-canvas) 92%, var(--color-accent) 8%) 40%, var(--color-canvas) 100%)
          `,
          boxShadow:
            "inset -4px -4px 12px rgba(255, 255, 255, 0.45), 0 0 40px rgba(196, 83, 42, 0.08)",
        }}
      />
      <div
        className="absolute w-16 h-16 md:w-24 md:h-24 rounded-full opacity-35"
        style={{
          left: "clamp(1rem, 6vw, 5rem)",
          top: "18%",
          background: `
            radial-gradient(circle at 25% 35%, rgba(196, 83, 42, 0.12) 0%, transparent 12%),
            radial-gradient(circle at 55% 25%, rgba(196, 83, 42, 0.08) 0%, transparent 10%),
            radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.35) 0%, transparent 14%),
            radial-gradient(circle at 40% 65%, rgba(196, 83, 42, 0.06) 0%, transparent 11%)
          `,
        }}
      />
    </div>
  );
}
