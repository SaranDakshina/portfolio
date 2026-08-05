"use client";

import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BuilderButton,
  FormField,
  FormInput,
  FormSelect,
  FormTextarea,
} from "@/components/resume-builder/FormFields";
import MonthYearPicker from "@/components/resume-builder/MonthYearPicker";
import ResumeUpload from "@/components/resume-builder/ResumeUpload";
import SkillChips from "@/components/resume-builder/SkillChips";
import { CUSTOM_PROFESSION_ID, professions } from "@/data/professions";
import { createId } from "@/lib/resume-builder/defaults";
import { resumeSchema } from "@/lib/resume-builder/schemas";
import { useResumeBuilder } from "@/context/ResumeBuilderContext";
import type { ResumeData } from "@/types/resume-builder";
import { Plus, Trash2 } from "lucide-react";

interface ResumeFormProps {
  onNext: () => void;
}

export default function ResumeForm({ onNext }: ResumeFormProps) {
  const { state, dispatch } = useResumeBuilder();
  const [prefillStatus, setPrefillStatus] = useState<string | null>(null);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
    reset,
  } = useForm<ResumeData>({
    resolver: zodResolver(resumeSchema),
    defaultValues: state.resume,
  });

  const { fields: experienceFields, append: appendExperience, remove: removeExperience } =
    useFieldArray({ control, name: "experience" });
  const { fields: educationFields, append: appendEducation, remove: removeEducation } =
    useFieldArray({ control, name: "education" });
  const { fields: projectFields, append: appendProject, remove: removeProject } =
    useFieldArray({ control, name: "projects" });

  const skillsValue = watch("skills") || [];
  const titleValue = watch("personalInfo.professionalTitle") || "";

  const matchedProfession = useMemo(
    () => professions.find((p) => p.title === titleValue),
    [titleValue]
  );

  const [professionId, setProfessionId] = useState(
    () => matchedProfession?.id || (titleValue ? CUSTOM_PROFESSION_ID : "")
  );

  useEffect(() => {
    if (matchedProfession) {
      setProfessionId(matchedProfession.id);
    } else if (titleValue) {
      setProfessionId(CUSTOM_PROFESSION_ID);
    }
  }, [matchedProfession, titleValue]);

  const skillSuggestions = matchedProfession?.skills || [];

  const onProfessionChange = (id: string) => {
    setProfessionId(id);
    if (id === CUSTOM_PROFESSION_ID || !id) {
      if (id === CUSTOM_PROFESSION_ID && matchedProfession) {
        setValue("personalInfo.professionalTitle", "");
      }
      return;
    }

    const profession = professions.find((p) => p.id === id);
    if (!profession) return;

    setValue("personalInfo.professionalTitle", profession.title);
    const merged = Array.from(new Set([...skillsValue, ...profession.skills]));
    setValue("skills", merged);
  };

  const onSubmit = (data: ResumeData) => {
    dispatch({ type: "SET_RESUME", resume: data });
    onNext();
  };

  const handlePrefill = (resume: ResumeData) => {
    reset(resume);
    dispatch({ type: "SET_RESUME", resume });
    setPrefillStatus("Résumé details applied. Review and edit as needed.");
    const match = professions.find(
      (p) => p.title === resume.personalInfo.professionalTitle
    );
    setProfessionId(match?.id || CUSTOM_PROFESSION_ID);
  };

  return (
    <div className="space-y-8">
      <ResumeUpload onAccept={handlePrefill} />

      {prefillStatus ? (
        <p className="text-sm text-[var(--color-accent)]" role="status">
          {prefillStatus}
        </p>
      ) : null}

      <form onSubmit={handleSubmit(onSubmit)} className="builder-form space-y-8">
        <section>
          <h2 className="builder-section-title">Personal information</h2>
          <div className="grid md:grid-cols-2 gap-4">
            <FormField
              label="Full name"
              htmlFor="fullName"
              error={errors.personalInfo?.fullName?.message}
            >
              <FormInput
                id="fullName"
                error={!!errors.personalInfo?.fullName}
                {...register("personalInfo.fullName")}
              />
            </FormField>

            <FormField
              label="Profession"
              htmlFor="profession"
              error={errors.personalInfo?.professionalTitle?.message}
              hint="Choose a profession to suggest related skills."
            >
              <FormSelect
                id="profession"
                value={professionId}
                onChange={(e) => onProfessionChange(e.target.value)}
              >
                <option value="">Select a profession</option>
                {professions.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title}
                  </option>
                ))}
                <option value={CUSTOM_PROFESSION_ID}>Custom…</option>
              </FormSelect>
            </FormField>

            {professionId === CUSTOM_PROFESSION_ID ? (
              <FormField label="Custom title" htmlFor="title">
                <FormInput
                  id="title"
                  error={!!errors.personalInfo?.professionalTitle}
                  {...register("personalInfo.professionalTitle")}
                />
              </FormField>
            ) : (
              <input type="hidden" {...register("personalInfo.professionalTitle")} />
            )}

            <FormField
              label="Email"
              htmlFor="email"
              error={errors.personalInfo?.email?.message}
            >
              <FormInput
                id="email"
                type="email"
                error={!!errors.personalInfo?.email}
                {...register("personalInfo.email")}
              />
            </FormField>
            <FormField label="Phone" htmlFor="phone">
              <FormInput id="phone" {...register("personalInfo.phone")} />
            </FormField>
            <FormField label="Location" htmlFor="location">
              <FormInput id="location" {...register("personalInfo.location")} />
            </FormField>
            <FormField label="LinkedIn" htmlFor="linkedin">
              <FormInput id="linkedin" {...register("personalInfo.linkedin")} />
            </FormField>
          </div>
        </section>

        <section>
          <h2 className="builder-section-title">Professional summary</h2>
          <FormField
            label="Summary"
            htmlFor="summary"
            hint="A brief overview of your experience and strengths."
          >
            <FormTextarea id="summary" rows={4} {...register("summary")} />
          </FormField>
        </section>

        <section>
          <h2 className="builder-section-title">Skills</h2>
          <FormField label="Your skills" htmlFor="skills">
            <SkillChips
              skills={skillsValue}
              suggestions={skillSuggestions}
              onChange={(skills) => setValue("skills", skills)}
            />
          </FormField>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="builder-section-title mb-0">Work experience</h2>
            <BuilderButton
              variant="secondary"
              type="button"
              onClick={() =>
                appendExperience({
                  id: createId(),
                  company: "",
                  role: "",
                  location: "",
                  startDate: "",
                  endDate: "",
                  isCurrent: false,
                  description: "",
                  achievements: [""],
                  technologies: [],
                })
              }
            >
              <Plus size={14} aria-hidden="true" /> Add role
            </BuilderButton>
          </div>
          {experienceFields.length === 0 ? (
            <p className="text-sm text-[var(--color-grey)] mb-4">
              No roles yet. Add your work history, or continue without it.
            </p>
          ) : null}
          <div className="space-y-6">
            {experienceFields.map((field, index) => {
              const isCurrent = watch(`experience.${index}.isCurrent`);
              return (
                <div key={field.id} className="builder-card">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      label="Company"
                      htmlFor={`company-${index}`}
                      error={errors.experience?.[index]?.company?.message}
                    >
                      <FormInput
                        id={`company-${index}`}
                        {...register(`experience.${index}.company`)}
                      />
                    </FormField>
                    <FormField
                      label="Role"
                      htmlFor={`role-${index}`}
                      error={errors.experience?.[index]?.role?.message}
                    >
                      <FormInput
                        id={`role-${index}`}
                        {...register(`experience.${index}.role`)}
                      />
                    </FormField>
                    <FormField label="Start date" htmlFor={`start-${index}`}>
                      <MonthYearPicker
                        id={`start-${index}`}
                        value={watch(`experience.${index}.startDate`) || ""}
                        onChange={(value) =>
                          setValue(`experience.${index}.startDate`, value)
                        }
                      />
                      <input type="hidden" {...register(`experience.${index}.startDate`)} />
                    </FormField>
                    <FormField label="End date" htmlFor={`end-${index}`}>
                      <MonthYearPicker
                        id={`end-${index}`}
                        value={
                          isCurrent
                            ? ""
                            : watch(`experience.${index}.endDate`) || ""
                        }
                        onChange={(value) =>
                          setValue(`experience.${index}.endDate`, value)
                        }
                        disabled={isCurrent}
                      />
                      <label className="mt-2 flex items-center gap-2 text-sm text-[var(--color-grey)]">
                        <input
                          type="checkbox"
                          {...register(`experience.${index}.isCurrent`)}
                          onChange={(e) => {
                            setValue(`experience.${index}.isCurrent`, e.target.checked);
                            if (e.target.checked) {
                              setValue(`experience.${index}.endDate`, "Present");
                            }
                          }}
                        />
                        Current role
                      </label>
                      <input type="hidden" {...register(`experience.${index}.endDate`)} />
                    </FormField>
                  </div>
                  <FormField
                    label="Key achievements"
                    htmlFor={`achievements-${index}`}
                    hint="One achievement per line."
                  >
                    <FormTextarea
                      id={`achievements-${index}`}
                      rows={3}
                      value={(watch(`experience.${index}.achievements`) || []).join("\n")}
                      onChange={(e) =>
                        setValue(
                          `experience.${index}.achievements`,
                          e.target.value.split("\n").filter(Boolean)
                        )
                      }
                    />
                  </FormField>
                  <input type="hidden" {...register(`experience.${index}.id`)} />
                  <BuilderButton
                    variant="ghost"
                    type="button"
                    onClick={() => removeExperience(index)}
                  >
                    <Trash2 size={14} aria-hidden="true" /> Remove
                  </BuilderButton>
                </div>
              );
            })}
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="builder-section-title mb-0">Education</h2>
            <BuilderButton
              variant="secondary"
              type="button"
              onClick={() =>
                appendEducation({
                  id: createId(),
                  institution: "",
                  qualification: "",
                  fieldOfStudy: "",
                  startDate: "",
                  endDate: "",
                  location: "",
                  description: "",
                })
              }
            >
              <Plus size={14} aria-hidden="true" /> Add education
            </BuilderButton>
          </div>
          {educationFields.map((field, index) => (
            <div key={field.id} className="builder-card mb-4">
              <div className="grid md:grid-cols-2 gap-4">
                <FormField label="Institution" htmlFor={`institution-${index}`}>
                  <FormInput
                    id={`institution-${index}`}
                    {...register(`education.${index}.institution`)}
                  />
                </FormField>
                <FormField label="Qualification" htmlFor={`qualification-${index}`}>
                  <FormInput
                    id={`qualification-${index}`}
                    {...register(`education.${index}.qualification`)}
                  />
                </FormField>
                <FormField label="Start date" htmlFor={`edu-start-${index}`}>
                  <MonthYearPicker
                    id={`edu-start-${index}`}
                    value={watch(`education.${index}.startDate`) || ""}
                    onChange={(value) =>
                      setValue(`education.${index}.startDate`, value)
                    }
                  />
                  <input type="hidden" {...register(`education.${index}.startDate`)} />
                </FormField>
                <FormField label="End date" htmlFor={`edu-end-${index}`}>
                  <MonthYearPicker
                    id={`edu-end-${index}`}
                    value={watch(`education.${index}.endDate`) || ""}
                    onChange={(value) =>
                      setValue(`education.${index}.endDate`, value)
                    }
                  />
                  <input type="hidden" {...register(`education.${index}.endDate`)} />
                </FormField>
              </div>
              <input type="hidden" {...register(`education.${index}.id`)} />
              <BuilderButton
                variant="ghost"
                type="button"
                onClick={() => removeEducation(index)}
              >
                <Trash2 size={14} aria-hidden="true" /> Remove
              </BuilderButton>
            </div>
          ))}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="builder-section-title mb-0">Projects</h2>
            <BuilderButton
              variant="secondary"
              type="button"
              onClick={() =>
                appendProject({
                  id: createId(),
                  name: "",
                  role: "",
                  description: "",
                  technologies: [],
                  url: "",
                })
              }
            >
              <Plus size={14} aria-hidden="true" /> Add project
            </BuilderButton>
          </div>
          {projectFields.map((field, index) => (
            <div key={field.id} className="builder-card mb-4">
              <FormField label="Project name" htmlFor={`project-name-${index}`}>
                <FormInput
                  id={`project-name-${index}`}
                  {...register(`projects.${index}.name`)}
                />
              </FormField>
              <FormField label="Description" htmlFor={`project-desc-${index}`}>
                <FormTextarea
                  id={`project-desc-${index}`}
                  rows={3}
                  {...register(`projects.${index}.description`)}
                />
              </FormField>
              <input type="hidden" {...register(`projects.${index}.id`)} />
              <BuilderButton
                variant="ghost"
                type="button"
                onClick={() => removeProject(index)}
              >
                <Trash2 size={14} aria-hidden="true" /> Remove
              </BuilderButton>
            </div>
          ))}
        </section>

        <div className="flex justify-end">
          <BuilderButton type="submit" variant="primary">
            Continue to job details
          </BuilderButton>
        </div>
      </form>
    </div>
  );
}
