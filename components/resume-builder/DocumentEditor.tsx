"use client";

import { useState } from "react";
import {
  BuilderButton,
  FormField,
  FormTextarea,
} from "@/components/resume-builder/FormFields";
import ResumePreview from "@/components/resume-builder/ResumePreview";
import CoverLetterPreview from "@/components/resume-builder/CoverLetterPreview";
import SuggestionPanel from "@/components/resume-builder/SuggestionPanel";
import { useResumeBuilder } from "@/context/ResumeBuilderContext";
import { Eye, Pencil } from "lucide-react";

interface DocumentEditorProps {
  onNext: () => void;
  onBack: () => void;
}

export default function DocumentEditor({ onNext, onBack }: DocumentEditorProps) {
  const { state, dispatch } = useResumeBuilder();
  const [activeDoc, setActiveDoc] = useState<"resume" | "cover-letter">("cover-letter");
  const isPreview = state.editorView === "preview";

  return (
    <div className="builder-editor">
      <div className="builder-editor__toolbar">
        <div className="flex gap-2" role="tablist" aria-label="Document type">
          <BuilderButton
            variant={activeDoc === "resume" ? "primary" : "secondary"}
            onClick={() => setActiveDoc("resume")}
          >
            Resume
          </BuilderButton>
          <BuilderButton
            variant={activeDoc === "cover-letter" ? "primary" : "secondary"}
            onClick={() => setActiveDoc("cover-letter")}
          >
            Cover letter
          </BuilderButton>
        </div>

        <BuilderButton
          variant="secondary"
          onClick={() =>
            dispatch({
              type: "SET_EDITOR_VIEW",
              view: isPreview ? "edit" : "preview",
            })
          }
        >
          {isPreview ? (
            <>
              <Pencil size={14} aria-hidden="true" />
              Back to editing
            </>
          ) : (
            <>
              <Eye size={14} aria-hidden="true" />
              Preview
            </>
          )}
        </BuilderButton>
      </div>

      {isPreview ? (
        <div className="builder-editor__preview-pane">
          <h3 className="builder-section-title text-base mb-4">Live preview</h3>
          {activeDoc === "cover-letter" ? (
            <CoverLetterPreview />
          ) : (
            <ResumePreview />
          )}
        </div>
      ) : (
        <div>
          {state.pendingSuggestion ? (
            <div className="mb-6">
              <SuggestionPanel />
            </div>
          ) : null}

          {activeDoc === "cover-letter" ? (
            <FormField label="Cover letter" htmlFor="coverLetter">
              <FormTextarea
                id="coverLetter"
                rows={16}
                value={state.coverLetter}
                onChange={(e) =>
                  dispatch({ type: "SET_COVER_LETTER", coverLetter: e.target.value })
                }
              />
            </FormField>
          ) : (
            <FormField label="Professional summary" htmlFor="summary">
              <FormTextarea
                id="summary"
                rows={6}
                value={state.resume.summary}
                onChange={(e) =>
                  dispatch({
                    type: "SET_RESUME",
                    resume: { ...state.resume, summary: e.target.value },
                  })
                }
              />
            </FormField>
          )}

          {state.generated?.bulletSuggestions &&
          state.generated.bulletSuggestions.length > 0 ? (
            <section className="mt-8">
              <h3 className="builder-section-title text-base">Resume suggestions</h3>
              <ul className="space-y-4 mt-4">
                {state.generated.bulletSuggestions.map((suggestion) => (
                  <li key={suggestion.id} className="builder-card text-sm">
                    <p className="text-[var(--color-grey)] mb-2">{suggestion.reason}</p>
                    <p className="mb-3">{suggestion.suggestedText}</p>
                    <div className="flex gap-2">
                      <BuilderButton
                        variant="primary"
                        onClick={() =>
                          dispatch({ type: "ACCEPT_SUGGESTION", id: suggestion.id })
                        }
                      >
                        Accept
                      </BuilderButton>
                      <BuilderButton
                        variant="ghost"
                        onClick={() =>
                          dispatch({ type: "REJECT_SUGGESTION", id: suggestion.id })
                        }
                      >
                        Dismiss
                      </BuilderButton>
                    </div>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      )}

      <div className="flex justify-between mt-8">
        <BuilderButton type="button" variant="secondary" onClick={onBack}>
          Back
        </BuilderButton>
        <BuilderButton type="button" variant="primary" onClick={onNext}>
          Continue to download
        </BuilderButton>
      </div>
    </div>
  );
}
