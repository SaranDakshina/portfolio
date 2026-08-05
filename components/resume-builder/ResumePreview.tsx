"use client";

import { useResumeBuilder } from "@/context/ResumeBuilderContext";

export default function ResumePreview() {
  const { state } = useResumeBuilder();
  const { resume } = state;
  const { personalInfo } = resume;

  return (
    <article
      className="builder-preview builder-preview--scroll"
      aria-label="Resume preview"
      data-lenis-prevent
    >
      <header className="builder-preview__header">
        <h2 className="builder-preview__name">{personalInfo.fullName || "Your name"}</h2>
        <p className="builder-preview__title">
          {personalInfo.professionalTitle || "Professional title"}
        </p>
        <p className="builder-preview__contact">
          {[personalInfo.email, personalInfo.phone, personalInfo.location]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {resume.summary ? (
        <section className="builder-preview__section">
          <h3>Summary</h3>
          <p>{resume.summary}</p>
        </section>
      ) : null}

      {resume.skills.length > 0 ? (
        <section className="builder-preview__section">
          <h3>Skills</h3>
          <p>{resume.skills.join(" · ")}</p>
        </section>
      ) : null}

      {resume.experience.length > 0 ? (
        <section className="builder-preview__section">
          <h3>Experience</h3>
          {resume.experience.map((exp) => (
            <div key={exp.id} className="builder-preview__item">
              <p className="builder-preview__item-title">
                {exp.role} — {exp.company}
              </p>
              <p className="builder-preview__item-meta">
                {exp.startDate} – {exp.isCurrent ? "Present" : exp.endDate}
              </p>
              <ul>
                {exp.achievements.filter(Boolean).map((achievement, i) => (
                  <li key={i}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>
      ) : null}

      {resume.education.length > 0 ? (
        <section className="builder-preview__section">
          <h3>Education</h3>
          {resume.education.map((edu) => (
            <div key={edu.id} className="builder-preview__item">
              <p className="builder-preview__item-title">
                {edu.qualification}
                {edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}
              </p>
              <p className="builder-preview__item-meta">{edu.institution}</p>
            </div>
          ))}
        </section>
      ) : null}
    </article>
  );
}
