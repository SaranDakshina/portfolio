"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { setLenis } from "@/lib/scroll";

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      lerp: 0.08,
      smoothWheel: true,
      wheelMultiplier: 0.9,
      overscroll: false,
    });

    setLenis(lenis);

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    let tickerCallback: ((time: number) => void) | null = null;
    let scrollTriggerCleanup: (() => void) | null = null;

    async function setupGsap() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      lenis.on("scroll", ScrollTrigger.update);

      ScrollTrigger.scrollerProxy(document.documentElement, {
        scrollTop(value) {
          if (arguments.length && value !== undefined) {
            lenis.scrollTo(value, { immediate: true });
          }
          return lenis.scroll;
        },
        getBoundingClientRect() {
          return {
            top: 0,
            left: 0,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        },
      });

      const onRefresh = () => lenis.resize();
      ScrollTrigger.addEventListener("refresh", onRefresh);

      cancelAnimationFrame(rafId);
      tickerCallback = (time: number) => {
        lenis.raf(time * 1000);
      };
      gsap.ticker.add(tickerCallback);
      gsap.ticker.lagSmoothing(0);

      scrollTriggerCleanup = () => {
        ScrollTrigger.removeEventListener("refresh", onRefresh);
        if (tickerCallback) gsap.ticker.remove(tickerCallback);
        ScrollTrigger.scrollerProxy(document.documentElement, {});
      };
    }

    void setupGsap();

    const onLoad = () => lenis.resize();
    window.addEventListener("load", onLoad);

    return () => {
      window.removeEventListener("load", onLoad);
      cancelAnimationFrame(rafId);
      scrollTriggerCleanup?.();
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return <>{children}</>;
}
