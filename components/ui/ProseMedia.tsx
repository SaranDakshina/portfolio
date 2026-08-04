"use client";

import HeightFitImage from "@/components/ui/HeightFitImage";
import GalleryVideo from "@/components/ui/GalleryVideo";
import { assetPath } from "@/lib/asset-path";
import { getProseVideoFilter, parseProseMediaAlt } from "@/lib/prose-media";

interface ProseMediaProps {
  src: string;
  alt: string;
}

function isVideoSrc(src: string) {
  return /\.(mp4|webm)$/i.test(src);
}

function posterForVideo(src: string) {
  return src.replace(/\.(mp4|webm)$/i, "-poster.jpg");
}

function aspectClassFromRatio(aspectRatio?: string) {
  if (!aspectRatio) return "aspect-[16/10]";
  return `aspect-[${aspectRatio}]`;
}

function cssAspectRatio(aspectRatio?: string) {
  if (!aspectRatio) return undefined;
  const [width, height] = aspectRatio.split("/");
  return `${width} / ${height}`;
}

const PORTRAIT_MAX_WIDTH_PX = 240;

export default function ProseMedia({ src, alt }: ProseMediaProps) {
  const { caption, aspectRatio } = parseProseMediaAlt(alt);
  const aspectClass = aspectClassFromRatio(aspectRatio);
  const ratio = cssAspectRatio(aspectRatio);
  const [width, height] = aspectRatio?.split("/").map(Number) ?? [];
  const isSquare = aspectRatio === "1/1";
  const isPortrait = Boolean(aspectRatio && width > 0 && height > width);
  const hasRealDimensions = width >= 100 && height >= 100;
  const videoFilter = getProseVideoFilter(src);
  const resolvedSrc = assetPath(src);
  const resolvedPoster = assetPath(posterForVideo(src));

  const figureClass = [
    "prose-media",
    "prose-media--full",
    isSquare ? "prose-media--square" : "",
    isPortrait ? "prose-media--portrait" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure
      className={figureClass}
      style={
        isPortrait
          ? { width: "100%", maxWidth: PORTRAIT_MAX_WIDTH_PX, marginInline: "auto" }
          : undefined
      }
    >
      {isVideoSrc(src) ? (
        <GalleryVideo
          src={resolvedSrc}
          poster={resolvedPoster}
          alt={caption}
          aspectClass={isSquare ? "" : aspectClass}
          aspectRatio={isSquare ? undefined : ratio}
          videoFilter={videoFilter}
        />
      ) : (
        <HeightFitImage
          src={resolvedSrc}
          alt={caption}
          aspectClass={isSquare ? "" : aspectClass}
          aspectRatio={isSquare ? undefined : ratio}
          imageWidth={hasRealDimensions ? width : undefined}
          imageHeight={hasRealDimensions ? height : undefined}
          objectFit="contain"
          sizes={
            isPortrait
              ? `(max-width: 768px) 80vw, ${PORTRAIT_MAX_WIDTH_PX}px`
              : "(max-width: 768px) 100vw, 1152px"
          }
        />
      )}
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  );
}
