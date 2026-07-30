"use client";

import { useEffect, useRef, ReactNode } from "react";

interface RevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  y?: number;
}

export default function Reveal({ children, className = "", delay = 0, y = 32 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let gsap: typeof import("gsap").gsap;
    let ScrollTrigger: typeof import("gsap/ScrollTrigger").ScrollTrigger;

    async function init() {
      const gsapModule = await import("gsap");
      const stModule = await import("gsap/ScrollTrigger");
      gsap = gsapModule.gsap;
      ScrollTrigger = stModule.ScrollTrigger;
      gsap.registerPlugin(ScrollTrigger);

      if (!ref.current) return;

      gsap.set(ref.current, { opacity: 0, y });
      gsap.to(ref.current, {
        opacity: 1,
        y: 0,
        duration: 0.9,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ref.current,
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });
    }

    init();

    return () => {
      ScrollTrigger?.getAll().forEach((t) => {
        if (t.vars.trigger === ref.current) t.kill();
      });
    };
  }, [delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
