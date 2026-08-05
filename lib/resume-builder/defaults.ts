import type {
  BuilderState,
  CompanyData,
  JobData,
  ResumeData,
  TailoringSettings,
} from "@/types/resume-builder";

export function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export const defaultPersonalInfo = {
  fullName: "",
  professionalTitle: "",
  email: "",
  phone: "",
  location: "",
  website: "",
  linkedin: "",
  github: "",
};

export const defaultResume: ResumeData = {
  personalInfo: defaultPersonalInfo,
  summary: "",
  skills: [],
  experience: [],
  education: [],
  projects: [],
  certifications: [],
  languages: [],
};

export const defaultCompany: CompanyData = {
  companyName: "",
  website: "",
  industry: "",
  description: "",
  values: [],
  hiringManagerName: "",
  hiringManagerRole: "",
};

export const defaultJob: JobData = {
  jobTitle: "",
  location: "",
  description: "",
  requiredSkills: [],
  preferredSkills: [],
  source: "",
  notes: "",
};

export const defaultSettings: TailoringSettings = {
  tone: "professional",
  length: "standard",
  resumeTailoring: "suggest",
  writingStyle: "achievement",
  additionalInstructions: "",
};

export const defaultBuilderState: BuilderState = {
  step: "resume",
  editorView: "edit",
  resume: defaultResume,
  company: defaultCompany,
  job: defaultJob,
  settings: defaultSettings,
  coverLetter: "",
  generated: null,
  pendingSuggestion: null,
  isGenerating: false,
  aiError: null,
  lastSavedAt: null,
};

export const BUILDER_STEPS = [
  { id: "resume" as const, label: "Resume" },
  { id: "job" as const, label: "Target job" },
  { id: "edit" as const, label: "Editor" },
  { id: "download" as const, label: "Download" },
] as const;
