"use client";

import HeightFitImage from "@/components/ui/HeightFitImage";
import GalleryVideo from "@/components/ui/GalleryVideo";
import StackedImagePeel from "@/components/ui/StackedImagePeel";
import TransitionLink from "@/components/ui/TransitionLink";
import type { Project } from "@/lib/projects";
import { useEffect, useRef } from "react";

function isVideoSrc(src: string) {
  return /\.(mp4|webm)$/i.test(src);
}

function posterForVideo(src: string, poster?: string) {
  return poster ?? src.replace(/\.(mp4|webm)$/i, "-poster.jpg");
}

function aspectRatioFromProject(project: Project) {
  if (project.imageWidth && project.imageHeight) {
    return `${project.imageWidth} / ${project.imageHeight}`;
  }
  return undefined;
}

export default function ProjectParallaxBlock({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const articleRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const reversed = index % 2 === 1;

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let trigger: import("gsap/ScrollTrigger").ScrollTrigger | null = null;

    async function init() {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");
      gsap.registerPlugin(ScrollTrigger);

      if (!imageRef.current || !articleRef.current) return;

      trigger = ScrollTrigger.create({
        trigger: articleRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true,
        onUpdate: (self) => {
          if (imageRef.current) {
            const y = (self.progress - 0.5) * 40;
            imageRef.current.style.transform = `translateY(${y}px)`;
          }
        },
      });
    }

    init();
    return () => trigger?.kill();
  }, []);

  return (
    <article
      ref={articleRef}
      className="group relative border-t border-[var(--color-void-border)] py-16 md:py-24"
    >
      <span
        className="ghost-number ghost-number--dark"
        aria-hidden="true"
      >
        {String(index + 1).padStart(2, "0")}
      </span>

      <TransitionLink href={`/work/${project.slug}`} className="block relative z-10" data-cursor>
        <div
          className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
            reversed ? "lg:[&>*:first-child]:order-2" : ""
          }`}
        >
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-6">
              <span className="label-caps-dark">{String(index + 1).padStart(2, "0")}</span>
              <span className="label-caps-dark">{project.year}</span>
              <span className="label-caps-dark">{project.role}</span>
            </div>

            <h3 className="display-md text-[var(--color-void-text)] group-hover:text-[var(--color-accent)] transition-colors duration-300">
              {project.name}
            </h3>

            <p className="text-[var(--color-void-muted)] text-lg leading-relaxed max-w-[52ch]">
              {project.impact}
            </p>

            <div className="flex flex-wrap gap-2 pt-2">
              {project.stack.slice(0, 5).map((tech) => (
                <span
                  key={tech}
                  className="text-xs px-2.5 py-1 border border-[var(--color-void-border)] text-[var(--color-void-muted)] rounded-sm"
                >
                  {tech}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 text-[var(--color-accent)] label-caps group-hover:gap-4 transition-all duration-300">
              Read case study
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M1 7h12M7.5 1.5L13 7l-5.5 5.5"
                  stroke="currentColor"
                  strokeWidth="1.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
          </div>

          <div ref={imageRef} className="min-w-0 w-full will-change-transform">
            {project.inlineImages?.length ? (
              <StackedImagePeel
                images={project.inlineImages}
                alt={project.imageAlt}
                variant="thumb"
                aspectRatio={aspectRatioFromProject(project)}
              />
            ) : isVideoSrc(project.image) ? (
              <GalleryVideo
                src={project.image}
                poster={posterForVideo(project.image, project.imagePoster)}
                alt={project.imageAlt}
                aspectClass="aspect-[4/3]"
                aspectRatio={aspectRatioFromProject(project)}
              />
            ) : (
              <HeightFitImage
                src={project.image}
                alt={project.imageAlt}
                aspectClass="aspect-[4/3]"
                aspectRatio={aspectRatioFromProject(project)}
                imageWidth={project.imageWidth}
                imageHeight={project.imageHeight}
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            )}
          </div>
        </div>
      </TransitionLink>
    </article>
  );
}
