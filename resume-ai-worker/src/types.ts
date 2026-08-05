export type AiAction =
  | "generate-cover-letter"
  | "improve-summary"
  | "improve-experience"
  | "tailor-resume"
  | "extract-job-requirements"
  | "parse-resume"
  | "fetch-job";

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

export interface TailoringSettings {
  tone?: string;
  length?: string;
  resumeTailoring?: string;
  writingStyle?: string;
  additionalInstructions?: string;
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
