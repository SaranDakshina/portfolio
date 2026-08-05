import { z } from "zod";

export const personalInfoSchema = z.object({
  fullName: z.string().min(1, "Full name is required"),
  professionalTitle: z.string().min(1, "Professional title is required"),
  email: z.string().email("Enter a valid email"),
  phone: z.string(),
  location: z.string(),
  website: z.string(),
  linkedin: z.string(),
  github: z.string(),
});

export const workExperienceSchema = z.object({
  id: z.string(),
  company: z.string().min(1, "Company is required"),
  role: z.string().min(1, "Role is required"),
  location: z.string(),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string(),
  isCurrent: z.boolean(),
  description: z.string(),
  achievements: z.array(z.string()),
  technologies: z.array(z.string()),
});

export const educationSchema = z.object({
  id: z.string(),
  institution: z.string().min(1, "Institution is required"),
  qualification: z.string().min(1, "Qualification is required"),
  fieldOfStudy: z.string(),
  startDate: z.string(),
  endDate: z.string(),
  location: z.string(),
  description: z.string(),
});

export const projectSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  role: z.string(),
  description: z.string().min(1, "Description is required"),
  technologies: z.array(z.string()),
  url: z.string(),
});

export const resumeSchema = z.object({
  personalInfo: personalInfoSchema,
  summary: z.string(),
  skills: z.array(z.string()),
  experience: z.array(workExperienceSchema),
  education: z.array(educationSchema),
  projects: z.array(projectSchema),
  certifications: z.array(z.string()),
  languages: z.array(z.string()),
});

export const companySchema = z.object({
  companyName: z.string().min(1, "Company name is required"),
  website: z.string(),
  industry: z.string(),
  description: z.string(),
  values: z.array(z.string()),
  hiringManagerName: z.string(),
  hiringManagerRole: z.string(),
});

export const jobSchema = z.object({
  jobTitle: z.string().min(1, "Job title is required"),
  location: z.string(),
  description: z.string().min(50, "Job description must be at least 50 characters"),
  requiredSkills: z.array(z.string()),
  preferredSkills: z.array(z.string()),
  source: z.string(),
  notes: z.string(),
});

export const tailoringSettingsSchema = z.object({
  tone: z.enum(["professional", "confident", "friendly", "formal", "creative"]),
  length: z.enum(["short", "standard", "detailed"]),
  resumeTailoring: z.enum(["none", "suggest", "automatic"]),
  writingStyle: z.enum(["direct", "story", "achievement", "technical", "leadership"]),
  additionalInstructions: z.string(),
});

export const fetchJobSchema = z.object({
  company: z.object({
    companyName: z.string().min(1),
    website: z.string().optional(),
    industry: z.string().optional(),
    description: z.string().optional(),
    hiringManagerName: z.string().optional(),
  }),
  job: z.object({
    jobTitle: z.string().min(1),
    location: z.string().optional(),
    description: z.string().min(50),
    requiredSkills: z.array(z.string()).optional(),
    preferredSkills: z.array(z.string()).optional(),
    source: z.string().optional(),
  }),
  warnings: z.array(z.string()).optional(),
});
