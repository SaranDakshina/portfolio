"use client";

import { useCallback } from "react";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import { buildFileNames } from "@/lib/resume-builder/fileNames";
import { generateCoverLetterDocx, generateResumeDocx } from "@/lib/resume-builder/docx";
import {
  generateCoverLetterPdfBlob,
  generateResumePdfBlob,
} from "@/lib/resume-builder/pdf";
import { useResumeBuilder } from "@/context/ResumeBuilderContext";

export function useDocumentDownload() {
  const { state } = useResumeBuilder();

  const names = buildFileNames(
    state.resume.personalInfo.fullName,
    state.company.companyName
  );

  const downloadResumePdf = useCallback(async () => {
    const blob = await generateResumePdfBlob(state.resume);
    saveAs(blob, names.resumePdf);
  }, [names.resumePdf, state.resume]);

  const downloadCoverLetterPdf = useCallback(async () => {
    const blob = await generateCoverLetterPdfBlob(
      state.coverLetter,
      state.resume.personalInfo,
      state.company,
      state.job
    );
    saveAs(blob, names.coverLetterPdf);
  }, [names.coverLetterPdf, state.company, state.coverLetter, state.job, state.resume.personalInfo]);

  const downloadResumeDocx = useCallback(async () => {
    const blob = await generateResumeDocx(state.resume);
    saveAs(blob, names.resumeDocx);
  }, [names.resumeDocx, state.resume]);

  const downloadCoverLetterDocx = useCallback(async () => {
    const blob = await generateCoverLetterDocx(
      state.coverLetter,
      state.resume.personalInfo,
      state.company,
      state.job
    );
    saveAs(blob, names.coverLetterDocx);
  }, [names.coverLetterDocx, state.company, state.coverLetter, state.job, state.resume.personalInfo]);

  const downloadZip = useCallback(async () => {
    const zip = new JSZip();
    const [resumePdf, coverPdf, resumeDocx, coverDocx] = await Promise.all([
      generateResumePdfBlob(state.resume),
      generateCoverLetterPdfBlob(
        state.coverLetter,
        state.resume.personalInfo,
        state.company,
        state.job
      ),
      generateResumeDocx(state.resume),
      generateCoverLetterDocx(
        state.coverLetter,
        state.resume.personalInfo,
        state.company,
        state.job
      ),
    ]);

    zip.file(names.resumePdf, resumePdf);
    zip.file(names.coverLetterPdf, coverPdf);
    zip.file(names.resumeDocx, resumeDocx);
    zip.file(names.coverLetterDocx, coverDocx);

    const blob = await zip.generateAsync({ type: "blob" });
    saveAs(blob, names.zip);
  }, [names, state.company, state.coverLetter, state.job, state.resume]);

  return {
    names,
    downloadResumePdf,
    downloadCoverLetterPdf,
    downloadResumeDocx,
    downloadCoverLetterDocx,
    downloadZip,
  };
}
