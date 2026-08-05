import { createId } from "@/lib/resume-builder/defaults";
import type { ResumeData } from "@/types/resume-builder";

const MAX_FILE_BYTES = 3 * 1024 * 1024;

const ACCEPTED_EXTENSIONS = [".pdf", ".docx", ".txt", ".md"] as const;

export function isAcceptedResumeFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return ACCEPTED_EXTENSIONS.some((ext) => name.endsWith(ext));
}

export async function extractTextFromFile(file: File): Promise<string> {
  if (file.size > MAX_FILE_BYTES) {
    throw new Error("File is too large. Please use a file under 3 MB.");
  }

  if (!isAcceptedResumeFile(file)) {
    throw new Error("Unsupported file type. Use PDF, DOCX, or TXT.");
  }

  const name = file.name.toLowerCase();

  if (name.endsWith(".txt") || name.endsWith(".md")) {
    const text = await file.text();
    if (!text.trim()) throw new Error("The file appears to be empty.");
    return text;
  }

  if (name.endsWith(".docx")) {
    const mammoth = await import("mammoth");
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    const text = result.value?.trim() || "";
    if (!text) throw new Error("Could not extract text from the DOCX file.");
    return text;
  }

  if (name.endsWith(".pdf")) {
    return extractPdfText(file);
  }

  throw new Error("Unsupported file type. Use PDF, DOCX, or TXT.");
}

async function extractPdfText(file: File): Promise<string> {
  const pdfjs = await import("pdfjs-dist");

  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url
  ).toString();

  const data = new Uint8Array(await file.arrayBuffer());
  const pdf = await pdfjs.getDocument({ data }).promise;
  const pages: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    const pageText = content.items
      .map((item) => ("str" in item ? item.str : ""))
      .join(" ");
    pages.push(pageText);
  }

  const text = pages.join("\n").trim();
  if (!text) throw new Error("Could not extract text from the PDF.");
  return text;
}

/** Normalize AI-parsed resume JSON into ResumeData with stable ids. */
export function normalizeParsedResume(raw: Partial<ResumeData>): ResumeData {
  return {
    personalInfo: {
      fullName: raw.personalInfo?.fullName || "",
      professionalTitle: raw.personalInfo?.professionalTitle || "",
      email: raw.personalInfo?.email || "",
      phone: raw.personalInfo?.phone || "",
      location: raw.personalInfo?.location || "",
      website: raw.personalInfo?.website || "",
      linkedin: raw.personalInfo?.linkedin || "",
      github: raw.personalInfo?.github || "",
    },
    summary: raw.summary || "",
    skills: raw.skills || [],
    experience: (raw.experience || []).map((exp) => ({
      id: createId(),
      company: exp.company || "",
      role: exp.role || "",
      location: exp.location || "",
      startDate: exp.startDate || "",
      endDate: exp.endDate || "",
      isCurrent: Boolean(exp.isCurrent) || /present/i.test(exp.endDate || ""),
      description: exp.description || "",
      achievements: exp.achievements || [],
      technologies: exp.technologies || [],
    })),
    education: (raw.education || []).map((edu) => ({
      id: createId(),
      institution: edu.institution || "",
      qualification: edu.qualification || "",
      fieldOfStudy: edu.fieldOfStudy || "",
      startDate: edu.startDate || "",
      endDate: edu.endDate || "",
      location: edu.location || "",
      description: edu.description || "",
    })),
    projects: (raw.projects || []).map((project) => ({
      id: createId(),
      name: project.name || "",
      role: project.role || "",
      description: project.description || "",
      technologies: project.technologies || [],
      url: project.url || "",
    })),
    certifications: raw.certifications || [],
    languages: raw.languages || [],
  };
}
