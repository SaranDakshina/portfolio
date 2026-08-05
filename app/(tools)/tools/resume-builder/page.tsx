import type { Metadata } from "next";
import BuilderShell from "@/components/resume-builder/BuilderShell";

export const metadata: Metadata = {
  title: "Résumé & Cover Letter Builder — Saran",
  description:
    "Build a tailored resume and cover letter for your next application.",
};

export default function ResumeBuilderPage() {
  return <BuilderShell />;
}
