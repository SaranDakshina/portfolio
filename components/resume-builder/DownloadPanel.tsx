"use client";

import { useState } from "react";
import { BuilderButton } from "@/components/resume-builder/FormFields";
import ResumePreview from "@/components/resume-builder/ResumePreview";
import CoverLetterPreview from "@/components/resume-builder/CoverLetterPreview";
import { useDocumentDownload } from "@/hooks/useDocumentDownload";
import { Download, Loader2, Package } from "lucide-react";

interface DownloadPanelProps {
  onBack: () => void;
}

export default function DownloadPanel({ onBack }: DownloadPanelProps) {
  const [loading, setLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeDoc, setActiveDoc] = useState<"resume" | "cover-letter">("resume");
  const {
    names,
    downloadResumePdf,
    downloadCoverLetterPdf,
    downloadResumeDocx,
    downloadCoverLetterDocx,
    downloadZip,
  } = useDocumentDownload();

  const handleDownload = async (key: string, fn: () => Promise<void>) => {
    setLoading(key);
    setError(null);
    try {
      await fn();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Download failed.");
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="builder-download space-y-8">
      <section>
        <h2 className="builder-section-title">Download your documents</h2>
        <p className="text-[var(--color-grey)] max-w-prose">
          Export your resume and cover letter individually or download everything
          together as a ZIP archive.
        </p>
      </section>

      <div className="grid md:grid-cols-2 gap-4">
        <DownloadCard
          title="Resume (PDF)"
          fileName={names.resumePdf}
          loading={loading === "resume-pdf"}
          onDownload={() => handleDownload("resume-pdf", downloadResumePdf)}
        />
        <DownloadCard
          title="Cover letter (PDF)"
          fileName={names.coverLetterPdf}
          loading={loading === "cover-pdf"}
          onDownload={() => handleDownload("cover-pdf", downloadCoverLetterPdf)}
        />
        <DownloadCard
          title="Resume (DOCX)"
          fileName={names.resumeDocx}
          loading={loading === "resume-docx"}
          onDownload={() => handleDownload("resume-docx", downloadResumeDocx)}
        />
        <DownloadCard
          title="Cover letter (DOCX)"
          fileName={names.coverLetterDocx}
          loading={loading === "cover-docx"}
          onDownload={() => handleDownload("cover-docx", downloadCoverLetterDocx)}
        />
      </div>

      <div className="builder-card">
        <h3 className="builder-section-title text-base">Download all</h3>
        <p className="text-sm text-[var(--color-grey)] mb-4">
          Includes PDF and DOCX versions of both documents.
        </p>
        <BuilderButton
          variant="primary"
          onClick={() => handleDownload("zip", downloadZip)}
          disabled={loading === "zip"}
        >
          {loading === "zip" ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Package size={14} aria-hidden="true" />
          )}
          Download ZIP ({names.zip})
        </BuilderButton>
      </div>

      <section className="builder-download__preview-pane">
        <div className="flex flex-wrap gap-2 mb-4" role="tablist" aria-label="Document type">
          <BuilderButton
            variant={activeDoc === "resume" ? "primary" : "secondary"}
            onClick={() => setActiveDoc("resume")}
            aria-selected={activeDoc === "resume"}
          >
            Resume
          </BuilderButton>
          <BuilderButton
            variant={activeDoc === "cover-letter" ? "primary" : "secondary"}
            onClick={() => setActiveDoc("cover-letter")}
            aria-selected={activeDoc === "cover-letter"}
          >
            Cover letter
          </BuilderButton>
        </div>

        <h3 className="builder-section-title text-base mb-4">
          {activeDoc === "resume" ? "Resume preview" : "Cover letter preview"}
        </h3>
        {activeDoc === "resume" ? <ResumePreview /> : <CoverLetterPreview />}
      </section>

      {error ? (
        <p className="builder-error" role="alert">
          {error}
        </p>
      ) : null}

      <div className="flex justify-start">
        <BuilderButton type="button" variant="secondary" onClick={onBack}>
          Back to editor
        </BuilderButton>
      </div>
    </div>
  );
}

function DownloadCard({
  title,
  fileName,
  loading,
  onDownload,
}: {
  title: string;
  fileName: string;
  loading: boolean;
  onDownload: () => void;
}) {
  return (
    <div className="builder-card">
      <h3 className="font-medium mb-1">{title}</h3>
      <p className="text-xs text-[var(--color-grey)] mb-4 truncate">{fileName}</p>
      <BuilderButton variant="secondary" onClick={onDownload} disabled={loading}>
        {loading ? (
          <Loader2 size={14} className="animate-spin" aria-hidden="true" />
        ) : (
          <Download size={14} aria-hidden="true" />
        )}
        Download
      </BuilderButton>
    </div>
  );
}
