"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BuilderButton,
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/resume-builder/FormFields";
import { companySchema, jobSchema, tailoringSettingsSchema } from "@/lib/resume-builder/schemas";
import { fetchJobFromUrl } from "@/lib/ai/client";
import { formatCommaList, parseCommaList } from "@/lib/resume-builder/utils";
import { useResumeBuilder } from "@/context/ResumeBuilderContext";
import { useAiGeneration } from "@/hooks/useAiGeneration";
import type { FetchJobResult } from "@/types/resume-builder";
import { Loader2, Sparkles } from "lucide-react";
import { z } from "zod";

const targetJobSchema = z.object({
  company: companySchema,
  job: jobSchema,
  settings: tailoringSettingsSchema,
});

type TargetJobFormData = z.infer<typeof targetJobSchema>;

interface TargetJobFormProps {
  onNext: () => void;
  onBack: () => void;
}

function hasExistingJobContent(data: TargetJobFormData): boolean {
  const { company, job } = data;

  return Boolean(
    company.companyName.trim() ||
      company.website.trim() ||
      company.industry.trim() ||
      company.description.trim() ||
      company.hiringManagerName.trim() ||
      job.jobTitle.trim() ||
      job.location.trim() ||
      job.description.trim() ||
      job.requiredSkills.length ||
      job.preferredSkills.length ||
      job.notes.trim()
  );
}

