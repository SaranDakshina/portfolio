export type AiAction =
  | "generate-cover-letter"
  | "improve-summary"
  | "improve-experience"
  | "tailor-resume"
  | "extract-job-requirements"
  | "parse-resume"
  | "fetch-job";

export type BuilderStep = "resume" | "job" | "edit" | "download";

export type EditorView = "edit" | "preview";

export type ToneOption =
  | "professional"
  | "confident"
  | "friendly"
  | "formal"
  | "creative";

export type LengthOption = "short" | "standard" | "detailed";

export type ResumeTailoringOption = "none" | "suggest" | "automatic";

export type WritingStyleOption =
  | "direct"
  | "story"
  | "achievement"
  | "technical"
  | "leadership";

export interface PersonalInfo {
  fullName: string;
  professionalTitle: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  linkedin: string;
  github: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  achievements: string[];
  technologies: string[];
}

export interface Education {
  id: string;
  institution: string;
  qualification: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  location: string;
  description: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  role: string;
  description: string;
  technologies: string[];
  url: string;
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  projects: ProjectItem[];
  certifications: string[];
  languages: string[];
}

export interface CompanyData {
  companyName: string;
  website: string;
  industry: string;
  description: string;
  values: string[];
  hiringManagerName: string;
  hiringManagerRole: string;
}

export interface JobData {
  jobTitle: string;
  location: string;
  description: string;
  requiredSkills: string[];
  preferredSkills: string[];
  source: string;
  notes: string;
}

export interface TailoringSettings {
  tone: ToneOption;
  length: LengthOption;
  resumeTailoring: ResumeTailoringOption;
  writingStyle: WritingStyleOption;
  additionalInstructions: string;
}

export interface ResumeSuggestion {
  id: string;
  section: string;
  originalText: string;
  suggestedText: string;
  reason: string;
  accepted: boolean;
}

export interface GeneratedApplication {
  coverLetter: string;
  tailoredSummary?: string;
  recommendedSkills: string[];
  bulletSuggestions: ResumeSuggestion[];
  missingKeywords: string[];
  extractedRequirements?: JobRequirements;
}

export interface JobRequirements {
  requiredSkills: string[];
  preferredSkills: string[];
  responsibilities: string[];
  keywords: string[];
  seniority: string;
  warnings: string[];
}

export interface ImportedCompany {
  companyName: string;
  website?: string;
  industry?: string;
  description?: string;
  hiringManagerName?: string;
}

export interface ImportedJob {
  jobTitle: string;
  location?: string;
  description: string;
  requiredSkills?: string[];
  preferredSkills?: string[];
  source?: string;
}

export interface FetchJobResult {
  company: ImportedCompany;
  job: ImportedJob;
  warnings?: string[];
}

export interface AiRequest {
  action: AiAction;
  resume?: ResumeProfile;
  company?: CompanyDetails;
  selectedText?: string;
  instructions?: string;
  settings?: TailoringSettings;
  rawText?: string;
  jobUrl?: string;
}

export interface AiResponse {
  content?: string;
  company?: ImportedCompany;
  job?: ImportedJob;
  warnings?: string[];
}

export interface ResumeProfile {
  fullName: string;
  professionalTitle: string;
  summary: string;
  skills: string[];
  experience: Array<{
    company: string;
    role: string;
    startDate: string;
    endDate: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    qualification: string;
    year?: string;
  }>;
}

export interface CompanyDetails {
  companyName: string;
  roleTitle: string;
  hiringManager?: string;
  companyDescription?: string;
  jobDescription: string;
}

export interface BuilderState {
  step: BuilderStep;
  editorView: EditorView;
  resume: ResumeData;
  company: CompanyData;
  job: JobData;
  settings: TailoringSettings;
  coverLetter: string;
  generated: GeneratedApplication | null;
  pendingSuggestion: {
    type: "summary" | "experience" | "cover-letter";
    content: string;
    originalText?: string;
  } | null;
  isGenerating: boolean;
  aiError: string | null;
  lastSavedAt: string | null;
}

export type BuilderAction =
  | { type: "SET_STEP"; step: BuilderStep }
  | { type: "SET_EDITOR_VIEW"; view: EditorView }
  | { type: "SET_RESUME"; resume: ResumeData }
  | { type: "SET_COMPANY"; company: CompanyData }
  | { type: "SET_JOB"; job: JobData }
  | { type: "SET_SETTINGS"; settings: TailoringSettings }
  | { type: "SET_COVER_LETTER"; coverLetter: string }
  | { type: "SET_GENERATED"; generated: GeneratedApplication | null }
  | { type: "SET_PENDING_SUGGESTION"; pending: BuilderState["pendingSuggestion"] }
  | { type: "ACCEPT_PENDING_SUGGESTION" }
  | { type: "SET_GENERATING"; isGenerating: boolean }
  | { type: "SET_AI_ERROR"; error: string | null }
  | { type: "SET_LAST_SAVED"; savedAt: string | null }
  | { type: "ACCEPT_SUGGESTION"; id: string }
  | { type: "REJECT_SUGGESTION"; id: string }
  | { type: "HYDRATE"; state: Partial<BuilderState> }
  | { type: "RESET" };
