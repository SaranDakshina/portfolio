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
            <h2 className="display-lg max-w-[18ch]">
              Full stack developer. Creative technologist. Storyteller.{" "}
              <em className="not-italic text-[var(--color-accent)]">
                In that order.
              </em>
            </h2>
          </div>

          {/* Story */}
          <div className="space-y-6 text-[var(--color-ink-soft)] leading-relaxed">
            <p>
              I build software end to end for production conditions — web
              applications in React and Next.js, headless CMS architectures and
              API integrations, and interactive experiences packaged for
              deployment on dedicated hardware in public spaces.
            </p>
            <p>
              That means caring about what happens under load: traffic spikes
              during festival openings, always-on kiosk reliability, and content
              models editors can maintain without a developer in the loop. The
              goal is software that performs cleanly and stays maintainable long
              after launch.
            </p>
            <p>
              I work across web, installation, and film — festival platforms
              built for real traffic spikes, CMS-driven touch experiences in
              libraries and museums, and long-form editorial narratives that hold
              attention the way good journalism does.
            </p>
            <p>
              Based in Wellington, Aotearoa — a city that punches well above its
              weight in creative output, and has made me believe small teams with
              high standards can do genuinely memorable work.
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
