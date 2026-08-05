import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
} from "docx";
import type {
  CompanyData,
  JobData,
  PersonalInfo,
  ResumeData,
} from "@/types/resume-builder";

export async function generateResumeDocx(resume: ResumeData): Promise<Blob> {
  const { personalInfo } = resume;
  const children: Paragraph[] = [
    new Paragraph({
      heading: HeadingLevel.TITLE,
      children: [new TextRun({ text: personalInfo.fullName, bold: true })],
    }),
    new Paragraph({
      children: [new TextRun(personalInfo.professionalTitle)],
    }),
    new Paragraph({
      children: [
        new TextRun(
          [
            personalInfo.email,
            personalInfo.phone,
            personalInfo.location,
          ]
            .filter(Boolean)
            .join(" · ")
        ),
      ],
    }),
    new Paragraph({ text: "" }),
  ];

  if (resume.summary) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Summary")],
      }),
      new Paragraph({ children: [new TextRun(resume.summary)] }),
      new Paragraph({ text: "" })
    );
  }

  if (resume.skills.length > 0) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun("Skills")],
      }),
      new Paragraph({ children: [new TextRun(resume.skills.join(", "))] }),
      new Paragraph({ text: "" })
    );
  }

  for (const exp of resume.experience) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [new TextRun(`${exp.role} — ${exp.company}`)],
      }),
      new Paragraph({
        children: [
          new TextRun(
            `${exp.startDate} – ${exp.isCurrent ? "Present" : exp.endDate || ""}`
          ),
        ],
      })
    );

    for (const achievement of exp.achievements) {
      if (achievement) {
        children.push(
          new Paragraph({
            children: [new TextRun(`• ${achievement}`)],
          })
        );
      }
    }

    children.push(new Paragraph({ text: "" }));
  }

  for (const edu of resume.education) {
    children.push(
      new Paragraph({
        heading: HeadingLevel.HEADING_2,
        children: [
          new TextRun(
            `${edu.qualification}${edu.fieldOfStudy ? `, ${edu.fieldOfStudy}` : ""}`
          ),
        ],
      }),
      new Paragraph({
        children: [
          new TextRun(
            `${edu.institution}${edu.endDate ? ` · ${edu.endDate}` : ""}`
          ),
        ],
      }),
      new Paragraph({ text: "" })
    );
  }

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBlob(doc);
}

export async function generateCoverLetterDocx(
  coverLetter: string,
  personalInfo: PersonalInfo,
  company: CompanyData,
  job: JobData
): Promise<Blob> {
  const date = new Date().toLocaleDateString("en-NZ", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const children: Paragraph[] = [
    new Paragraph({ children: [new TextRun(date)] }),
    new Paragraph({ text: "" }),
  ];

  if (company.hiringManagerName) {
    children.push(
      new Paragraph({ children: [new TextRun(company.hiringManagerName)] })
    );
  }

  children.push(
    new Paragraph({ children: [new TextRun(company.companyName)] }),
    new Paragraph({ text: "" }),
    new Paragraph({ children: [new TextRun(`Re: ${job.jobTitle}`)] }),
    new Paragraph({ text: "" })
  );

  for (const paragraph of coverLetter.split(/\n\n+/).filter(Boolean)) {
    children.push(new Paragraph({ children: [new TextRun(paragraph)] }));
  }

  children.push(
    new Paragraph({ text: "" }),
    new Paragraph({
      children: [new TextRun(`Sincerely,\n${personalInfo.fullName}`)],
    })
  );

  const doc = new Document({ sections: [{ children }] });
  return Packer.toBlob(doc);
}
