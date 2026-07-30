import Link from "next/link";
import SectionLabel from "@/components/ui/SectionLabel";
import ProjectParallaxBlock from "@/components/sections/ProjectParallaxBlock";
import DarkSpaceBackground from "@/components/ui/DarkSpaceBackground";
import { projects } from "@/lib/projects";

export default function FeaturedWork() {
  return (
    <section
      id="work"
      className="relative bg-[var(--color-void)] text-[var(--color-void-text)] section-pad overflow-hidden"
    >
      <DarkSpaceBackground />
      <div className="grain-overlay grain-overlay--dark" aria-hidden="true" />

      <div className="container-content relative z-10">
        <SectionLabel index="01" label="Featured Work" dark />

        <div className="mb-6 md:mb-14">
          <h2 className="display-xl text-[var(--color-void-text)] max-w-[20ch]">
            Four projects. Four{" "}
            <em className="not-italic text-[var(--color-accent)]">stories.</em>
          </h2>
        </div>

        <div className="space-y-0">
          {projects.map((project, i) => (
            <ProjectParallaxBlock key={project.slug} project={project} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
