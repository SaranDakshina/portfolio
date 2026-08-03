"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type Lenis from "lenis";
import SectionLabel from "@/components/ui/SectionLabel";
import TransitionLink from "@/components/ui/TransitionLink";
import { experiences } from "@/data/experience";
import { getLenis } from "@/lib/scroll";
import { homeSectionHref } from "@/lib/paths";
import CareerTimelineItem from "./CareerTimelineItem";
import styles from "./careerTimeline.module.scss";

const ACTIVE_SWITCH_HYSTERESIS = 48;
const SCROLL_ANCHOR_RATIO = 0.38;

function scrollToExperience(id: string) {
  const el = document.getElementById(`experience-${id}`);
  if (!el) return;

  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const lenis = getLenis();
  const scrollPadding =
    Number.parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

  if (lenis) {
    lenis.scrollTo(el, {
      offset: scrollPadding,
      lock: true,
      duration: reducedMotion ? 0 : 1.1,
    });
    return;
  }

  el.scrollIntoView({
    behavior: reducedMotion ? "instant" : "smooth",
    block: "start",
  });
}

function getItemCenterDistance(el: HTMLElement, anchorY: number) {
  const rect = el.getBoundingClientRect();
  const center = rect.top + rect.height / 2;
  return Math.abs(center - anchorY);
}

function getMarkerOffsetY(marker: HTMLElement, timeline: HTMLElement) {
  const markerRect = marker.getBoundingClientRect();
  const timelineRect = timeline.getBoundingClientRect();
  return markerRect.top + markerRect.height / 2 - timelineRect.top;
}

export default function CareerTimeline() {
  const timelineRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const trackFillRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef(new Map<string, HTMLLIElement>());
  const markerRefs = useRef(new Map<string, HTMLButtonElement>());
  const activeIdRef = useRef(experiences[0]?.id ?? "");
  const isTimelineVisibleRef = useRef(false);
  const [activeId, setActiveId] = useState(experiences[0]?.id ?? "");

  const setItemRef = useCallback((id: string, el: HTMLLIElement | null) => {
    if (el) {
      itemRefs.current.set(id, el);
      return;
    }
    itemRefs.current.delete(id);
  }, []);

  const setMarkerRef = useCallback((id: string, el: HTMLButtonElement | null) => {
    if (el) {
      markerRefs.current.set(id, el);
      return;
    }
    markerRefs.current.delete(id);
  }, []);

  const updateScrollState = useCallback(() => {
    const timeline = timelineRef.current;
    const track = trackRef.current;
    const trackFill = trackFillRef.current;
    const firstMarker = markerRefs.current.get(experiences[0]?.id ?? "");
    const lastMarker = markerRefs.current.get(experiences[experiences.length - 1]?.id ?? "");

    if (timeline && track && trackFill && firstMarker && lastMarker) {
      const startY = getMarkerOffsetY(firstMarker, timeline);
      const endY = getMarkerOffsetY(lastMarker, timeline);
      const trackHeight = Math.max(endY - startY, 1);

      track.style.top = `${startY}px`;
      track.style.height = `${trackHeight}px`;

      const anchorY = window.innerHeight * SCROLL_ANCHOR_RATIO;
      const timelineTop = timeline.getBoundingClientRect().top;
      const anchorRelative = anchorY - timelineTop;
      const progress = Math.min(1, Math.max(0, (anchorRelative - startY) / trackHeight));

      trackFill.style.transform = `scaleY(${progress})`;
    }

    const anchorY = window.innerHeight * SCROLL_ANCHOR_RATIO;
    let closestId = experiences[0]?.id ?? "";
    let closestDistance = Infinity;

    for (const experience of experiences) {
      const el = itemRefs.current.get(experience.id);
      if (!el) continue;

      const distance = getItemCenterDistance(el, anchorY);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestId = experience.id;
      }
    }

    const currentId = activeIdRef.current;
    const currentEl = itemRefs.current.get(currentId);

    if (currentEl && closestId !== currentId) {
      const currentDistance = getItemCenterDistance(currentEl, anchorY);
      if (closestDistance > currentDistance - ACTIVE_SWITCH_HYSTERESIS) {
        closestId = currentId;
      }
    }

    if (closestId !== activeIdRef.current) {
      activeIdRef.current = closestId;
      setActiveId(closestId);
    }
  }, []);

  useEffect(() => {
    let rafId = 0;
    let lenisBound: Lenis | null = null;
    let observer: IntersectionObserver | null = null;

    const tick = () => {
      if (isTimelineVisibleRef.current) {
        updateScrollState();
      }
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      if (isTimelineVisibleRef.current) {
        updateScrollState();
      }
    };

    const bindLenis = () => {
      const lenis = getLenis();
      if (lenis && lenis !== lenisBound) {
        lenisBound?.off("scroll", onScroll);
        lenisBound = lenis;
        lenis.on("scroll", onScroll);
      }
    };

    const timeline = timelineRef.current;
    if (timeline) {
      observer = new IntersectionObserver(
        ([entry]) => {
          isTimelineVisibleRef.current = entry.isIntersecting;
          if (entry.isIntersecting) updateScrollState();
        },
        { rootMargin: "20% 0px" }
      );
      observer.observe(timeline);
    }

    updateScrollState();
    bindLenis();
    rafId = requestAnimationFrame(tick);

    const retryTimers = [0, 50, 150, 400].map((delay) =>
      window.setTimeout(bindLenis, delay)
    );

    window.addEventListener("resize", onScroll, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      retryTimers.forEach(clearTimeout);
      observer?.disconnect();
      lenisBound?.off("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [updateScrollState]);

  const activeIndex = experiences.findIndex((experience) => experience.id === activeId);

  const getMarkerState = (index: number) => {
    if (index === activeIndex) return "active" as const;
    if (index < activeIndex) return "completed" as const;
    return "future" as const;
  };

  return (
    <section
      id="experience"
      className={`relative section-pad overflow-hidden ${styles.section}`}
      aria-labelledby="career-timeline-heading"
    >
      <span className="ghost-number" aria-hidden="true">
        02
      </span>

      <div className={`container-content ${styles.inner}`}>
        <SectionLabel index="02" label="Career Timeline" />

        <header className={styles.header}>
          <h2 id="career-timeline-heading" className={`display-xl ${styles.heading}`}>
            Career{" "}
            <em className="not-italic text-[var(--color-accent)]">Timeline.</em>
          </h2>
          <p className={styles.intro}>
            A progression from UI and user experience design to full-stack development across
            web, desktop, and interactive digital products.
          </p>
        </header>

        <div className={styles.timeline} ref={timelineRef}>
          <div ref={trackRef} className={styles.track} aria-hidden="true">
            <div ref={trackFillRef} className={styles.trackFill} />
          </div>
          <ol className={styles.list}>
            {experiences.map((experience, index) => (
              <CareerTimelineItem
                key={experience.id}
                experience={experience}
                markerState={getMarkerState(index)}
                isActive={experience.id === activeId}
                onMarkerClick={scrollToExperience}
                itemRef={(el) => setItemRef(experience.id, el)}
                markerRef={(el) => setMarkerRef(experience.id, el)}
              />
            ))}
          </ol>
        </div>

        <footer className={styles.footer}>
          <TransitionLink href={homeSectionHref("work")} className={styles.footerLink}>
            View selected projects →
          </TransitionLink>
        </footer>
      </div>
    </section>
  );
}
