import SectionLabel from "@/components/ui/SectionLabel";

const experiences = [
  {
    period: "Sep 2025 — Present",
    role: "Full Stack Web Developer",
    company: "Click Suite · New Zealand (Hybrid)",
    context:
      "Modern web, desktop, and interactive experiences for cultural and community organisations.",
    responsibilities: [
      "Visa WOAP festival platform — Next.js, GraphQL, DatoCMS, physics-driven homepage",
      "Te Matāpihi library installation — React, Electron, headless CMS, production deployment",
      "Tetihi community platform — React, Laravel, Docker across frontend and backend",
    ],
    stack: [
      "Next.js",
      "React",
      "TypeScript",
      "GraphQL",
      "DatoCMS",
      "Electron",
      "Laravel",
      "GSAP",
      "Matter.js",
    ],
  },
  {
    period: "Jan — Aug 2025",
    role: "UI Developer",
    company: "Pulsebay · Auckland, New Zealand",
    context: "Responsive interfaces built in close collaboration with UX and design.",
    responsibilities: [
      "Translated Figma prototypes into production-ready React interfaces",
      "Improved usability, accessibility, and cross-device performance",
    ],
    stack: ["React", "JavaScript", "HTML", "CSS"],
  },
  {
    period: "Jul 2023 — Oct 2024",
    role: "Web Developer",
    company: "Pat Falvey · Ireland",
    context: "Internal platforms and customer-facing tools for travel operations.",
    responsibilities: [
      "High-performance communication platform in React and TypeScript",
      "Booking and onboarding workflows — 30% reduction in lead drop-off",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS", "REST APIs"],
  },
  {
    period: "Aug 2022 — May 2023",
    role: "UX Designer",
    company: "AXA · Dublin, Ireland",
    context: "Research-driven product improvements for insurance digital experiences.",
    responsibilities: [
      "Usability testing, design sprints, and stakeholder workshops",
      "Interactive Figma prototypes tied to customer insights and KPIs",
    ],
    stack: ["Figma", "UX Research", "Design Systems"],
  },
  {
    period: "2017 — 2020",
    role: "Web UI Developer",
    company: "The Hustle · Purpose Driven Humans · New Zealand",
    context:
      "SaaS and client websites across government, retail, hospitality, and property.",
    responsibilities: [
      "Cedar Insight debt management platform — React, TypeScript dashboards and CRUD modules",
      "Delivered client sites and improved IA for councils, retail, and sports brands",
    ],
    stack: ["React", "TypeScript", "REST APIs", "Figma"],
  },
  {
    period: "2016 — 2017",
    role: "UI Developer",
    company: "Pixelhen · Bengaluru, India",
    context: "Recruitment and booking platforms for stakeholder-led delivery.",
    responsibilities: [
      "Zipgigz talent-as-a-service dashboard",
      "Booking systems and reusable React/TypeScript component libraries",
    ],
    stack: ["React", "TypeScript", "Tailwind CSS"],
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative section-pad overflow-hidden"
    >
      <span className="ghost-number" aria-hidden="true">02</span>
      <div className="container-content">
        <SectionLabel index="02" label="Experience" />

        <div className="mb-6 md:mb-14">
          <h2 className="display-xl max-w-[18ch]">
            Years of craft, one{" "}
            <em className="not-italic text-[var(--color-accent)]">thread.</em>
          </h2>
        </div>

        <ExperienceDivider />
        <div className="flex flex-col">
          {experiences.map((exp, i) => (
            <div key={i}>
              {i > 0 && <ExperienceDivider />}
              <ExperienceBlock exp={exp} />
              <div className="h-8 shrink-0" aria-hidden="true" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ExperienceDivider() {
  return (
    <div className="py-[0.8rem] md:py-8">
      <div className="border-t border-[var(--color-grey-border)]" />
    </div>
  );
}

function ExperienceBlock({ exp }: { exp: (typeof experiences)[0] }) {
  return (
    <div className="grid md:grid-cols-[200px_1fr] gap-6 md:gap-16 pt-[0.8rem] md:pt-[1.5rem] md:items-start">
      {/* Period */}
      <div className="space-y-1">
        <p className="label-caps text-[var(--color-ink)]">{exp.period}</p>
      </div>

      {/* Content */}
      <div className="space-y-[0.8rem] md:space-y-[1rem]">
        <div>
          <h3 className="text-xl md:text-2xl font-medium tracking-tight mb-1">
            {exp.role}
          </h3>
          <p className="label-caps text-[var(--color-grey)]">{exp.company}</p>
        </div>

        <p className="text-[var(--color-grey)] leading-relaxed">{exp.context}</p>

        <ul className="space-y-2">
          {exp.responsibilities.map((r, i) => (
            <li key={i} className="flex items-start gap-3 text-[var(--color-ink-soft)]">
              <span className="mt-2 w-1 h-1 rounded-full bg-[var(--color-accent)] flex-shrink-0" />
              {r}
            </li>
          ))}
        </ul>

        <div className="flex flex-wrap gap-2 pt-2">
          {exp.stack.map((tech) => (
            <span
              key={tech}
              className="text-xs px-2.5 py-1 border border-[var(--color-grey-border)] text-[var(--color-grey)] rounded-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
