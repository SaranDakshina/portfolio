"use client";

import { useEffect, useRef } from "react";

interface SplitHeadlineProps {
  text: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
  accentWord?: string;
  delay?: number;
}

export default function SplitHeadline({
  text,
  as: Tag = "h2",
  className = "",
  accentWord,
  delay = 0,
}: SplitHeadlineProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!ref.current) return;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      const el = ref.current;
      if (!el) return;

      // Split into words
      const words = el.querySelectorAll<HTMLElement>("[data-word]");

      gsap.fromTo(
        words,
        { opacity: 0, y: "60%", rotateX: -15 },
        {
          opacity: 1,
          y: "0%",
          rotateX: 0,
          duration: 0.7,
          stagger: 0.06,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 90%",
            toggleActions: "play none none none",
          },
        }
      );
    }

    init();
  }, [delay]);

  // Split into words with overflow hidden wrapper
  const words = text.split(" ");

  return (
    <Tag
      ref={ref as React.RefObject<HTMLHeadingElement>}
      className={className}
      style={{ perspective: "600px" }}
    >
      {words.map((word, i) => {
        const isAccent = accentWord && word.replace(/[.,!?]/g, "") === accentWord;
        return (
          <span
            key={i}
            style={{ display: "inline-block", overflow: "hidden", verticalAlign: "bottom" }}
          >
            <span
              data-word
              style={{
                display: "inline-block",
                opacity: 0,
                color: isAccent ? "var(--color-accent)" : undefined,
              }}
            >
              {word}
              {i < words.length - 1 ? "\u00A0" : ""}
            </span>
          </span>
        );
      })}
    </Tag>
  );
}
