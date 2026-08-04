export interface Project {
  slug: string;
  name: string;
  shortName: string;
  year: string;
  impact: string;
  role: string;
  stack: string[];
  what: string;
  why: string;
  image: string;
  imageAlt: string;
  imagePoster?: string;
  inlineVideo?: string;
  inlineVideoPoster?: string;
  imageAspect?: string;
  imageObjectFit?: "cover" | "contain" | "height";
  imageWidth?: number;
  imageHeight?: number;
  liveUrl?: string;
  liveLabel?: string;
  inlineImages?: string[];
  color: string; // accent/overlay tint for the dark chapter
}

export const projects: Project[] = [
  {
    slug: "woap",
    name: "Visa Wellington On a Plate",
    shortName: "WOAP",
    year: "2026",
    impact:
      "A complete digital redesign of New Zealand's largest food festival, focused on creating an engaging event discovery experience.",
    role: "Frontend Developer",
    stack: ["Next.js", "React", "TypeScript", "Three.js", "Matter.js", "GraphQL", "DatoCMS"],
    what: "Led frontend development on a full digital redesign of Wellington's biggest food festival — interactive homepage, CMS-driven content, and a searchable map experience for hundreds of events and venues.",
    why: "Festival visitors needed a faster, more engaging way to discover restaurants, events, and venues across Wellington. The redesign put discovery at the centre of the experience.",
    image: "/projects/woap/woap-home.mp4",
    imageAlt: "WOAP interactive homepage with physics-based elements",
    imagePoster: "/projects/woap/woap-interaction-poster.jpg",
    inlineVideo: "/projects/woap/woap-interaction.mp4",
    inlineVideoPoster: "/projects/woap/woap-interaction-poster.jpg",
    imageWidth: 1920,
    imageHeight: 1112,
    liveUrl: "https://visawoap.com/",
    liveLabel: "Visit Visa WOAP",
    color: "#8B2500",
  },
  {
    slug: "te-matapihi",
    name: "Te Matāpihi Library Digital Experience",
    shortName: "Te Matāpihi",
    year: "2023",
    impact:
      "A multi-screen touch installation across a public library — CMS-driven content, live event feeds, and synchronised dual-screen experiences.",
    role: "Fullstack Developer",
    stack: ["React", "Electron", "DatoCMS", "GraphQL", "TypeScript", "Lottie", "REST API"],
    what: "Built the user-facing interfaces for a network of library touch screens — React UI, DatoCMS content integration, Lottie animation conversion, and Electron packaging and deployment — across corner displays, story readers, a dual-screen video room, and a large-format bleachers wall.",
    why: "Libraries need digital experiences that staff can update without developers and that work reliably for every visitor — from children exploring touch screens to seniors reading long-form stories.",
    image: "/projects/library/library-hero.jpg",
    imageAlt: "Te Matāpihi Library digital installation overview",
    inlineVideo: "/projects/library/library-digital-experience-room.mp4",
    inlineVideoPoster: "/projects/library/library-digital-experience-room-poster.jpg",
    imageWidth: 1799,
    imageHeight: 1080,
    color: "#1A4A3A",
  },
  {
    slug: "tell-your-story",
    name: "Tell Your Stories",
    shortName: "Tell Your Stories",
    year: "2024–2025",
    impact:
      "A standalone, AI-powered authoring tool that converts teachers' narrative stories into ready-to-use visual assets — high-resolution images, short video clips, and printable PDFs — via text-to-image, text-to-video and text-to-speech pipelines.",
    role: "UI/UX Designer & Frontend Developer",
    stack: ["Next.js", "Nest.js", "TypeScript", "ElevenLabs", "OpenAI", "REST API"],
    what: "An authoring application where teachers input story text; the system automatically segments narratives into scenes, generates scene-level prompts, and produces AI-generated images, narrated video clips, and assembled PDF lesson packets. Outputs include media files (PNG/JPEG, MP4), synthetic audio, and packaged PDFs for printing or distribution.",
    why: "To drastically reduce teacher prep time by automating visual and multimedia asset creation from plain text. The tool provides reproducible, editable media exports (images, videos, PDFs) so educators can focus on pedagogy rather than production.",
    image: "/projects/tys/tell-your-story.jpg",
    imageAlt: "Authoring UI showing generated images, video preview, and PDF export options",
    inlineImages: [
      "/projects/tys/tell-your-story.jpg",
      "/projects/tys/tell-your-story-img-2.webp",
      "/projects/tys/tys-1.jpg",
      "/projects/tys/tys-2.jpg",
    ],
    imageWidth: 1920,
    imageHeight: 1080,
    color: "#2A1A0A",
  },
  {
    slug: "zonescan-install",
    name: "Gutermann ZONESCAN Install",
    shortName: "ZONESCAN Install",
    year: "2024",
    impact:
      "An enterprise Android app that simplifies IoT water-leak logger installation and maintenance for utility field engineers.",
    role: "Product Designer",
    stack: ["Figma", "Android", "Material Design", "User Journey Design", "Prototyping", "Enterprise UX"],
    what: "Led end-to-end user journey design for a native Android field-installation app — from stakeholder discovery through login, device setup, map-based logger deployment, project management, firmware updates, and maintenance workflows.",
    why: "Field engineers need to install and maintain complex IoT hardware in unpredictable outdoor conditions. The design had to translate multi-step technical processes into a clear, reliable mobile experience.",
    image: "/projects/zonescan-install/hero.png",
    imageAlt: "Gutermann ZONESCAN Install — enterprise Android app for IoT logger deployment",
    imageWidth: 1600,
    imageHeight: 960,
    color: "#0A1A3A",
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
