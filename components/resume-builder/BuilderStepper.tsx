import type { BuilderStep } from "@/types/resume-builder";
import { BUILDER_STEPS } from "@/lib/resume-builder/defaults";

interface BuilderStepperProps {
  currentStep: BuilderStep;
  onStepClick?: (step: BuilderStep) => void;
}

export default function BuilderStepper({
  currentStep,
  onStepClick,
}: BuilderStepperProps) {
  const currentIndex = BUILDER_STEPS.findIndex((s) => s.id === currentStep);

  return (
    <nav aria-label="Builder progress" className="builder-stepper">
      <ol className="flex flex-wrap gap-2 md:gap-0 md:justify-between">
        {BUILDER_STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isComplete = index < currentIndex;

          return (
            <li key={step.id} className="flex items-center gap-2 md:flex-1">
              <button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick}
                aria-current={isActive ? "step" : undefined}
                className={[
                  "flex items-center gap-2 label-caps text-xs transition-colors duration-200",
                  isActive
                    ? "text-[var(--color-accent)]"
                    : isComplete
                      ? "text-[var(--color-ink)]"
                      : "text-[var(--color-grey)]",
                  onStepClick ? "hover:text-[var(--color-ink)] cursor-pointer" : "cursor-default",
                ].join(" ")}
              >
                <span
                  className={[
                    "flex h-6 w-6 items-center justify-center rounded-full border text-[10px]",
                    isActive
                      ? "border-[var(--color-accent)] bg-[var(--color-accent)] text-white"
                      : isComplete
                        ? "border-[var(--color-ink)] bg-[var(--color-ink)] text-white"
                        : "border-[var(--color-grey-border)]",
                  ].join(" ")}
                >
                  {index + 1}
                </span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {index < BUILDER_STEPS.length - 1 ? (
                <span
                  className="hidden md:block flex-1 h-px bg-[var(--color-grey-border)] mx-2"
                  aria-hidden="true"
                />
              ) : null}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
