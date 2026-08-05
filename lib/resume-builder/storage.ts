import { defaultBuilderState } from "@/lib/resume-builder/defaults";
import type { BuilderState, BuilderStep } from "@/types/resume-builder";

function normalizeStep(step: unknown): BuilderStep {
  if (step === "tailor") return "job";
  if (step === "resume" || step === "job" || step === "edit" || step === "download") {
    return step;
  }
  return defaultBuilderState.step;
}

const STORAGE_KEY = "resume-builder-draft-v1";

export function loadDraft(): Partial<BuilderState> | null {
  if (typeof window === "undefined") return null;

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as Partial<BuilderState>;
  } catch {
    return null;
  }
}

export function saveDraft(state: BuilderState): void {
  if (typeof window === "undefined") return;

  const { isGenerating: _isGenerating, aiError: _aiError, pendingSuggestion: _pending, ...persisted } = state;

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(persisted));
  } catch {
    // Storage full or unavailable — fail silently
  }
}

export function clearDraft(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEY);
}

export function mergeDraft(partial: Partial<BuilderState> | null): BuilderState {
  if (!partial) return defaultBuilderState;

  return {
    ...defaultBuilderState,
    ...partial,
    step: normalizeStep(partial.step),
    resume: { ...defaultBuilderState.resume, ...partial.resume },
    company: { ...defaultBuilderState.company, ...partial.company },
    job: { ...defaultBuilderState.job, ...partial.job },
    settings: { ...defaultBuilderState.settings, ...partial.settings },
    isGenerating: false,
    aiError: null,
    pendingSuggestion: null,
  };
}
