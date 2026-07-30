"use client";

import { useState, useEffect, useRef } from "react";
import TransitionLink from "@/components/ui/TransitionLink";
import DarkSpaceBackground from "@/components/ui/DarkSpaceBackground";
import { getLenis } from "@/lib/scroll";

const navLinks = [
  { label: "Work", href: "/#work" },
  { label: "Experience", href: "/#experience" },
  { label: "About", href: "/#about" },
  { label: "Contact", href: "/#contact" },
];

const SCROLL_THRESHOLD = 48;
const SCROLL_DELTA = 8;

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [open, setOpen] = useState(false);

  const headerRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const line1Ref = useRef<HTMLSpanElement>(null);
  const line2Ref = useRef<HTMLSpanElement>(null);
  const navItemRefs = useRef<(HTMLLIElement | null)[]>([]);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const updateScroll = (scrollY: number) => {
      setScrolled(scrollY > SCROLL_THRESHOLD);

      if (open) {
        setVisible(true);
        lastScrollY.current = scrollY;
        return;
      }

      if (scrollY <= SCROLL_THRESHOLD) {
        setVisible(true);
      } else {
        const delta = scrollY - lastScrollY.current;
        if (delta > SCROLL_DELTA) {
          setVisible(false);
        } else if (delta < -SCROLL_DELTA) {
          setVisible(true);
        }
      }

      lastScrollY.current = scrollY;
    };

    let lenisUnsubscribe: (() => void) | null = null;
    let windowOff: (() => void) | null = null;
    let rafId = 0;
    let attempts = 0;

    const bindLenis = () => {
      const lenis = getLenis();
      if (!lenis) return false;

      const onLenisScroll = () => updateScroll(lenis.scroll);
      lenisUnsubscribe = lenis.on("scroll", onLenisScroll);
      updateScroll(lenis.scroll);
      return true;
    };

    const bindWindow = () => {
      const onWindowScroll = () => updateScroll(window.scrollY);
      window.addEventListener("scroll", onWindowScroll, { passive: true });
      windowOff = () => window.removeEventListener("scroll", onWindowScroll);
      updateScroll(window.scrollY);
    };

    if (!bindLenis()) {
      bindWindow();

      const retryLenis = () => {
        if (bindLenis()) {
          windowOff?.();
          windowOff = null;
          return;
        }

        attempts += 1;
        if (attempts < 60) {
          rafId = requestAnimationFrame(retryLenis);
        }
      };

      rafId = requestAnimationFrame(retryLenis);
    }

    return () => {
      cancelAnimationFrame(rafId);
      lenisUnsubscribe?.();
      windowOff?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const lenis = getLenis();
    lenis?.stop();

    const previousBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const preventTouchMove = (event: TouchEvent) => {
      event.preventDefault();
    };

    document.addEventListener("touchmove", preventTouchMove, { passive: false });

    return () => {
      document.removeEventListener("touchmove", preventTouchMove);
      document.body.style.overflow = previousBodyOverflow;
      lenis?.start();
    };
  }, [open]);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      header.style.transform = visible ? "translateY(0)" : "translateY(-100%)";
      return;
    }

    let cancelled = false;

    async function animateHeader() {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      if (visible) {
        gsap.to(header, {
          yPercent: 0,
          duration: 0.5,
          ease: "power3.out",
          overwrite: true,
        });
      } else {
        gsap.to(header, {
          yPercent: -100,
          duration: 0.3,
          ease: "power2.in",
          overwrite: true,
        });
      }
    }

    animateHeader();

    return () => {
      cancelled = true;
    };
  }, [visible]);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      overlay.style.transform = "translateY(-100%)";
      return;
    }

    let cancelled = false;

    async function init() {
      const { gsap } = await import("gsap");
      if (cancelled) return;
      gsap.set(overlay, { yPercent: -100 });
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const overlay = overlayRef.current;
    const line1 = line1Ref.current;
    const line2 = line2Ref.current;
    const items = navItemRefs.current.filter(Boolean) as HTMLLIElement[];

    if (!overlay || !line1 || !line2) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reducedMotion) {
      overlay.style.transform = open ? "translateY(0)" : "translateY(-100%)";
      items.forEach((item) => {
        item.style.opacity = open ? "1" : "0";
      });
      line1.style.transform = open ? "translateY(3.25px) rotate(45deg)" : "";
      line2.style.transform = open ? "translateY(-3.25px) rotate(-45deg)" : "";
      return;
    }

    let cancelled = false;

    async function animate() {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      if (open) {
        gsap.to(overlay, {
          yPercent: 0,
          duration: 0.6,
          ease: "power4.inOut",
        });

        gsap.to(line1, {
          y: 3.25,
          rotation: 45,
          duration: 0.4,
          ease: "power2.inOut",
        });

        gsap.to(line2, {
          y: -3.25,
          rotation: -45,
          duration: 0.4,
          ease: "power2.inOut",
        });

        gsap.fromTo(
          items,
          { y: 24, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.5,
            stagger: 0.08,
            delay: 0.2,
            ease: "power3.out",
          }
        );
      } else {
        gsap.to(items, {
          y: -16,
          opacity: 0,
          duration: 0.3,
          stagger: 0.05,
          ease: "power2.in",
        });

        gsap.to(overlay, {
          yPercent: -100,
          duration: 0.5,
          delay: 0.1,
          ease: "power3.inOut",
        });

        gsap.to(line1, {
          y: 0,
          rotation: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });

        gsap.to(line2, {
          y: 0,
          rotation: 0,
          duration: 0.4,
          ease: "power2.inOut",
        });
      }
    }

    animate();

    return () => {
      cancelled = true;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  return (
    <>
      <header
        ref={headerRef}
        className={`fixed top-0 left-0 right-0 z-50 border-b border-[var(--color-grey-border)] transition-[background-color,border-color] duration-300 md:border-transparent ${
          scrolled
            ? "bg-[var(--color-canvas)]/95 backdrop-blur-sm md:border-[var(--color-grey-border)]"
            : "bg-[var(--color-canvas)] md:bg-transparent"
        }`}
      >
        <div className="container-content">
          <div className="flex h-14 items-center justify-between">
            <TransitionLink
              href="/"
              className="label-caps text-[var(--color-ink)] transition-colors duration-200 hover:text-[var(--color-accent)]"
              data-cursor
            >
              Saran
            </TransitionLink>

            <nav className="hidden md:block">
              <ul className="flex items-center gap-8">
                {navLinks.map((link) => (
                  <li key={link.href}>
                    <TransitionLink
                      href={link.href}
                      className="label-caps link-underline text-[var(--color-grey)] hover:text-[var(--color-ink)]"
                      data-cursor
                    >
                      {link.label}
                    </TransitionLink>
                  </li>
                ))}
              </ul>
            </nav>

            <button
              type="button"
              className="relative z-50 flex h-8 w-8 flex-col justify-center gap-[5px] md:hidden"
              onClick={() => setOpen((prev) => !prev)}
              aria-expanded={open}
              aria-label={open ? "Close menu" : "Open menu"}
            >
              <span ref={line1Ref} className="hamburger-line" />
              <span ref={line2Ref} className="hamburger-line" />
              {open && <span className="hamburger-spark" aria-hidden="true" />}
            </button>
          </div>
        </div>
      </header>

      <div
        ref={overlayRef}
        className={`fixed inset-0 z-40 flex flex-col justify-center overflow-hidden overscroll-none bg-[var(--color-void)] px-8 md:hidden ${
          open ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!open}
      >
        <DarkSpaceBackground withMoon />
        <nav className="relative z-10">
          <ul className="flex flex-col gap-8">
            {navLinks.map((link, index) => (
              <li
                key={link.href}
                ref={(el) => {
                  navItemRefs.current[index] = el;
                }}
                style={{ opacity: 0 }}
              >
                <TransitionLink
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="display-lg mobile-nav-link"
                  data-cursor
                >
                  {link.label}
                </TransitionLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </>
  );
}
