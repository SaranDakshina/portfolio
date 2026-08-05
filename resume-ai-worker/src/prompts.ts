import type { AiRequest } from "./types";

function serialize(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

export function buildFetchJobPrompt(pageText: string, jobUrl: string): string {
  return `
Extract structured job and company information from the supplied job posting page text.

Requirements:
- Use only information present in the page text.
- Do not invent company facts, hiring manager names, or requirements.
- Return valid JSON only (no markdown fences) using this exact shape:
{
  "company": {
    "companyName": "",
    "website": "",
    "industry": "",
    "description": "",
    "hiringManagerName": ""
  },
  "job": {
    "jobTitle": "",
    "location": "",
    "description": "",
    "requiredSkills": [],
    "preferredSkills": [],
    "source": ""
  },
  "warnings": []
}
- Put the full job description text in job.description.
- Put this listing URL in job.source: ${jobUrl}
- Include warnings for fields that could not be determined.

JOB POSTING PAGE TEXT:
${pageText}
`;
}

export function buildPrompt(request: AiRequest): string {
  if (request.action === "parse-resume") {
    return `
Extract structured resume data from the following raw resume text.

Requirements:
- Use only facts present in the text. Never invent experience, skills, dates, or qualifications.
- Dates should use format like "Jan 2022" or "Present" for current roles.
- Return valid JSON only (no markdown fences) using this exact shape:
{
  "personalInfo": {
    "fullName": "",
    "professionalTitle": "",
    "email": "",
    "phone": "",
    "location": "",
    "website": "",
    "linkedin": "",
    "github": ""
  },
  "summary": "",
  "skills": [],
  "experience": [
    {
      "company": "",
      "role": "",
      "location": "",
      "startDate": "",
      "endDate": "",
      "isCurrent": false,
      "description": "",
      "achievements": [],
      "technologies": []
    }
  ],
  "education": [
    {
      "institution": "",
      "qualification": "",
      "fieldOfStudy": "",
      "startDate": "",
      "endDate": "",
      "location": "",
      "description": ""
    }
  ],
  "projects": [
    {
      "name": "",
      "role": "",
      "description": "",
      "technologies": [],
      "url": ""
    }
  ],
  "certifications": [],
  "languages": []
}

RAW RESUME TEXT:
${request.rawText || ""}
`;
  }

  const sharedContext = `
RESUME:
${serialize(request.resume)}

TARGET COMPANY AND ROLE:
${serialize(request.company)}

USER INSTRUCTIONS:
${request.instructions?.trim() || "No additional instructions provided."}
`;

  switch (request.action) {
    case "generate-cover-letter":
      return `
Create a tailored cover letter using the supplied resume and target role.

Requirements:
- Do not invent facts, metrics, experience, qualifications, or skills.
- Use a professional but natural tone.
- Explain why the candidate fits the role.
- Reference the company only where supported by the supplied information.
- Keep the letter between 300 and 450 words.
- Avoid generic phrases and excessive enthusiasm.
- Return only the cover-letter body in Markdown.
${sharedContext}
`;

    case "improve-summary":
      return `
Rewrite the professional summary for the target role.

Requirements:
- Use only evidence in the resume.
- Keep it between 60 and 100 words.
- Emphasize the most relevant skills and outcomes.
- Avoid first-person pronouns.
- Return only the revised summary.
${sharedContext}
`;

    case "improve-experience":
      return `
Improve the selected resume experience text.

Selected text:
${request.selectedText || "No text selected."}

Requirements:
- Preserve factual accuracy.
- Start bullet points with strong action verbs.
- Do not add fake numbers or achievements.
- Improve clarity and relevance to the target role.
- Return Markdown bullet points only.
${sharedContext}
`;

    case "tailor-resume":
      return `
Suggest revisions that tailor the resume to the job description.

Requirements:
- Never invent experience.
- Identify missing keywords only when supported by the resume.
- Return valid JSON using this shape:
{
  "summary": "revised summary",
  "skills": ["ordered", "relevant", "skills"],
  "experienceSuggestions": [
    {
      "company": "company name",
      "role": "role name",
      "achievements": ["revised bullet"]
    }
  ],
  "warnings": ["facts or requirements that are not supported"]
}
${sharedContext}
`;

    case "extract-job-requirements":
      return `
Analyse the job description and return valid JSON using this shape:
{
  "requiredSkills": [],
  "preferredSkills": [],
  "responsibilities": [],
  "keywords": [],
  "seniority": "",
  "warnings": []
}

Do not infer requirements that are not present in the job description.
${sharedContext}
`;

    default: {
      const exhaustiveCheck: never = request.action;
      throw new Error(`Unsupported action: ${exhaustiveCheck}`);
    }
  }
}
