"use client";

import DocumentEditor from "@/components/resume-builder/DocumentEditor";
import DownloadPanel from "@/components/resume-builder/DownloadPanel";
import ResumeForm from "@/components/resume-builder/ResumeForm";
import TargetJobForm from "@/components/resume-builder/TargetJobForm";
import { useResumeBuilder } from "@/context/ResumeBuilderContext";
import type { BuilderStep } from "@/types/resume-builder";

export default function BuilderWorkspace() {
  const { state, dispatch } = useResumeBuilder();

  const goTo = (step: BuilderStep) => dispatch({ type: "SET_STEP", step });

  switch (state.step) {
    case "resume":
      return <ResumeForm onNext={() => goTo("job")} />;
    case "job":
      return (
        <TargetJobForm
          onNext={() => goTo("edit")}
          onBack={() => goTo("resume")}
        />
      );
    case "edit":
      return (
        <DocumentEditor
          onNext={() => goTo("download")}
          onBack={() => goTo("job")}
        />
      );
    case "download":
      return <DownloadPanel onBack={() => goTo("edit")} />;
    default:
      return null;
  }
}
