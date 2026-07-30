import { notFound } from "next/navigation";
import TransitionLink from "@/components/ui/TransitionLink";
import { getProject, projects } from "@/lib/projects";
import { getCaseStudy } from "@/lib/mdx";
import CaseStudyHero from "@/components/sections/CaseStudyHero";
import CaseStudyGallery from "@/components/sections/CaseStudyGallery";
import CaseStudyLiveCta from "@/components/sections/CaseStudyLiveCta";
import NextProjectCta from "@/components/sections/NextProjectCta";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};
  return {
    title: `${project.name} — Saran`,
    description: project.impact,
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) notFound();

  const caseStudy = await getCaseStudy(slug);

  return (
    <article className="page-top page-bottom relative">
      <div className="container-content mb-10 relative z-10">
        <TransitionLink
          href="/#work"
          className="inline-flex items-center gap-2 label-caps text-[var(--color-grey)] hover:text-[var(--color-ink)] transition-colors"
          data-cursor
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
            <path
              d="M13 7H1M6.5 1.5L1 7l5.5 5.5"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          Back to work
        </TransitionLink>
      </div>

      <CaseStudyHero project={project} />

      <div className="container-content mb-16 relative z-10">
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tech) => (
            <span
              key={tech}
              className="text-sm px-3 py-1.5 border border-[var(--color-grey-border)] text-[var(--color-grey)] rounded-sm"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {!["woap", "te-matapihi", "tell-your-story"].includes(project.slug) && (
        <CaseStudyGallery slug={project.slug} />
      )}

      <div className="container-content relative z-10">
        <div className="prose-styles w-full">{caseStudy}</div>
      </div>

      {project.liveUrl && <CaseStudyLiveCta project={project} />}

      <div className="container-content mt-24 border-t border-[var(--color-grey-border)] pt-12 relative z-10">
        <NextProjectCta currentSlug={slug} />
      </div>
    </article>
  );
}
