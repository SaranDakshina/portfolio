"use client";

import { BUILDER_STEPS } from "@/lib/resume-builder/defaults";
import type { BuilderStep } from "@/types/resume-builder";
import { ChevronRight } from "lucide-react";

interface BuilderTopBarProps {
  currentStep: BuilderStep;
  savedAt?: string | null;
}

export default function BuilderTopBar({ currentStep, savedAt }: BuilderTopBarProps) {
  const currentIndex = BUILDER_STEPS.findIndex((step) => step.id === currentStep);
  const currentLabel = BUILDER_STEPS[currentIndex]?.label ?? "Builder";

  return (
    <header className="builder-topbar">
      <div className="builder-topbar__title-group">
        <p className="builder-topbar__eyebrow">Résumé & Cover Letter Builder</p>
        <h1 className="builder-topbar__title">{currentLabel}</h1>
      </div>

      <nav aria-label="Builder progress" className="builder-topbar__progress">
        <ol className="builder-topbar__progress-list">
          {BUILDER_STEPS.map((step, index) => {
            const isActive = step.id === currentStep;
            const isComplete = index < currentIndex;

            return (
              <li key={step.id} className="builder-topbar__progress-item">
                <span
                  className={[
                    "builder-topbar__progress-step",
                    isActive ? "builder-topbar__progress-step--active" : "",
                    isComplete ? "builder-topbar__progress-step--complete" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                >
                  {step.label}
                </span>
                {index < BUILDER_STEPS.length - 1 ? (
                  <ChevronRight
                    size={14}
                    className="builder-topbar__progress-separator"
                    aria-hidden="true"
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>

      {savedAt ? (
        <p className="builder-topbar__saved" role="status">
          Draft saved {new Date(savedAt).toLocaleTimeString()}
        </p>
      ) : (
        <p className="builder-topbar__saved builder-topbar__saved--empty" aria-hidden="true">
          &nbsp;
        </p>
      )}
    </header>
  );
}
