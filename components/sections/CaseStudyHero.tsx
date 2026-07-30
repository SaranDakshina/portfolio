"use client";

import GalleryVideo from "@/components/ui/GalleryVideo";
import HeightFitImage from "@/components/ui/HeightFitImage";
import type { Project } from "@/lib/projects";

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

export default function CaseStudyHero({ project }: { project: Project }) {
  const aspectRatio = aspectRatioFromProject(project);

  return (
    <>
      <div className="container-content mb-12 relative z-10">
        <div className="flex flex-wrap gap-4 mb-6">
          <span className="label-caps">{project.year}</span>
          <span className="label-caps text-[var(--color-grey-light)]">/</span>
          <span className="label-caps">{project.role}</span>
        </div>
        <h1 className="display-xl max-w-[22ch] mb-6">{project.name}</h1>
        <p className="text-xl md:text-2xl text-[var(--color-grey)] max-w-[52ch] leading-relaxed">
          {project.impact}
        </p>
      </div>

      <div className="container-content mb-16 relative z-10">
        {isVideoSrc(project.image) ? (
          <GalleryVideo
            src={project.image}
            poster={posterForVideo(project.image, project.imagePoster)}
            alt={project.imageAlt}
            aspectClass="aspect-[16/7]"
            aspectRatio={aspectRatio}
          />
        ) : (
          <HeightFitImage
            src={project.image}
            alt={project.imageAlt}
            aspectClass="aspect-[16/7]"
            aspectRatio={aspectRatio}
            imageWidth={project.imageWidth}
            imageHeight={project.imageHeight}
            sizes="(max-width: 768px) 100vw, 1152px"
            priority
          />
        )}
      </div>
    </>
  );
}
