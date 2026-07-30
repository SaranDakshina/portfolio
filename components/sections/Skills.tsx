import SectionLabel from "@/components/ui/SectionLabel";
import SkillsPlaygroundLoader from "@/components/ui/SkillsPlaygroundLoader";
import StackIcon from "tech-stack-icons";
import { physicsIcons } from "@/lib/icons";

export function SkillsStaticGrid() {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-8">
      {physicsIcons.map((icon) => (
        <div key={icon.id} className="flex flex-col items-center gap-2">
          <div className="w-10 h-10 icon-bare">
            <StackIcon name={icon.icon} variant="light" className="w-full h-full" />
          </div>
          <span className="text-xs text-[var(--color-grey)] text-center">{icon.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function Skills() {
  return (
    <section id="skills" className="relative section-pad bg-[var(--color-canvas)] overflow-hidden">
      <span className="ghost-number" aria-hidden="true">03</span>
      <div className="container-content">
        <SectionLabel index="03" label="Skills" />

        <div className="mb-6 md:mb-10">
          <h2 className="display-lg max-w-[20ch] mb-4">
            The tools of the{" "}
            <em className="not-italic text-[var(--color-accent)]">trade.</em>
          </h2>
          <p className="text-[var(--color-grey)] max-w-[44ch]">
            Drag and throw them around — adjust gravity and see what happens.
          </p>
        </div>

        <SkillsPlaygroundLoader />
      </div>
    </section>
  );
}
