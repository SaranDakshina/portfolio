"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import StackIcon from "tech-stack-icons";
import { heroIcons } from "@/lib/icons";
import { getProject, projects } from "@/lib/projects";
import MagneticButton from "@/components/ui/MagneticButton";
import HeroSpaceBackground from "@/components/ui/HeroSpaceBackground";
import StackedImagePeel from "@/components/ui/StackedImagePeel";

const INLINE_IMAGES = projects.slice(0, 3);
const TYS_INLINE_IMAGES = getProject("tell-your-story")?.inlineImages ?? [];

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let cancelled = false;

    async function init() {
      const { gsap } = await import("gsap");
      if (cancelled) return;

      const lines = sectionRef.current?.querySelectorAll("[data-hero-line]");
      if (lines) {
        gsap.fromTo(
          lines,
          { yPercent: 110 },
          { yPercent: 0, duration: 1, stagger: 0.08, delay: 0.15, ease: "power4.out" }
        );
      }

      const chips = sectionRef.current?.querySelectorAll("[data-hero-chip]");
      if (chips) {
        gsap.fromTo(
          chips,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, stagger: 0.1, delay: 0.35, ease: "back.out(2)" }
        );
      }

      const label = sectionRef.current?.querySelector("[data-hero-label]");
      if (label) {
        gsap.fromTo(label, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" });
      }

      const sub = sectionRef.current?.querySelector("[data-hero-sub]");
      if (sub) {
        gsap.fromTo(sub, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.5, ease: "power2.out" });
      }

      const ctas = sectionRef.current?.querySelector("[data-hero-ctas]");
      if (ctas) {
        gsap.fromTo(ctas, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.8, delay: 0.65, ease: "power2.out" });
      }

      const icons = sectionRef.current?.querySelectorAll("[data-hero-icon]");
      if (icons) {
        gsap.fromTo(
          icons,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, stagger: 0.08, delay: 0.8, ease: "back.out(2)" }
        );
      }
    }

    init();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative flex min-h-[100dvh] flex-col justify-center overflow-hidden pb-20 pt-[calc(var(--header-height)+2.5rem)] md:pb-28 md:pt-[calc(var(--header-height)+var(--spacing-content))]"
    >
      <HeroSpaceBackground />
      <div className="container-content relative z-10 flex flex-col items-center text-center gap-8 md:gap-10">
        <p data-hero-label className="label-caps mb-2 opacity-0 md:mt-8 md:mb-8">
          Frontend Developer — Creative Technologist
        </p>

        <h1 className="display-xl text-[var(--color-ink)] max-w-[20ch] mx-auto ">
          <span className="block overflow-visible">
            <span data-hero-line className="block">
              I build digital
              <InlineChip
                src={INLINE_IMAGES[0].inlineVideo ?? INLINE_IMAGES[0].image}
                poster={INLINE_IMAGES[0].inlineVideoPoster ?? INLINE_IMAGES[0].imagePoster}
                alt={INLINE_IMAGES[0].imageAlt}
                width={INLINE_IMAGES[0].imageWidth}
                height={INLINE_IMAGES[0].imageHeight}
                overflow={!!INLINE_IMAGES[0].imageWidth && !!INLINE_IMAGES[0].imageHeight}
                large
              />
              experiences
            </span>
          </span>
          <span className="block overflow-hidden">
            <span data-hero-line className="block">
              that turn{" "}
              <em className="not-italic text-[var(--color-accent)]">ideas</em>
              <InlineChip
                src={INLINE_IMAGES[1].inlineVideo ?? INLINE_IMAGES[1].image}
                poster={INLINE_IMAGES[1].inlineVideoPoster ?? INLINE_IMAGES[1].imagePoster}
                alt={INLINE_IMAGES[1].imageAlt}
                landscape
              />
              into
            </span>
          </span>
          <span className="block overflow-visible">
            <span data-hero-line className="block">
              stories
              <StackedImagePeel
                images={TYS_INLINE_IMAGES}
                alt="Tell Your Stories generated scenes"
                variant="chip"
              />
              people remember.
            </span>
          </span>
        </h1>

        <p
          data-hero-sub
          className="text-lg md:text-xl text-[var(--color-grey)] max-w-[42ch] mx-auto leading-relaxed opacity-0 "
        >
          Based in Wellington, Aotearoa. Designing frontend systems that balance
          performance, motion, and clarity — across web, installation, and film.
        </p>

        <div
          data-hero-ctas
          className="my-4 flex w-full flex-col items-center gap-5 opacity-0 md:my-4 sm:flex-row sm:justify-center sm:gap-6 sm:[&_a]:min-h-0 sm:[&_a]:px-8 sm:[&_a]:py-4"
        >
          <div className="w-[50dvw] mx-auto sm:mx-0 sm:w-auto [&>a]:w-full [&>a]:justify-center sm:[&>a]:w-auto">
            <MagneticButton href="#work" variant="primary">
              See the work
              <ArrowRight />
            </MagneticButton>
          </div>
          <div className="w-[50dvw] mx-auto sm:mx-0 sm:w-auto [&>a]:w-full [&>a]:justify-center sm:[&>a]:w-auto">
            <MagneticButton href="#contact" variant="secondary">
              Get in touch
            </MagneticButton>
          </div>
        </div>

      </div>

      <div className="absolute bottom-10 right-[clamp(1.25rem,5vw,3rem)] z-20 hidden md:flex flex-col items-center gap-2">
        <div className="w-px h-12 bg-[var(--color-grey-light)] relative overflow-hidden">
          <div className="scroll-comet" />
        </div>
        <span className="label-caps" style={{ writingMode: "vertical-rl" }}>
          Scroll
        </span>
      </div>
    </section>
  );
}

function isVideoSrc(src: string) {
  return /\.(mp4|webm)$/i.test(src);
}

function InlineChip({
  src,
  alt,
  poster,
  width,
  height,
  overflow = false,
  landscape = false,
  large = false,
}: {
  src: string;
  alt: string;
  poster?: string;
  width?: number;
  height?: number;
  overflow?: boolean;
  landscape?: boolean;
  large?: boolean;
}) {
  const expandClass = overflow
    ? ` hero-inline-image--expand${large ? " hero-inline-image--expand-lg" : ""}`
    : "";

  if (isVideoSrc(src)) {
    return (
      <span
        data-hero-chip
        className={`hero-inline-image${
          landscape ? " hero-inline-image--landscape" : expandClass
        }`}
        style={{ opacity: 0 }}
      >
        <video
          src={src}
          poster={poster ?? src.replace(/\.(mp4|webm)$/i, "-poster.jpg")}
          autoPlay
          loop
          muted
          playsInline
          aria-label={alt}
          className={
            landscape
              ? "hero-inline-image__media--crop"
              : overflow
                ? "hero-inline-image__img--overflow"
                : "h-full w-full object-cover"
          }
        />
      </span>
    );
  }

  if (overflow && width && height) {
    return (
      <span
        data-hero-chip
        className={`hero-inline-image hero-inline-image--expand${large ? " hero-inline-image--expand-lg" : ""}`}
        style={{ opacity: 0 }}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          className="hero-inline-image__img--overflow"
          sizes="64px"
        />
      </span>
    );
  }

  return (
    <span data-hero-chip className="hero-inline-image" style={{ opacity: 0 }}>
      <Image src={src} alt={alt} fill className="object-cover" sizes="64px" />
    </span>
  );
}

function ArrowRight() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
      <path
        d="M1 7h12M7.5 1.5L13 7l-5.5 5.5"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
