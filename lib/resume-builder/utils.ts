import type {
  CompanyData,
  CompanyDetails,
  JobData,
  ResumeData,
  ResumeProfile,
  TailoringSettings,
} from "@/types/resume-builder";

export function resumeToProfile(resume: ResumeData): ResumeProfile {
  return {
    fullName: resume.personalInfo.fullName,
    professionalTitle: resume.personalInfo.professionalTitle,
    summary: resume.summary,
    skills: resume.skills,
    experience: resume.experience.map((exp) => ({
      company: exp.company,
      role: exp.role,
      startDate: exp.startDate,
      endDate: exp.isCurrent ? "Present" : exp.endDate || "",
      achievements: exp.achievements.filter(Boolean),
    })),
    education: resume.education.map((edu) => ({
      institution: edu.institution,
      qualification: edu.qualification,
      year: edu.endDate || edu.startDate,
    })),
  };
}

export function toCompanyDetails(
  company: CompanyData,
  job: JobData
): CompanyDetails {
  return {
    companyName: company.companyName,
    roleTitle: job.jobTitle,
    hiringManager: company.hiringManagerName,
    companyDescription: company.description,
    jobDescription: job.description,
  };
}

export function buildInstructions(settings: TailoringSettings): string {
  const parts = [
    `Tone: ${settings.tone}`,
    `Length: ${settings.length}`,
    `Writing style: ${settings.writingStyle}`,
    `Resume tailoring: ${settings.resumeTailoring}`,
  ];

  if (settings.additionalInstructions?.trim()) {
    parts.push(`Additional instructions: ${settings.additionalInstructions.trim()}`);
  }

  return parts.join("\n");
}

export function parseCommaList(value: string): string[] {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

export function formatCommaList(items: string[]): string {
  return items.join(", ");
}

export function tryParseJson<T>(content: string): T | null {
  const trimmed = content.trim();
  const jsonMatch = trimmed.match(/```json\s*([\s\S]*?)\s*```/) ||
    trimmed.match(/```\s*([\s\S]*?)\s*```/);

  const candidate = jsonMatch ? jsonMatch[1] : trimmed;

  try {
    return JSON.parse(candidate) as T;
  } catch {
    return null;
  }
}
