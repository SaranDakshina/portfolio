interface SectionLabelProps {
  index: string;
  label: string;
  dark?: boolean;
}

export default function SectionLabel({ index, label, dark = false }: SectionLabelProps) {
  return (
    <div className="flex items-center gap-4 mb-6 md:mb-10">
      <span className={dark ? "label-caps-dark" : "label-caps"}>{index}</span>
      <div className={`flex-1 h-px ${dark ? "bg-[var(--color-void-border)]" : "bg-[var(--color-grey-border)]"}`} />
      <span className={dark ? "label-caps-dark" : "label-caps"}>{label}</span>
    </div>
  );
}
