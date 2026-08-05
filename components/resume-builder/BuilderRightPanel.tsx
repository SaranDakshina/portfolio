"use client";

import { BuilderButton } from "@/components/resume-builder/FormFields";
import { useResumeBuilder } from "@/context/ResumeBuilderContext";
import { useAiGeneration } from "@/hooks/useAiGeneration";
import type { BuilderStep } from "@/types/resume-builder";
import { Loader2, Sparkles, X } from "lucide-react";

interface BuilderRightPanelProps {
  step: BuilderStep;
  onClose?: () => void;
  className?: string;
}

function ResumeTipsPanel() {
  return (
    <div className="builder-panel">
      <h2 className="builder-panel__title">Getting started</h2>
      <p className="builder-panel__text">
        Upload an existing résumé to prefill the form, or enter your details manually.
        Your draft saves automatically as you work.
      </p>
      <ul className="builder-panel__list">
        <li>PDF, DOCX, or TXT uploads are supported</li>
        <li>Review AI-parsed content before accepting</li>
        <li>You can return to any step from the sidebar</li>
      </ul>
    </div>
  );
}

function TargetJobPanel() {
  const { state } = useResumeBuilder();
  const { extractJobRequirements } = useAiGeneration();
  const required = state.job.requiredSkills;
  const preferred = state.job.preferredSkills;
  const extracted = state.generated?.extractedRequirements;

  return (
    <div className="builder-panel space-y-6">
      <div>
        <h2 className="builder-panel__title">Job requirements</h2>
        <p className="builder-panel__text">
          Extract skills from the job description, or add them manually in the form.
        </p>
        <BuilderButton
          type="button"
          variant="secondary"
          onClick={extractJobRequirements}
          disabled={state.isGenerating}
          className="mt-4"
        >
          {state.isGenerating ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles size={14} aria-hidden="true" />
          )}
          Extract requirements
        </BuilderButton>
      </div>

      {required.length || preferred.length || extracted ? (
        <div className="builder-panel__section">
          {required.length ? (
            <div>
              <p className="builder-panel__label">Required skills</p>
              <div className="builder-panel__chips">
                {required.map((skill) => (
                  <span key={skill} className="builder-panel__chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {preferred.length ? (
            <div>
              <p className="builder-panel__label">Preferred skills</p>
              <div className="builder-panel__chips">
                {preferred.map((skill) => (
                  <span key={skill} className="builder-panel__chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ) : null}

          {extracted?.keywords?.length ? (
            <div>
              <p className="builder-panel__label">Keywords</p>
              <div className="builder-panel__chips">
                {extracted.keywords.map((keyword) => (
                  <span key={keyword} className="builder-panel__chip">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      ) : null}

      <p className="builder-panel__note">
        Information you enter is sent to the AI service when generating. Review all
        generated text before using it.
      </p>
    </div>
  );
}

function EditorPanel() {
  const { state } = useResumeBuilder();
  const { improveSummary, generateCoverLetter } = useAiGeneration();

  return (
    <div className="builder-panel space-y-6">
      <div>
        <h2 className="builder-panel__title">AI actions</h2>
        <p className="builder-panel__text">
          Regenerate or improve content. Suggestions appear here for review before
          applying.
        </p>
        <div className="builder-panel__actions">
          <BuilderButton
            type="button"
            variant="secondary"
            onClick={generateCoverLetter}
            disabled={state.isGenerating}
          >
            {state.isGenerating ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles size={14} aria-hidden="true" />
            )}
            Regenerate cover letter
          </BuilderButton>
          <BuilderButton
            type="button"
            variant="secondary"
            onClick={improveSummary}
            disabled={state.isGenerating}
          >
            {state.isGenerating ? (
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
            ) : (
              <Sparkles size={14} aria-hidden="true" />
            )}
            Improve summary
          </BuilderButton>
        </div>
      </div>

      {state.generated?.missingKeywords?.length ? (
        <div>
          <p className="builder-panel__label">Keyword notes</p>
          <ul className="builder-panel__list">
            {state.generated.missingKeywords.map((keyword, index) => (
              <li key={index}>{keyword}</li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

function DownloadPanelSidebar() {
  return (
    <div className="builder-panel">
      <h2 className="builder-panel__title">Your package</h2>
      <ul className="builder-panel__list">
        <li>Résumé as PDF and DOCX</li>
        <li>Cover letter as PDF and DOCX</li>
        <li>ZIP archive with all files</li>
      </ul>
      <p className="builder-panel__note">
        Preview your documents in the main panel before downloading.
      </p>
    </div>
  );
}

export default function BuilderRightPanel({
  step,
  onClose,
  className = "",
}: BuilderRightPanelProps) {
  return (
    <aside
      className={`builder-right-panel ${className}`.trim()}
      aria-label="Builder tools"
      data-lenis-prevent
    >
      {onClose ? (
        <div className="builder-right-panel__mobile-header">
          <p className="builder-right-panel__mobile-title">Tools</p>
          <button
            type="button"
            onClick={onClose}
            className="builder-right-panel__close"
            aria-label="Close tools panel"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      ) : null}

      {step === "resume" ? <ResumeTipsPanel /> : null}
      {step === "job" ? <TargetJobPanel /> : null}
      {step === "edit" ? <EditorPanel /> : null}
      {step === "download" ? <DownloadPanelSidebar /> : null}
    </aside>
  );
}
