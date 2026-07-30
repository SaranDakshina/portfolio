"use client";

import TransitionLink from "@/components/ui/TransitionLink";
import MagneticButton from "@/components/ui/MagneticButton";
import { projects } from "@/lib/projects";

export default function NextProjectCta({ currentSlug }: { currentSlug: string }) {
  const idx = projects.findIndex((p) => p.slug === currentSlug);
  const next = projects[(idx + 1) % projects.length];

  return (
    <div className="flex items-end justify-between gap-8">
      <div>
        <p className="label-caps mb-3">Next project</p>
        <TransitionLink
          href={`/work/${next.slug}`}
          className="display-md hover:text-[var(--color-accent)] transition-colors"
          data-cursor
        >
          {next.name}
        </TransitionLink>
      </div>
      <MagneticButton
        href={`/work/${next.slug}`}
        variant="secondary"
        aria-label={`Go to ${next.name}`}
        className="flex-shrink-0 w-12 h-12 p-0 sm:px-0 sm:py-0 sm:min-h-0 justify-center hover:bg-[var(--color-ink)] hover:text-[var(--color-canvas)] hover:border-[var(--color-ink)]"
      >
        <svg width="16" height="16" viewBox="0 0 14 14" fill="none" aria-hidden="true">
          <path
            d="M1 7h12M7.5 1.5L13 7l-5.5 5.5"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </MagneticButton>
    </div>
  );
}
