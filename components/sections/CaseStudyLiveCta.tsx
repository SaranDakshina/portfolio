"use client";

import MagneticButton from "@/components/ui/MagneticButton";
import type { Project } from "@/lib/projects";

export default function CaseStudyLiveCta({ project }: { project: Project }) {
  if (!project.liveUrl) return null;

  const label = project.liveLabel ?? "View live site";

  return (
    <div className="container-content mt-20 relative z-10 flex justify-center">
      <MagneticButton href={project.liveUrl} variant="primary">
        {label}
        <svg width="14" height="14" viewBox="0 0 12 12" fill="none" aria-hidden="true">
          <path
            d="M2 10L10 2M10 2H4M10 2v6"
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
