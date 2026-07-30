const TWINKLE_STARS = [
  { left: "4%", top: "8%", size: 2, delay: "0.5s", duration: "5s", glow: true },
  { left: "14%", top: "18%", size: 1.5, delay: "1.2s", duration: "4.8s" },
  { left: "22%", top: "6%", size: 1.5, delay: "2s", duration: "6s" },
  { left: "32%", top: "22%", size: 2, delay: "3.4s", duration: "5.2s", glow: true },
  { left: "44%", top: "10%", size: 1.5, delay: "0.8s", duration: "4.5s" },
  { left: "52%", top: "4%", size: 2, delay: "2.6s", duration: "5.8s" },
  { left: "58%", top: "28%", size: 1.5, delay: "4.2s", duration: "6.4s" },
  { left: "68%", top: "5%", size: 2, delay: "1.1s", duration: "5.5s", glow: true },
  { left: "76%", top: "16%", size: 1.5, delay: "3.8s", duration: "4.2s" },
  { left: "88%", top: "14%", size: 1.5, delay: "2.8s", duration: "4.8s" },
  { left: "94%", top: "32%", size: 2, delay: "0.3s", duration: "5.6s" },
  { left: "8%", top: "38%", size: 1.5, delay: "1.9s", duration: "5.1s" },
  { left: "18%", top: "52%", size: 2, delay: "4s", duration: "6.2s", glow: true },
  { left: "36%", top: "44%", size: 1.5, delay: "2.1s", duration: "4.6s" },
  { left: "48%", top: "58%", size: 1.5, delay: "3.2s", duration: "5.4s" },
  { left: "62%", top: "48%", size: 2, delay: "1.5s", duration: "5.9s" },
  { left: "72%", top: "62%", size: 1.5, delay: "0.6s", duration: "4.9s" },
  { left: "84%", top: "52%", size: 2, delay: "2.4s", duration: "6s", glow: true },
  { left: "92%", top: "48%", size: 2, delay: "0s", duration: "5.2s" },
  { left: "6%", top: "68%", size: 1.5, delay: "3.6s", duration: "5.3s" },
  { left: "24%", top: "74%", size: 2, delay: "1.4s", duration: "4.7s" },
  { left: "42%", top: "82%", size: 1.5, delay: "2.9s", duration: "6.1s" },
  { left: "56%", top: "72%", size: 2, delay: "0.9s", duration: "5.7s", glow: true },
  { left: "70%", top: "78%", size: 1.5, delay: "4.4s", duration: "4.4s" },
  { left: "5%", top: "78%", size: 1.5, delay: "1.6s", duration: "5.8s" },
  { left: "80%", top: "88%", size: 2, delay: "3.1s", duration: "5.5s" },
  { left: "85%", top: "84%", size: 1.5, delay: "3s", duration: "4.6s" },
  { left: "96%", top: "76%", size: 1.5, delay: "2.2s", duration: "5s" },
];

const SHOOTING_STARS = [
  { top: "6%", right: "-4%", delay: "2s", duration: "14s" },
  { top: "22%", right: "8%", delay: "8s", duration: "16s" },
  { top: "34%", right: "-2%", delay: "19s", duration: "15s" },
];

export default function DarkSpaceBackground({ withMoon = false }: { withMoon?: boolean }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
      {/* Dense faint star field */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            radial-gradient(1px 1px at 10% 25%, rgba(250, 249, 246, 0.16) 50%, transparent 50%),
            radial-gradient(1px 1px at 16% 12%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 28% 18%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 34% 36%, rgba(250, 249, 246, 0.14) 50%, transparent 50%),
            radial-gradient(1px 1px at 38% 55%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 48% 8%, rgba(250, 249, 246, 0.14) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 52% 28%, rgba(250, 249, 246, 0.14) 50%, transparent 50%),
            radial-gradient(1px 1px at 58% 66%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 64% 62%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 72% 14%, rgba(250, 249, 246, 0.14) 50%, transparent 50%),
            radial-gradient(1px 1px at 76% 20%, rgba(250, 249, 246, 0.16) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 84% 42%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 88% 58%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 94% 70%, rgba(250, 249, 246, 0.14) 50%, transparent 50%),
            radial-gradient(1px 1px at 6% 44%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 18% 68%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 26% 86%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 46% 82%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 54% 92%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1.5px 1.5px at 70% 88%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 30% 92%, rgba(250, 249, 246, 0.12) 50%, transparent 50%),
            radial-gradient(1px 1px at 82% 94%, rgba(250, 249, 246, 0.12) 50%, transparent 50%)
          `,
        }}
      />

      {/* Glowing twinkling stars */}
      {TWINKLE_STARS.map((star, i) => (
        <span
          key={i}
          className={`space-star space-star--dark${star.glow ? " space-star--dark-glow" : ""}`}
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

      {/* Shooting stars */}
      {SHOOTING_STARS.map((star, i) => (
        <div
          key={i}
          className="shooting-star"
          style={{
            top: star.top,
            right: star.right,
            animationDelay: star.delay,
            animationDuration: star.duration,
          }}
        />
      ))}

      {/* Optional full moon (mobile nav overlay) */}
      {withMoon && (
        <>
          <div
            className="absolute w-40 h-40 rounded-full"
            style={{
              right: "-2rem",
              bottom: "8%",
              background: `
                radial-gradient(circle at 35% 30%, rgba(250, 249, 246, 0.14) 0%, rgba(250, 249, 246, 0.08) 40%, rgba(250, 249, 246, 0.05) 100%)
              `,
              boxShadow:
                "inset -8px -8px 24px rgba(255, 255, 255, 0.1), 0 0 50px rgba(250, 249, 246, 0.06)",
            }}
          />
          <div
            className="absolute w-40 h-40 rounded-full opacity-40"
            style={{
              right: "-2rem",
              bottom: "8%",
              background: `
                radial-gradient(circle at 25% 35%, rgba(250, 249, 246, 0.1) 0%, transparent 12%),
                radial-gradient(circle at 55% 25%, rgba(250, 249, 246, 0.07) 0%, transparent 10%),
                radial-gradient(circle at 70% 50%, rgba(255, 255, 255, 0.2) 0%, transparent 14%),
                radial-gradient(circle at 40% 65%, rgba(250, 249, 246, 0.06) 0%, transparent 11%)
              `,
            }}
          />
        </>
      )}
    </div>
  );
}
