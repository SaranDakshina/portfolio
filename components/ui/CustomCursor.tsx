"use client";

import { useEffect, useRef, useState } from "react";
import { isCustomCursorEnabled } from "@/lib/custom-cursor";
import { subscribePointer } from "@/lib/pointer-motion";

const INTERACTIVE_SELECTOR = "a, button, [data-cursor]";

function isInteractive(target: EventTarget | null): boolean {
  if (!(target instanceof Element)) return false;
  return Boolean(target.closest(INTERACTIVE_SELECTOR));
}

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    if (!isCustomCursorEnabled()) return;

    setEnabled(true);
    document.body.classList.add("custom-cursor-active");

    let quickDotX: ((v: number) => void) | null = null;
    let quickDotY: ((v: number) => void) | null = null;
    let quickRingX: ((v: number) => void) | null = null;
    let quickRingY: ((v: number) => void) | null = null;
    let scaleTo: ((v: number) => void) | null = null;
    let hoveringInteractive = false;

    import("gsap").then(({ gsap }) => {
      if (dotRef.current) {
        gsap.set(dotRef.current, { xPercent: -50, yPercent: -50 });
        quickDotX = gsap.quickTo(dotRef.current, "x", { duration: 0.15, ease: "power3.out" });
        quickDotY = gsap.quickTo(dotRef.current, "y", { duration: 0.15, ease: "power3.out" });
      }
      if (ringRef.current) {
        gsap.set(ringRef.current, { xPercent: -50, yPercent: -50, scale: 1 });
        quickRingX = gsap.quickTo(ringRef.current, "x", { duration: 0.45, ease: "power3.out" });
        quickRingY = gsap.quickTo(ringRef.current, "y", { duration: 0.45, ease: "power3.out" });
        scaleTo = gsap.quickTo(ringRef.current, "scale", { duration: 0.25, ease: "power2.out" });
      }
    });

    function setInteractiveHover(active: boolean) {
      if (active === hoveringInteractive) return;
      hoveringInteractive = active;
      if (active) {
        scaleTo?.(1.8);
        ringRef.current?.classList.add("cursor-ring--active");
      } else {
        scaleTo?.(1);
        ringRef.current?.classList.remove("cursor-ring--active");
      }
    }

    const unsubscribe = subscribePointer((px, py) => {
      quickDotX?.(px);
      quickDotY?.(py);
      quickRingX?.(px);
      quickRingY?.(py);
      setInteractiveHover(isInteractive(document.elementFromPoint(px, py)));
    });

    return () => {
      setEnabled(false);
      document.body.classList.remove("custom-cursor-active");
      unsubscribe();
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
