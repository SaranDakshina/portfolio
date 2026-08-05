"use client";

import { FormSelect } from "@/components/resume-builder/FormFields";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
] as const;

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => String(currentYear - i));

function parseMonthYear(value: string): { month: string; year: string } {
  const trimmed = value.trim();
  if (!trimmed || trimmed.toLowerCase() === "present") {
    return { month: "", year: "" };
  }

  const parts = trimmed.split(/\s+/);
  if (parts.length >= 2) {
    const month = MONTHS.find(
      (m) => m.toLowerCase() === parts[0].slice(0, 3).toLowerCase()
    );
    const year = parts[1].match(/^\d{4}$/) ? parts[1] : "";
    return { month: month || "", year };
  }

  if (/^\d{4}$/.test(trimmed)) {
    return { month: "", year: trimmed };
  }

  return { month: "", year: "" };
}

function formatMonthYear(month: string, year: string): string {
  if (!month && !year) return "";
  if (!month) return year;
  if (!year) return month;
  return `${month} ${year}`;
}

interface MonthYearPickerProps {
  id: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  allowEmpty?: boolean;
}

export default function MonthYearPicker({
  id,
  value,
  onChange,
  disabled = false,
  allowEmpty = true,
}: MonthYearPickerProps) {
  const { month, year } = parseMonthYear(value);

  return (
    <div className="builder-month-year flex gap-2">
      <FormSelect
        id={`${id}-month`}
        aria-label="Month"
        value={month}
        disabled={disabled}
        onChange={(e) => onChange(formatMonthYear(e.target.value, year))}
      >
        {allowEmpty ? <option value="">Month</option> : null}
        {MONTHS.map((m) => (
          <option key={m} value={m}>
            {m}
          </option>
        ))}
      </FormSelect>
      <FormSelect
        id={`${id}-year`}
        aria-label="Year"
        value={year}
        disabled={disabled}
        onChange={(e) => onChange(formatMonthYear(month, e.target.value))}
      >
        {allowEmpty ? <option value="">Year</option> : null}
        {YEARS.map((y) => (
          <option key={y} value={y}>
            {y}
          </option>
        ))}
      </FormSelect>
    </div>
  );
}
