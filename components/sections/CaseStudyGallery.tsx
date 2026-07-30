import HeightFitImage from "@/components/ui/HeightFitImage";
import GalleryVideo from "@/components/ui/GalleryVideo";

interface GalleryImage {
  type: "image" | "video";
  src: string;
  alt: string;
  poster?: string;
  aspectClass: string;
}

interface CaseStudyGalleryProps {
  slug: string;
}

const galleryBySlug: Record<string, GalleryImage[]> = {
  woap: [
    {
      type: "video",
      src: "/projects/woap/woap-home.mp4",
      poster: "/projects/woap/woap-interaction-poster.jpg",
      alt: "WOAP interactive homepage with physics-based elements",
      aspectClass: "aspect-[1920/1112]",
    },
    {
      type: "image",
      src: "/projects/woap/woap-map.jpg",
      alt: "WOAP event discovery map with searchable listings",
      aspectClass: "aspect-[3/4] md:aspect-[4/5]",
    },
  ],
};

function defaultGallery(slug: string): GalleryImage[] {
  return [
    {
      type: "image",
      src: `/projects/${slug}-detail-1.svg`,
      alt: "Project detail view 1",
      aspectClass: "aspect-[4/3]",
    },
    {
      type: "image",
      src: `/projects/${slug}-detail-2.svg`,
      alt: "Project detail view 2",
      aspectClass: "aspect-[3/4] md:aspect-[4/5]",
    },
  ];
}

export default function CaseStudyGallery({ slug }: CaseStudyGalleryProps) {
  const images = galleryBySlug[slug] ?? defaultGallery(slug);

  return (
    <div className="container-content mb-20 relative z-10">
      <div className="grid md:grid-cols-2 gap-6 md:gap-8">
        {images.map((item) =>
          item.type === "video" ? (
            <GalleryVideo
              key={item.src}
              src={item.src}
              poster={item.poster ?? ""}
              alt={item.alt}
              aspectClass={item.aspectClass}
            />
          ) : (
            <HeightFitImage
              key={item.src}
              src={item.src}
              alt={item.alt}
              aspectClass={item.aspectClass}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ),
        )}
      </div>
    </div>
  );
}
