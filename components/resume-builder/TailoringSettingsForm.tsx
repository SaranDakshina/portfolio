"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BuilderButton,
  FormField,
  FormSelect,
  FormTextarea,
} from "@/components/resume-builder/FormFields";
import { tailoringSettingsSchema } from "@/lib/resume-builder/schemas";
import { useResumeBuilder } from "@/context/ResumeBuilderContext";
import { useAiGeneration } from "@/hooks/useAiGeneration";
import type { TailoringSettings } from "@/types/resume-builder";
import { Loader2, Sparkles } from "lucide-react";

interface TailoringSettingsFormProps {
  onNext: () => void;
  onBack: () => void;
}

export default function TailoringSettingsForm({
  onNext,
  onBack,
}: TailoringSettingsFormProps) {
  const { state, dispatch } = useResumeBuilder();
  const { generateFullApplication, extractJobRequirements } = useAiGeneration();

  const { register, handleSubmit } = useForm<TailoringSettings>({
    resolver: zodResolver(tailoringSettingsSchema),
    defaultValues: state.settings,
  });

  const onSubmit = async (data: TailoringSettings) => {
    dispatch({ type: "SET_SETTINGS", settings: data });
    await generateFullApplication();
    onNext();
  };

  const handleExtract = async () => {
    await extractJobRequirements();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="builder-form space-y-8">
      <section>
        <h2 className="builder-section-title">Tailoring settings</h2>
        <p className="text-[var(--color-grey)] mb-6 max-w-prose">
          Choose how the cover letter and resume suggestions should be written.
          Information you enter is sent to the AI service to generate content.
          Review all generated text before using it.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField label="Tone" htmlFor="tone">
            <FormSelect id="tone" {...register("tone")}>
              <option value="professional">Professional</option>
              <option value="confident">Confident</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="creative">Creative</option>
            </FormSelect>
          </FormField>
          <FormField label="Cover letter length" htmlFor="length">
            <FormSelect id="length" {...register("length")}>
              <option value="short">Short</option>
              <option value="standard">Standard</option>
              <option value="detailed">Detailed</option>
            </FormSelect>
          </FormField>
          <FormField label="Resume tailoring" htmlFor="resumeTailoring">
            <FormSelect id="resumeTailoring" {...register("resumeTailoring")}>
              <option value="none">No resume changes</option>
              <option value="suggest">Suggest changes only</option>
              <option value="automatic">Tailor summary and skills</option>
            </FormSelect>
          </FormField>
          <FormField label="Writing style" htmlFor="writingStyle">
            <FormSelect id="writingStyle" {...register("writingStyle")}>
              <option value="direct">Direct</option>
              <option value="story">Story-led</option>
              <option value="achievement">Achievement-focused</option>
              <option value="technical">Technical</option>
              <option value="leadership">Leadership-focused</option>
            </FormSelect>
          </FormField>
        </div>
        <FormField label="Additional instructions" htmlFor="additionalInstructions">
          <FormTextarea
            id="additionalInstructions"
            rows={3}
            placeholder="Any specific points to emphasise or avoid..."
            {...register("additionalInstructions")}
          />
        </FormField>
      </section>

      <section className="builder-card">
        <h3 className="builder-section-title text-base">Extract job requirements</h3>
        <p className="text-sm text-[var(--color-grey)] mb-4">
          Optionally analyse the job description to pull out skills and keywords before generating.
        </p>
        <BuilderButton
          type="button"
          variant="secondary"
          onClick={handleExtract}
          disabled={state.isGenerating}
        >
          {state.isGenerating ? (
            <Loader2 size={14} className="animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles size={14} aria-hidden="true" />
          )}
          Extract requirements
        </BuilderButton>
        {state.generated?.extractedRequirements ? (
          <div className="mt-4 text-sm space-y-2">
            <p>
              <strong>Required:</strong>{" "}
              {state.generated.extractedRequirements.requiredSkills.join(", ") || "—"}
            </p>
            <p>
              <strong>Keywords:</strong>{" "}
              {state.generated.extractedRequirements.keywords.join(", ") || "—"}
            </p>
          </div>
        ) : null}
      </section>

      {state.aiError ? (
        <p className="builder-error" role="alert">
          {state.aiError}
        </p>
      ) : null}

      <div className="flex justify-between">
        <BuilderButton type="button" variant="secondary" onClick={onBack}>
          Back
        </BuilderButton>
        <BuilderButton type="submit" variant="primary" disabled={state.isGenerating}>
          {state.isGenerating ? (
            <>
              <Loader2 size={14} className="animate-spin" aria-hidden="true" />
              Generating...
            </>
          ) : (
            <>
              <Sparkles size={14} aria-hidden="true" />
              Generate application
            </>
          )}
        </BuilderButton>
      </div>
    </form>
  );
}
