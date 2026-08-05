"use client";

import { useCallback, useRef, useState } from "react";
import { BuilderButton } from "@/components/resume-builder/FormFields";
import { useAiGeneration } from "@/hooks/useAiGeneration";
import {
  extractTextFromFile,
  isAcceptedResumeFile,
  normalizeParsedResume,
} from "@/lib/resume-builder/extractText";
import { tryParseJson } from "@/lib/resume-builder/utils";
import type { ResumeData } from "@/types/resume-builder";
import { FileUp, Loader2, X } from "lucide-react";

interface ResumeUploadProps {
  onAccept: (resume: ResumeData) => void;
}

export default function ResumeUpload({ onAccept }: ResumeUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { parseResume } = useAiGeneration();
  const [isDragging, setIsDragging] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<ResumeData | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const processFile = useCallback(
    async (file: File) => {
      setError(null);
      setPending(null);

      if (!isAcceptedResumeFile(file)) {
        setError("Unsupported file type. Use PDF, DOCX, or TXT.");
        return;
      }

      setFileName(file.name);
      setIsParsing(true);

      try {
        const text = await extractTextFromFile(file);
        const result = await parseResume(text);

        if (!result?.content) {
          setError("Could not parse the résumé. You can still fill the form manually.");
          return;
        }

        const parsed = tryParseJson<Partial<ResumeData>>(result.content);
        if (!parsed) {
          setError("The AI returned an unexpected format. Fill the form manually, or try again.");
          return;
        }

        setPending(normalizeParsedResume(parsed));
      } catch (err) {
        setError(err instanceof Error ? err.message : "Upload failed.");
      } finally {
        setIsParsing(false);
      }
    },
    [parseResume]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) void processFile(file);
  };

  return (
    <section className="builder-upload mb-8">
      <h2 className="builder-section-title">Optional: upload an existing résumé</h2>
      <p className="text-sm text-[var(--color-grey)] mb-4 max-w-prose">
        Upload a PDF, DOCX, or TXT file to prefill the form. You can skip this and fill everything
        manually.
      </p>

      <div
        className={[
          "builder-upload__dropzone",
          isDragging ? "builder-upload__dropzone--active" : "",
        ].join(" ")}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={onDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.docx,.txt,.md,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document,text/plain"
          className="sr-only"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void processFile(file);
            e.target.value = "";
          }}
        />
        <FileUp size={20} aria-hidden="true" className="text-[var(--color-grey)]" />
        <p className="text-sm">
          Drag and drop, or{" "}
          <button
            type="button"
            className="underline text-[var(--color-ink)] hover:text-[var(--color-accent)]"
            onClick={() => inputRef.current?.click()}
            disabled={isParsing}
          >
            browse files
          </button>
        </p>
        <p className="text-xs text-[var(--color-grey)]">PDF, DOCX, or TXT · max 3 MB</p>
      </div>

      {isParsing ? (
        <p className="mt-4 text-sm text-[var(--color-grey)] flex items-center gap-2" role="status">
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          Extracting and parsing {fileName || "résumé"}…
        </p>
      ) : null}

      {error ? (
        <p className="builder-error mt-4" role="alert">
          {error}
        </p>
      ) : null}

      {pending ? (
        <div
          className="builder-suggestion mt-6"
          role="dialog"
          aria-labelledby="upload-review-title"
        >
          <div className="flex items-start justify-between gap-4 mb-3">
            <h3 id="upload-review-title" className="builder-section-title text-base mb-0">
              Review extracted details
            </h3>
            <button
              type="button"
              className="text-[var(--color-grey)] hover:text-[var(--color-ink)]"
              aria-label="Dismiss"
              onClick={() => setPending(null)}
            >
              <X size={16} />
            </button>
          </div>
          <p className="text-sm text-[var(--color-grey)] mb-4">
            Nothing is applied until you accept. Review the extracted data below.
          </p>
          <dl className="text-sm space-y-2 mb-4">
            <div>
              <dt className="label-caps text-xs text-[var(--color-grey)]">Name</dt>
              <dd>{pending.personalInfo.fullName || "—"}</dd>
            </div>
            <div>
              <dt className="label-caps text-xs text-[var(--color-grey)]">Title</dt>
              <dd>{pending.personalInfo.professionalTitle || "—"}</dd>
            </div>
            <div>
              <dt className="label-caps text-xs text-[var(--color-grey)]">Skills</dt>
              <dd>{pending.skills.length ? pending.skills.join(", ") : "—"}</dd>
            </div>
            <div>
              <dt className="label-caps text-xs text-[var(--color-grey)]">Experience entries</dt>
              <dd>{pending.experience.length}</dd>
            </div>
          </dl>
          <div className="flex flex-wrap gap-2">
            <BuilderButton
              variant="primary"
              type="button"
              onClick={() => {
                onAccept(pending);
                setPending(null);
              }}
            >
              Accept &amp; prefill
            </BuilderButton>
            <BuilderButton variant="secondary" type="button" onClick={() => setPending(null)}>
              Discard
            </BuilderButton>
          </div>
        </div>
      ) : null}
    </section>
  );
}
