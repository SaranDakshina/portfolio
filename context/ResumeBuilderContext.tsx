"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  type ReactNode,
} from "react";
import { defaultBuilderState } from "@/lib/resume-builder/defaults";
import { loadDraft, mergeDraft, saveDraft } from "@/lib/resume-builder/storage";
import type { BuilderAction, BuilderState } from "@/types/resume-builder";

function builderReducer(
  state: BuilderState,
  action: BuilderAction
): BuilderState {
  switch (action.type) {
    case "SET_STEP":
      return { ...state, step: action.step, editorView: "edit" };
    case "SET_EDITOR_VIEW":
      return { ...state, editorView: action.view };
    case "SET_RESUME":
      return { ...state, resume: action.resume };
    case "SET_COMPANY":
      return { ...state, company: action.company };
    case "SET_JOB":
      return { ...state, job: action.job };
    case "SET_SETTINGS":
      return { ...state, settings: action.settings };
    case "SET_COVER_LETTER":
      return { ...state, coverLetter: action.coverLetter };
    case "SET_GENERATED":
      return { ...state, generated: action.generated };
    case "SET_PENDING_SUGGESTION":
      return { ...state, pendingSuggestion: action.pending };
    case "ACCEPT_PENDING_SUGGESTION": {
      if (!state.pendingSuggestion) return state;

      const { type, content } = state.pendingSuggestion;

      if (type === "cover-letter") {
        return {
          ...state,
          coverLetter: content,
          pendingSuggestion: null,
        };
      }

      if (type === "summary") {
        return {
          ...state,
          resume: { ...state.resume, summary: content },
          pendingSuggestion: null,
        };
      }

      return { ...state, pendingSuggestion: null };
    }
    case "SET_GENERATING":
      return { ...state, isGenerating: action.isGenerating };
    case "SET_AI_ERROR":
      return { ...state, aiError: action.error };
    case "SET_LAST_SAVED":
      return { ...state, lastSavedAt: action.savedAt };
    case "ACCEPT_SUGGESTION":
      if (!state.generated) return state;
      return {
        ...state,
        generated: {
          ...state.generated,
          bulletSuggestions: state.generated.bulletSuggestions.map((s) =>
            s.id === action.id ? { ...s, accepted: true } : s
          ),
        },
      };
    case "REJECT_SUGGESTION":
      if (!state.generated) return state;
      return {
        ...state,
        generated: {
          ...state.generated,
          bulletSuggestions: state.generated.bulletSuggestions.filter(
            (s) => s.id !== action.id
          ),
        },
      };
    case "HYDRATE":
      return mergeDraft({ ...state, ...action.state });
    case "RESET":
      return defaultBuilderState;
    default:
      return state;
  }
}

interface BuilderContextValue {
  state: BuilderState;
  dispatch: React.Dispatch<BuilderAction>;
}

const BuilderContext = createContext<BuilderContextValue | null>(null);

export function ResumeBuilderProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(
    builderReducer,
    defaultBuilderState,
    () => mergeDraft(loadDraft())
  );

  useEffect(() => {
    saveDraft(state);
  }, [
    state.step,
    state.resume,
    state.company,
    state.job,
    state.settings,
    state.coverLetter,
    state.generated,
  ]);

  return (
    <BuilderContext.Provider value={{ state, dispatch }}>
      {children}
    </BuilderContext.Provider>
  );
}

export function useResumeBuilder() {
  const context = useContext(BuilderContext);
  if (!context) {
    throw new Error("useResumeBuilder must be used within ResumeBuilderProvider");
  }
  return context;
}
