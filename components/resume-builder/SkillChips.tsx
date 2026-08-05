"use client";

import { useState } from "react";
import { FormInput } from "@/components/resume-builder/FormFields";
import { X } from "lucide-react";

interface SkillChipsProps {
  skills: string[];
  suggestions?: string[];
  onChange: (skills: string[]) => void;
}

export default function SkillChips({
  skills,
  suggestions = [],
  onChange,
}: SkillChipsProps) {
  const [draft, setDraft] = useState("");

  const toggle = (skill: string) => {
    if (skills.includes(skill)) {
      onChange(skills.filter((s) => s !== skill));
    } else {
      onChange([...skills, skill]);
    }
  };

  const addCustom = () => {
    const value = draft.trim();
    if (!value) return;
    if (!skills.includes(value)) {
      onChange([...skills, value]);
    }
    setDraft("");
  };

  const unusedSuggestions = suggestions.filter((s) => !skills.includes(s));

  return (
    <div className="builder-skills">
      {skills.length > 0 ? (
        <ul className="builder-skills__list" aria-label="Selected skills">
          {skills.map((skill) => (
            <li key={skill}>
              <button
                type="button"
                className="builder-chip builder-chip--active"
                onClick={() => toggle(skill)}
              >
                {skill}
                <X size={12} aria-hidden="true" />
                <span className="sr-only">Remove {skill}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      {unusedSuggestions.length > 0 ? (
        <div className="mt-3">
          <p className="label-caps text-xs text-[var(--color-grey)] mb-2">
            Suggested skills
          </p>
          <ul className="builder-skills__list">
            {unusedSuggestions.map((skill) => (
              <li key={skill}>
                <button
                  type="button"
                  className="builder-chip"
                  onClick={() => toggle(skill)}
                >
                  {skill}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <div className="flex gap-2 mt-3">
        <FormInput
          id="custom-skill"
          placeholder="Add a skill"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addCustom();
            }
          }}
        />
        <button
          type="button"
          className="builder-btn builder-btn--secondary shrink-0"
          onClick={addCustom}
        >
          Add
        </button>
      </div>
    </div>
  );
}
