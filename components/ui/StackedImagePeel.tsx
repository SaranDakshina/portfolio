"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

type StackedImagePeelProps = {
  images: string[];
  alt: string;
  variant?: "chip" | "thumb";
  aspectRatio?: string;
  className?: string;
};

export default function StackedImagePeel({
  images,
  alt,
  variant = "chip",
  aspectRatio,
  className = "",
}: StackedImagePeelProps) {
  const stackRef = useRef<HTMLElement>(null);
  const orderRef = useRef(images.map((_, index) => index));
  const isChip = variant === "chip";

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    if (!stackRef.current || images.length < 2) return;

    let cancelled = false;
    let peelTimeout: { kill: () => void } | null = null;
    let activeTimeline: { kill: () => void } | null = null;

    async function init() {
      const { gsap } = await import("gsap");
      if (cancelled || !stackRef.current) return;

      const cards = gsap.utils.toArray<HTMLElement>(
        stackRef.current.querySelectorAll("[data-stack-card]")
      );

      if (cards.length < 2) return;

      const order = orderRef.current;

      function stackProps(posFromTop: number) {
        return {
          yPercent: posFromTop * 6,
          rotation: posFromTop === 0 ? 0 : (posFromTop % 2 === 0 ? -2.5 : 2.5) * posFromTop,
          scale: 1 - posFromTop * 0.04,
          zIndex: 20 - posFromTop,
          opacity: 1,
        };
      }

      function applyStack(cardOrder: number[]) {
        cardOrder.forEach((cardIndex, stackPos) => {
          const posFromTop = cardOrder.length - 1 - stackPos;
          gsap.set(cards[cardIndex], stackProps(posFromTop));
        });
      }

      applyStack(order);

      function peelOnce() {
        if (cancelled) return;

        const currentOrder = orderRef.current;
        const topIndex = currentOrder[currentOrder.length - 1];
        const topEl = cards[topIndex];
        const newOrder = [topIndex, ...currentOrder.slice(0, -1)];

        activeTimeline = gsap
          .timeline({
            onComplete: () => {
              if (!cancelled) {
                peelTimeout = gsap.delayedCall(1.2, peelOnce);
              }
            },
          })
          .to(topEl, {
            yPercent: -120,
            rotation: -14,
            opacity: 0,
            scale: 0.95,
            duration: 0.55,
            ease: "power2.in",
          })
          .add(() => {
            orderRef.current = newOrder;
            gsap.set(topEl, { ...stackProps(newOrder.length - 1), opacity: 0 });
          })
          .set(topEl, { opacity: 1 })
          .add(() => {
            newOrder.forEach((cardIndex, stackPos) => {
              const posFromTop = newOrder.length - 1 - stackPos;
              gsap.to(cards[cardIndex], {
                ...stackProps(posFromTop),
                duration: 0.35,
                ease: "power2.out",
              });
            });
          }, "<0.05");
      }

      peelTimeout = gsap.delayedCall(1.5, peelOnce);
    }

    init();

    return () => {
      cancelled = true;
      peelTimeout?.kill();
      activeTimeline?.kill();
    };
  }, [images]);

  if (images.length === 0) return null;

  const wrapperClass = isChip
    ? `hero-inline-image hero-inline-image--stack ${className}`.trim()
    : `stacked-image-peel stacked-image-peel--thumb ${className}`.trim();

  const innerClass = isChip ? "hero-inline-image__stack-inner" : "stacked-image-peel__inner";
  const cardClass = isChip ? "hero-inline-image__stack-card" : "stacked-image-peel__card";

  const InnerTag = isChip ? "span" : "div";
  const CardTag = isChip ? "span" : "div";

  const stackContent = (
    <InnerTag className={innerClass} aria-hidden={images.length > 1}>
      {images.map((src, index) => (
        <CardTag
          key={src}
          data-stack-card
          className={cardClass}
          style={{ zIndex: images.length - index }}
        >
          <Image
            src={src}
            alt={index === 0 ? alt : ""}
            fill
            className="object-cover"
            sizes={isChip ? "64px" : "(max-width: 1024px) 100vw, 50vw"}
          />
        </CardTag>
      ))}
    </InnerTag>
  );

  if (isChip) {
    return (
      <span
        ref={stackRef as React.RefObject<HTMLSpanElement>}
        data-hero-chip
        className={wrapperClass}
        style={{ opacity: 0 }}
      >
        {stackContent}
      </span>
    );
  }

  return (
    <div
      ref={stackRef as React.RefObject<HTMLDivElement>}
      className={wrapperClass}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {stackContent}
    </div>
  );
}
