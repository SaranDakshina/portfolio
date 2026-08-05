"use client";

import TransitionLink from "@/components/ui/TransitionLink";
import { BUILDER_STEPS } from "@/lib/resume-builder/defaults";
import type { BuilderStep } from "@/types/resume-builder";
import {
  ArrowLeft,
  Briefcase,
  Download,
  FileText,
  PencilLine,
} from "lucide-react";

const STEP_ICONS: Record<BuilderStep, typeof FileText> = {
  resume: FileText,
  job: Briefcase,
  edit: PencilLine,
  download: Download,
};

interface BuilderSidebarProps {
  currentStep: BuilderStep;
  onStepClick: (step: BuilderStep) => void;
  className?: string;
}

export default function BuilderSidebar({
  currentStep,
  onStepClick,
  className = "",
}: BuilderSidebarProps) {
  const currentIndex = BUILDER_STEPS.findIndex((step) => step.id === currentStep);

  return (
    <aside className={`builder-sidebar ${className}`.trim()} aria-label="Builder navigation">
      <div className="builder-sidebar__brand">
        <p className="builder-sidebar__eyebrow">Tools</p>
        <p className="builder-sidebar__title">Résumé Builder</p>
      </div>

      <nav className="builder-sidebar__nav">
        <p className="builder-sidebar__section-label">Workflow</p>
        <ul className="builder-sidebar__list">
          {BUILDER_STEPS.map((step, index) => {
            const Icon = STEP_ICONS[step.id];
            const isActive = step.id === currentStep;
            const isComplete = index < currentIndex;

            return (
              <li key={step.id}>
                <button
                  type="button"
                  onClick={() => onStepClick(step.id)}
                  aria-current={isActive ? "page" : undefined}
                  className={[
                    "builder-sidebar__item",
                    isActive ? "builder-sidebar__item--active" : "",
                    isComplete ? "builder-sidebar__item--complete" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  <Icon size={16} aria-hidden="true" />
                  <span>{step.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="builder-sidebar__footer">
        <TransitionLink
          href="/#about"
          className="builder-sidebar__back"
        >
          <ArrowLeft size={14} aria-hidden="true" />
          Back to portfolio
        </TransitionLink>
      </div>
    </aside>
  );
}
