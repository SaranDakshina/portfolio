"use client";

import TransitionLink from "@/components/ui/TransitionLink";
import { ArrowLeft } from "lucide-react";

interface BuilderHeaderProps {
  title: string;
  description?: string;
  savedAt?: string | null;
}

export default function BuilderHeader({
  title,
  description,
  savedAt,
}: BuilderHeaderProps) {
  return (
    <header className="builder-header border-b border-[var(--color-grey-border)] pb-6 mb-8">
      <TransitionLink
        href="/#about"
        className="inline-flex items-center gap-2 label-caps text-[var(--color-grey)] hover:text-[var(--color-ink)] transition-colors duration-200 mb-6"
      >
        <ArrowLeft size={14} aria-hidden="true" />
        Back to creator profile
      </TransitionLink>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div className="max-w-2xl">
          <p className="label-caps text-[var(--color-grey)] mb-2">Tools</p>
          <h1 className="display-md mb-3">{title}</h1>
          {description ? (
            <p className="text-base text-[var(--color-grey)] leading-relaxed">
              {description}
            </p>
          ) : null}
        </div>
        {savedAt ? (
          <p className="text-sm text-[var(--color-grey)] shrink-0" role="status">
            Draft saved {new Date(savedAt).toLocaleTimeString()}
          </p>
        ) : null}
      </div>
    </header>
  );
}
