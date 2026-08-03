"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import type { gsap as GsapType } from "gsap";
import { scrollToHash } from "@/lib/scroll";
import { stripBasePath, withBasePath } from "@/lib/paths";

interface TransitionContextValue {
  navigate: (href: string) => void;
}

const TransitionContext = createContext<TransitionContextValue | null>(null);

const COVER_DURATION = 0.55;
const HOLD_DURATION = 0.5;
const UNCOVER_DURATION = 0.55;
const PAGE_SETTLE = 0.15;

export function usePageTransition() {
  const ctx = useContext(TransitionContext);
  if (!ctx) {
    throw new Error("usePageTransition must be used within TransitionProvider");
  }
  return ctx;
}

function getPathFromHref(href: string): string {
  try {
    if (href.startsWith("#") || href.startsWith("/#")) {
      return "/";
    }

    const url = new URL(href, window.location.origin);
    return stripBasePath(url.pathname);
  } catch {
    const pathPart = href.split("#")[0] || "/";
    return stripBasePath(pathPart);
  }
}

function getHashFromHref(href: string): string {
  const hashIndex = href.indexOf("#");
  return hashIndex >= 0 ? href.slice(hashIndex) : "";
}

export default function TransitionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const timelineRef = useRef<{ kill: () => void } | null>(null);
  const gsapRef = useRef<typeof GsapType | null>(null);
  const coveredRef = useRef(false);
  const pendingHrefRef = useRef<string | null>(null);
  const isNavigatingRef = useRef(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  useEffect(() => {
    import("gsap").then(({ gsap }) => {
      gsapRef.current = gsap;
    });
  }, []);

  const getGsap = useCallback(async () => {
    if (gsapRef.current) return gsapRef.current;
    const { gsap } = await import("gsap");
    gsapRef.current = gsap;
    return gsap;
  }, []);

  const scrollToTarget = useCallback((hash: string) => {
    if (!hash) return;

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        scrollToHash(hash);
      });
    });
  }, []);

  const resetOverlay = useCallback((overlay: HTMLDivElement) => {
    overlay.style.transition = "";
    overlay.style.transform = "";
  }, []);

  const hideOverlay = useCallback(
    async (overlay: HTMLDivElement) => {
      const gsap = await getGsap();
      gsap.set(overlay, { clearProps: "transform" });
      resetOverlay(overlay);
      setIsTransitioning(false);
      coveredRef.current = false;
      pendingHrefRef.current = null;
      isNavigatingRef.current = false;
    },
    [getGsap, resetOverlay]
  );

  const startCover = useCallback((overlay: HTMLDivElement) => {
    setIsTransitioning(true);
    overlay.style.transition = "none";
    overlay.style.transform = "translateY(-100%)";
    void overlay.offsetHeight;
    overlay.style.transition = `transform ${COVER_DURATION}s cubic-bezier(0.65, 0, 0.35, 1)`;
    overlay.style.transform = "translateY(0)";
  }, []);

  const navigate = useCallback(
    (href: string) => {
      if (isNavigatingRef.current) return;

      const targetPath = getPathFromHref(href);
      const hash = getHashFromHref(href);
      const reducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (targetPath === pathname && hash) {
        scrollToTarget(hash);
        window.history.pushState(null, "", withBasePath(href.startsWith("#") ? `/${href}` : href));
        return;
      }

      if (reducedMotion || targetPath === pathname) {
        router.push(href);
        if (hash) scrollToTarget(hash);
        return;
      }

      const overlay = overlayRef.current;
      if (!overlay) {
        router.push(href);
        return;
      }

      isNavigatingRef.current = true;
      pendingHrefRef.current = href;
      timelineRef.current?.kill();

      // 1. Cover immediately with CSS (no GSAP import wait)
      startCover(overlay);

      const onCoverEnd = (e: TransitionEvent) => {
        if (e.target !== overlay || e.propertyName !== "transform") return;
        overlay.removeEventListener("transitionend", onCoverEnd);

        void (async () => {
          const gsap = await getGsap();
          gsap.set(overlay, { yPercent: 0, clearProps: "transition" });

          const tl = gsap.timeline();
          timelineRef.current = tl;

          // 2. Hold while fully covered
          tl.to({}, { duration: HOLD_DURATION })
            // 3. Load the page underneath the overlay
            .add(() => {
              coveredRef.current = true;
              router.push(href);
            });
        })();
      };

      overlay.addEventListener("transitionend", onCoverEnd);
    },
    [pathname, router, getGsap, startCover, scrollToTarget]
  );

  useEffect(() => {
    if (coveredRef.current) return;

    const hash = window.location.hash;
    scrollToTarget(hash);
  }, [pathname, scrollToTarget]);

  useEffect(() => {
    if (!coveredRef.current) return;

    const overlay = overlayRef.current;
    if (!overlay) return;

    const hash = getHashFromHref(pendingHrefRef.current ?? "");

    let cancelled = false;

    async function reveal() {
      const gsap = await getGsap();
      if (cancelled) return;

      scrollToTarget(hash);
      timelineRef.current?.kill();

      const tl = gsap.timeline({
        onComplete: () => {
          if (overlay) hideOverlay(overlay);
        },
      });
      timelineRef.current = tl;

      // Brief pause for new page to paint, then close the transition
      tl.to({}, { duration: PAGE_SETTLE }).to(overlay, {
        yPercent: 100,
        duration: UNCOVER_DURATION,
        ease: "power3.inOut",
      });
    }

    reveal();

    return () => {
      cancelled = true;
      timelineRef.current?.kill();
    };
  }, [pathname, scrollToTarget, hideOverlay, getGsap]);

  return (
    <TransitionContext.Provider value={{ navigate }}>
      <div
        ref={overlayRef}
        className={`page-transition-overlay${isTransitioning ? "" : " page-transition-overlay--idle"}`}
        aria-hidden="true"
      />
      {children}
    </TransitionContext.Provider>
  );
}
