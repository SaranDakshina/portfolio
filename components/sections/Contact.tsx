import SectionLabel from "@/components/ui/SectionLabel";
import MagneticButton from "@/components/ui/MagneticButton";
import { assetPath } from "@/lib/asset-path";

export default function Contact() {
  return (
    <section id="contact" className="relative section-pad overflow-hidden">
      <span className="ghost-number" aria-hidden="true">05</span>
      <div className="container-content">
        <SectionLabel index="05" label="Contact" />

        <div className="grid md:grid-cols-2 gap-12 items-end">
          {/* CTA */}
          <div>
            <h2 className="display-xl max-w-[14ch] mb-8">
              Have a story worth{" "}
              <em className="not-italic text-[var(--color-accent)]">building?</em>
            </h2>
            <p className="text-lg text-[var(--color-grey)] leading-relaxed max-w-[40ch] mb-8">
              Let&apos;s create something memorable.
            </p>
            <MagneticButton href="mailto:saran56vijay@gmail.com" variant="primary">
              Start a conversation
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

          {/* Links */}
          <div className="space-y-0">
            <ContactRow
              label="Email"
              value="saran56vijay@gmail.com"
              href="mailto:saran56vijay@gmail.com"
            />
            <ContactRow
              label="LinkedIn"
              value="linkedin.com/in/saran24"
              href="https://www.linkedin.com/in/saran24/"
              external
            />
            <ContactRow
              label="GitHub"
              value="github.com/SaranDakshina"
              href="https://github.com/SaranDakshina"
              external
            />
            <div className="border-t border-[var(--color-grey-border)] py-6">
              <a
                href={assetPath("/resume.pdf")}
                className="inline-flex items-center gap-3 label-caps text-[var(--color-grey)] hover:text-[var(--color-ink)] transition-colors duration-200"
              >
                Download résumé
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                  <path
                    d="M7 1v9M3 7l4 4 4-4M2 12h10"
                    stroke="currentColor"
                    strokeWidth="1.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactRow({
  label,
  value,
  href,
  external = false,
}: {
  label: string;
  value: string;
  href: string;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center justify-between py-5 border-t border-[var(--color-grey-border)] hover:text-[var(--color-accent)] transition-colors duration-200"
    >
      <span className="label-caps text-[var(--color-grey)] group-hover:text-[var(--color-accent)]">
        {label}
      </span>
      <div className="flex items-center gap-3">
        <span className="text-base">{value}</span>
        {external && (
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
            <path
              d="M2 10L10 2M10 2H4M10 2v6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        )}
      </div>
    </a>
  );
}
