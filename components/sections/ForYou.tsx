import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";

export default function ForYou() {
  return (
    <section
      id="for-you"
      className="relative section-pad overflow-hidden bg-[var(--color-canvas)]"
    >
      <span className="ghost-number" aria-hidden="true">
        06
      </span>
      <div className="container-content">
        <SectionLabel index="06" label="For you" />

        <div className="max-w-[52ch] mx-auto text-center">
          <h2 className="display-xl max-w-[14ch] mx-auto mb-8">
            This is for{" "}
            <em className="not-italic text-[var(--color-accent)]">you.</em>
          </h2>
          <p className="text-lg text-[var(--color-grey)] leading-relaxed mb-8">
            For the community of job seekers — use this résumé and cover letter
            builder to make your job search easier.
          </p>
          <MagneticButton href="/tools/resume-builder/" variant="primary">
            Build résumé & cover letter
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                d="M1 7h12M7.5 1.5L13 7l-5.5 5.5"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </MagneticButton>
        </div>
      </div>
    </section>
  );
}
