"use client";

import { DistortedImageFallback } from "@/components/webgl/DistortedImageLoader";

interface HeightFitImageProps {
  src: string;
  alt: string;
  aspectClass: string;
  aspectRatio?: string;
  imageWidth?: number;
  imageHeight?: number;
  sizes?: string;
  priority?: boolean;
  objectFit?: "cover" | "contain" | "height";
}

export default function HeightFitImage({
  src,
  alt,
  aspectClass,
  aspectRatio,
  imageWidth,
  imageHeight,
  sizes = "100vw",
  priority = false,
  objectFit = "height",
}: HeightFitImageProps) {
  const isContain = objectFit === "contain";

  return (
    <div
      className={`relative w-full overflow-hidden ${aspectRatio ? "" : aspectClass}`}
      style={aspectRatio ? { aspectRatio } : undefined}
    >
      {isContain ? (
        <div className="absolute inset-0 flex items-center justify-center">
          <DistortedImageFallback
            src={src}
            alt={alt}
            objectFit="contain"
            aspectClass="h-full w-full"
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            sizes={sizes}
            priority={priority}
          />
        </div>
      ) : (
        <div className="absolute inset-y-0 left-1/2 h-full w-max max-w-none -translate-x-1/2">
          <DistortedImageFallback
            src={src}
            alt={alt}
            objectFit={objectFit}
            imageWidth={imageWidth}
            imageHeight={imageHeight}
            sizes={sizes}
            priority={priority}
          />
        </div>
      )}
    </div>
  );
}
