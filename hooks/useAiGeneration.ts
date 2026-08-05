"use client";

import { useCallback, useRef } from "react";
import { generateResumeContent } from "@/lib/ai/client";
import { createId } from "@/lib/resume-builder/defaults";
import {
  buildInstructions,
  resumeToProfile,
  toCompanyDetails,
  tryParseJson,
} from "@/lib/resume-builder/utils";
import { useResumeBuilder } from "@/context/ResumeBuilderContext";
import type {
  AiAction,
  GeneratedApplication,
  JobRequirements,
} from "@/types/resume-builder";

export function useAiGeneration() {
  const { state, dispatch } = useResumeBuilder();
  const abortRef = useRef<AbortController | null>(null);

  const runAction = useCallback(
    async (action: AiAction, selectedText?: string) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;

      dispatch({ type: "SET_GENERATING", isGenerating: true });
      dispatch({ type: "SET_AI_ERROR", error: null });
      dispatch({ type: "SET_EDITOR_VIEW", view: "edit" });

      try {
        const result = await generateResumeContent(
          {
            action,
            resume: resumeToProfile(state.resume),
            company: toCompanyDetails(state.company, state.job),
            selectedText,
            instructions: buildInstructions(state.settings),
            settings: state.settings,
          },
          controller.signal
        );

        return result;
      } catch (error) {
        if (error instanceof DOMException && error.name === "AbortError") {
          return null;
        }

        const message =
          error instanceof Error ? error.message : "Generation failed.";
        dispatch({ type: "SET_AI_ERROR", error: message });
        return null;
      } finally {
        dispatch({ type: "SET_GENERATING", isGenerating: false });
      }
    },
    [dispatch, state.company, state.job, state.resume, state.settings]
  );

  const generateCoverLetter = useCallback(async () => {
    const result = await runAction("generate-cover-letter");
    if (!result?.content) return;

    dispatch({
      type: "SET_PENDING_SUGGESTION",
      pending: { type: "cover-letter", content: result.content },
    });
  }, [dispatch, runAction]);

  const improveSummary = useCallback(async () => {
    const result = await runAction("improve-summary");
    if (!result?.content) return;

    dispatch({
      type: "SET_PENDING_SUGGESTION",
      pending: {
        type: "summary",
        content: result.content,
        originalText: state.resume.summary,
      },
    });
  }, [dispatch, runAction, state.resume.summary]);

  const improveExperience = useCallback(
    async (selectedText: string) => {
      const result = await runAction("improve-experience", selectedText);
      if (!result?.content) return result;

      return result.content;
    },
    [runAction]
  );

  const extractJobRequirements = useCallback(async () => {
    const result = await runAction("extract-job-requirements");
    if (!result?.content) return null;

    const parsed = tryParseJson<JobRequirements>(result.content);
    if (parsed) {
      dispatch({
        type: "SET_JOB",
        job: {
          ...state.job,
          requiredSkills: parsed.requiredSkills,
          preferredSkills: parsed.preferredSkills,
        },
      });

      dispatch({
        type: "SET_GENERATED",
        generated: {
          coverLetter: state.coverLetter,
          recommendedSkills: parsed.keywords,
          bulletSuggestions: [],
          missingKeywords: parsed.warnings,
          extractedRequirements: parsed,
        },
      });
    }

    return result;
  }, [dispatch, runAction, state.coverLetter, state.job]);

  const generateFullApplication = useCallback(async () => {
    const coverResult = await runAction("generate-cover-letter");
    if (!coverResult?.content) return;

    const generated: GeneratedApplication = {
      coverLetter: coverResult.content,
      recommendedSkills: [],
      bulletSuggestions: [],
      missingKeywords: coverResult.warnings || [],
    };

    if (state.settings.resumeTailoring !== "none") {
      const tailorResult = await runAction("tailor-resume");
      if (tailorResult?.content) {
        const parsed = tryParseJson<{
          summary?: string;
          skills?: string[];
          experienceSuggestions?: Array<{
            company: string;
            role: string;
            achievements: string[];
          }>;
          warnings?: string[];
        }>(tailorResult.content);

        if (parsed) {
          generated.tailoredSummary = parsed.summary;
          generated.recommendedSkills = parsed.skills || [];
          generated.missingKeywords = parsed.warnings || [];
          generated.bulletSuggestions = (parsed.experienceSuggestions || []).flatMap(
            (exp) =>
              exp.achievements.map((achievement) => ({
                id: createId(),
                section: `${exp.company} — ${exp.role}`,
                originalText: "",
                suggestedText: achievement,
                reason: `Tailored for ${state.job.jobTitle}`,
                accepted: false,
              }))
          );
        }
      }
    }

    dispatch({ type: "SET_GENERATED", generated });
    dispatch({
      type: "SET_PENDING_SUGGESTION",
      pending: { type: "cover-letter", content: coverResult.content },
    });
  }, [dispatch, runAction, state.job.jobTitle, state.settings.resumeTailoring]);

  const parseResume = useCallback(async (rawText: string) => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: "SET_GENERATING", isGenerating: true });
    dispatch({ type: "SET_AI_ERROR", error: null });
    dispatch({ type: "SET_EDITOR_VIEW", view: "edit" });

    try {
      const result = await generateResumeContent(
        {
          action: "parse-resume",
          rawText,
        },
        controller.signal
      );
      return result;
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return null;
      }

      const message =
        error instanceof Error ? error.message : "Failed to parse résumé.";
      dispatch({ type: "SET_AI_ERROR", error: message });
      return null;
    } finally {
      dispatch({ type: "SET_GENERATING", isGenerating: false });
    }
  }, [dispatch]);

  const cancelGeneration = useCallback(() => {
    abortRef.current?.abort();
    dispatch({ type: "SET_GENERATING", isGenerating: false });
  }, [dispatch]);

  return {
    generateCoverLetter,
    improveSummary,
    improveExperience,
    extractJobRequirements,
    generateFullApplication,
    parseResume,
    cancelGeneration,
  };
}