export default function TargetJobForm({ onNext, onBack }: TargetJobFormProps) {
  const { state, dispatch } = useResumeBuilder();
  const { generateFullApplication } = useAiGeneration();
  const abortRef = useRef<AbortController | null>(null);

  const [jobUrl, setJobUrl] = useState(state.job.source || "");
  const [isImporting, setIsImporting] = useState(false);
  const [importError, setImportError] = useState<string | null>(null);
  const [importWarnings, setImportWarnings] = useState<string[]>([]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
    getValues,
  } = useForm<TargetJobFormData>({
    resolver: zodResolver(targetJobSchema),
    defaultValues: {
      company: state.company,
      job: state.job,
      settings: state.settings,
    },
  });

  const requiredSkills = watch("job.requiredSkills");
  const preferredSkills = watch("job.preferredSkills");

  const applyImportedJob = (result: FetchJobResult, sourceUrl: string) => {
    setValue("company.companyName", result.company.companyName);
    setValue("company.website", result.company.website || "");
    setValue("company.industry", result.company.industry || "");
    setValue("company.description", result.company.description || "");
    setValue("company.hiringManagerName", result.company.hiringManagerName || "");
    setValue("job.jobTitle", result.job.jobTitle);
    setValue("job.location", result.job.location || "");
    setValue("job.description", result.job.description);
    setValue("job.requiredSkills", result.job.requiredSkills || []);
    setValue("job.preferredSkills", result.job.preferredSkills || []);
    setValue("job.source", result.job.source || sourceUrl);
    setImportWarnings(result.warnings || []);
  };

  const handleImport = async () => {
    const trimmedUrl = jobUrl.trim();

    if (!trimmedUrl) {
      setImportError("Enter a job posting URL to import.");
      return;
    }

    const currentValues = getValues();

    if (
      hasExistingJobContent(currentValues) &&
      !window.confirm("Replace current job details with imported content?")
    ) {
      return;
    }

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setIsImporting(true);
    setImportError(null);
    setImportWarnings([]);

    try {
      const result = await fetchJobFromUrl(trimmedUrl, controller.signal);
      applyImportedJob(result, trimmedUrl);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return;
      }

      setImportError(
        error instanceof Error
          ? error.message
          : "We couldn't read that page. Paste the job description below instead."
      );
    } finally {
      setIsImporting(false);
    }
  };

  const onSubmit = async (data: TargetJobFormData) => {
    dispatch({ type: "SET_COMPANY", company: data.company });
    dispatch({ type: "SET_JOB", job: data.job });
    dispatch({ type: "SET_SETTINGS", settings: data.settings });
    await generateFullApplication();
    onNext();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="builder-form space-y-8">
      <section>
        <h2 className="builder-section-title">Company information</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField label="Company name" htmlFor="companyName" error={errors.company?.companyName?.message}>
            <FormInput id="companyName" {...register("company.companyName")} />
          </FormField>
          <FormField label="Website" htmlFor="website">
            <FormInput id="website" {...register("company.website")} />
          </FormField>
          <FormField label="Industry" htmlFor="industry">
            <FormInput id="industry" {...register("company.industry")} />
          </FormField>
          <FormField label="Hiring manager" htmlFor="hiringManagerName">
            <FormInput id="hiringManagerName" {...register("company.hiringManagerName")} />
          </FormField>
        </div>
        <FormField label="Company description" htmlFor="companyDescription">
          <FormTextarea id="companyDescription" rows={3} {...register("company.description")} />
        </FormField>
      </section>

      <section>
        <h2 className="builder-section-title">Job details</h2>

        <div className="builder-card p-4 space-y-3 mb-4">
          <FormField
            label="Job posting URL"
            htmlFor="jobPostingUrl"
            hint="Paste a public job listing link to prefill the form, or enter details manually below."
          >
            <div className="flex flex-col sm:flex-row gap-3">
              <FormInput
                id="jobPostingUrl"
                type="url"
                value={jobUrl}
                onChange={(event) => setJobUrl(event.target.value)}
                placeholder="https://..."
                disabled={isImporting}
              />
              <BuilderButton
                type="button"
                variant="secondary"
                onClick={handleImport}
                disabled={isImporting || !jobUrl.trim()}
                className="shrink-0"
              >
                {isImporting ? "Importing..." : "Import from link"}
              </BuilderButton>
            </div>
          </FormField>

          {importError ? (
            <p className="builder-error" role="alert">
              {importError}
            </p>
          ) : null}

          {importWarnings.length ? (
            <div className="builder-hint space-y-1">
              {importWarnings.map((warning) => (
                <p key={warning}>{warning}</p>
              ))}
            </div>
          ) : null}
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <FormField label="Job title" htmlFor="jobTitle" error={errors.job?.jobTitle?.message}>
            <FormInput id="jobTitle" {...register("job.jobTitle")} />
          </FormField>
          <FormField label="Location" htmlFor="jobLocation">
            <FormInput id="jobLocation" {...register("job.location")} />
          </FormField>
        </div>
        <FormField
          label="Job description"
          htmlFor="jobDescription"
          error={errors.job?.description?.message}
          hint="Paste the full job description. Minimum 50 characters."
        >
          <FormTextarea id="jobDescription" rows={10} {...register("job.description")} />
        </FormField>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField label="Required skills" htmlFor="requiredSkills" hint="Comma-separated.">
            <FormInput
              id="requiredSkills"
              value={formatCommaList(requiredSkills || [])}
              onChange={(event) => setValue("job.requiredSkills", parseCommaList(event.target.value))}
            />
          </FormField>
          <FormField label="Preferred skills" htmlFor="preferredSkills" hint="Comma-separated.">
            <FormInput
              id="preferredSkills"
              value={formatCommaList(preferredSkills || [])}
              onChange={(event) => setValue("job.preferredSkills", parseCommaList(event.target.value))}
            />
          </FormField>
        </div>
        <FormField label="Application source" htmlFor="jobSource" hint="Filled automatically when you import from a link.">
          <FormInput id="jobSource" {...register("job.source")} readOnly />
        </FormField>
        <FormField label="Additional notes" htmlFor="notes">
          <FormTextarea id="notes" rows={3} {...register("job.notes")} />
        </FormField>
      </section>

      <section>
        <h2 className="builder-section-title">How to tailor</h2>
        <p className="text-[var(--color-grey)] mb-6 max-w-prose">
          Choose how the cover letter and résumé suggestions should be written.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <FormField label="Tone" htmlFor="tone">
            <FormSelect id="tone" {...register("settings.tone")}>
              <option value="professional">Professional</option>
              <option value="confident">Confident</option>
              <option value="friendly">Friendly</option>
              <option value="formal">Formal</option>
              <option value="creative">Creative</option>
            </FormSelect>
          </FormField>
          <FormField label="Cover letter length" htmlFor="length">
            <FormSelect id="length" {...register("settings.length")}>
              <option value="short">Short</option>
              <option value="standard">Standard</option>
              <option value="detailed">Detailed</option>
            </FormSelect>
          </FormField>
          <FormField label="Résumé tailoring" htmlFor="resumeTailoring">
            <FormSelect id="resumeTailoring" {...register("settings.resumeTailoring")}>
              <option value="none">No résumé changes</option>
              <option value="suggest">Suggest changes only</option>
              <option value="automatic">Tailor summary and skills</option>
            </FormSelect>
          </FormField>
          <FormField label="Writing style" htmlFor="writingStyle">
            <FormSelect id="writingStyle" {...register("settings.writingStyle")}>
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
            {...register("settings.additionalInstructions")}
          />
        </FormField>
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
