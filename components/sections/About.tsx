import SectionLabel from "@/components/ui/SectionLabel";

export default function About() {
  return (
    <section id="about" className="relative section-pad bg-[var(--color-canvas)] overflow-hidden">
      <span className="ghost-number" aria-hidden="true">04</span>
      <div className="container-content">
        <SectionLabel index="04" label="About" />

        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-start">
          {/* Headline */}
          <div>
            <h2 className="display-lg max-w-[20ch]">
              Full stack developer and creative technologist.
            </h2>
          </div>

          {/* Story */}
          <div className="space-y-6 text-[var(--color-ink-soft)] leading-relaxed">
            <p>
              I build software end to end for production — React and Next.js
              apps, headless CMS architectures, and interactive experiences for
              public spaces. That means caring about traffic spikes, always-on
              reliability, and content models editors can maintain without a
              developer in the loop.
            </p>
            <p>
              I work across web, installation, and film — festival platforms,
              CMS-driven touch experiences, and long-form editorial narratives.
              Based in New Zealand, where small teams with high standards do
              genuinely memorable work.
            </p>

            <div className="pt-4 border-t border-[var(--color-grey-border)]">
              <p className="label-caps mb-3">Currently</p>
              <p>
                Available for selected freelance and contract engagements.
                Particularly interested in cultural institutions, festival and
                event platforms, editorial products, and technically ambitious
                interactive work in public spaces.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
