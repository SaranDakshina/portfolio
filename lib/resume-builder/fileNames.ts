export function sanitizeFileName(value: string): string {
  return value
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "_")
    .replace(/_+/g, "_")
    .slice(0, 60) || "Document";
}

export function buildFileNames(candidateName: string, companyName: string) {
  const candidate = sanitizeFileName(candidateName || "Candidate");
  const company = sanitizeFileName(companyName || "Company");

  return {
    resumePdf: `${candidate}_Resume_${company}.pdf`,
    coverLetterPdf: `${candidate}_Cover_Letter_${company}.pdf`,
    resumeDocx: `${candidate}_Resume_${company}.docx`,
    coverLetterDocx: `${candidate}_Cover_Letter_${company}.docx`,
    zip: `${candidate}_Application_${company}.zip`,
  };
}
