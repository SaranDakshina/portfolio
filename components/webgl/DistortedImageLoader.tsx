"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { assetPath } from "@/lib/asset-path";

const DistortedImage = dynamic(() => import("@/components/webgl/DistortedImage"), {
  ssr: false,
  loading: () => <div className="h-full w-full animate-pulse bg-transparent" />,
});

interface DistortedImageLoaderProps {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  aspectClass?: string;
  objectFit?: "cover" | "contain" | "height";
  imageWidth?: number;
  imageHeight?: number;
}

export default function DistortedImageLoader(props: DistortedImageLoaderProps) {
  return <DistortedImage {...props} />;
}

export function DistortedImageFallback({
  src,
  alt,
  className = "",
  sizes = "100vw",
  priority = false,
  aspectClass = "aspect-[4/3]",
  objectFit = "cover",
  imageWidth,
  imageHeight,
}: DistortedImageLoaderProps) {
  const resolvedSrc = assetPath(src);
  const isHeightFit = objectFit === "height";
  const heightFitImageClass = "block h-full w-auto max-w-none";

  if (isHeightFit) {
    return (
      <div
        className={`relative h-full w-auto max-w-none overflow-visible bg-transparent ${className}`}
      >
        {imageWidth && imageHeight ? (
          <Image
            src={resolvedSrc}
            alt={alt}
            width={imageWidth}
            height={imageHeight}
            priority={priority}
            className={heightFitImageClass}
            sizes={sizes}
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={resolvedSrc} alt={alt} className={heightFitImageClass} />
        )}
      </div>
    );
  }

  const imageClass = objectFit === "contain" ? "object-contain" : "object-cover";
  const containerBg =
    objectFit === "contain" ? "bg-transparent" : "bg-[var(--color-void-surface)]";

  return (
    <div className={`relative overflow-hidden ${containerBg} ${aspectClass} ${className}`}>
      <Image src={resolvedSrc} alt={alt} fill priority={priority} className={imageClass} sizes={sizes} />
    </div>
  );
}
