"use client";

import { useEffect, useState } from "react";
import BuilderSidebar from "@/components/resume-builder/BuilderSidebar";
import BuilderTopBar from "@/components/resume-builder/BuilderTopBar";
import BuilderRightPanel from "@/components/resume-builder/BuilderRightPanel";
import BuilderWorkspace from "@/components/resume-builder/BuilderWorkspace";
import { ResumeBuilderProvider, useResumeBuilder } from "@/context/ResumeBuilderContext";
import { getLenis } from "@/lib/scroll";
import type { BuilderStep } from "@/types/resume-builder";
import { PanelRight } from "lucide-react";

function BuilderContent() {
  const { state, dispatch } = useResumeBuilder();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [mobilePanelOpen, setMobilePanelOpen] = useState(false);

  useEffect(() => {
    const lenis = getLenis();
    lenis?.stop();

    const previousHtmlOverflow = document.documentElement.style.overflow;
    const previousBodyOverflow = document.body.style.overflow;
    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";

    return () => {
      lenis?.start();
      document.documentElement.style.overflow = previousHtmlOverflow;
      document.body.style.overflow = previousBodyOverflow;
    };
  }, []);

  const showRightPanel = !(state.step === "edit" && state.editorView === "preview");

  const handleStepClick = (step: BuilderStep) => {
    dispatch({ type: "SET_STEP", step });
    setMobileNavOpen(false);
    setMobilePanelOpen(false);
  };

  return (
    <div className="builder-app">
      {mobileNavOpen ? (
        <button
          type="button"
          className="builder-app__overlay"
          aria-label="Close navigation"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <BuilderSidebar
        currentStep={state.step}
        onStepClick={handleStepClick}
        className={mobileNavOpen ? "builder-sidebar--open" : ""}
      />

      <div className="builder-app__main">
        <BuilderTopBar currentStep={state.step} savedAt={state.lastSavedAt} />

        <div
          className={`builder-app__content${showRightPanel ? "" : " builder-app__content--full"}`}
        >
          <div className="builder-app__workspace" data-lenis-prevent>
            <BuilderWorkspace />
          </div>

          {showRightPanel ? (
            <BuilderRightPanel
              step={state.step}
              onClose={mobilePanelOpen ? () => setMobilePanelOpen(false) : undefined}
              className={mobilePanelOpen ? "builder-right-panel--open" : ""}
            />
          ) : null}
        </div>
      </div>

      <nav className="builder-mobile-nav" aria-label="Mobile builder navigation">
        <button
          type="button"
          className="builder-mobile-nav__item"
          onClick={() => {
            setMobilePanelOpen(false);
            setMobileNavOpen((open) => !open);
          }}
        >
          Steps
        </button>
        {showRightPanel ? (
          <button
            type="button"
            className="builder-mobile-nav__item"
            onClick={() => {
              setMobileNavOpen(false);
              setMobilePanelOpen((open) => !open);
            }}
          >
            <PanelRight size={14} aria-hidden="true" />
            Tools
          </button>
        ) : null}
      </nav>
    </div>
  );
}

export default function BuilderShell() {
  return (
    <ResumeBuilderProvider>
      <BuilderContent />
    </ResumeBuilderProvider>
  );
}
