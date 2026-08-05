"use client";

import { useResumeBuilder } from "@/context/ResumeBuilderContext";

export default function CoverLetterPreview() {
  const { state } = useResumeBuilder();
  const { coverLetter, resume, company, job } = state;

  const date = new Date().toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const paragraphs = coverLetter.split(/\n\n+/).filter(Boolean);

  return (
    <article
      className="builder-preview builder-preview--scroll"
      aria-label="Cover letter preview"
      data-lenis-prevent
    >
      <p className="builder-preview__meta">{date}</p>
      <div className="builder-preview__address mb-6">
        {company.hiringManagerName ? <p>{company.hiringManagerName}</p> : null}
        <p>{company.companyName || "Company name"}</p>
        {job.location ? <p>{job.location}</p> : null}
      </div>
      <p className="builder-preview__meta mb-4">Re: {job.jobTitle || "Job title"}</p>
      {paragraphs.length > 0 ? (
        paragraphs.map((paragraph, index) => (
          <p key={index} className="mb-4">
            {paragraph}
          </p>
        ))
      ) : (
        <p className="text-[var(--color-grey)]">
          Your cover letter will appear here after generation or manual entry.
        </p>
      )}
      <p className="mt-8">
        Sincerely,
        <br />
        {resume.personalInfo.fullName || "Your name"}
      </p>
    </article>
  );
}
