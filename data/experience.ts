export type Experience = {
  id: string;
  startDate: string;
  endDate: string;
  title: string;
  company: string;
  location: string;
  workMode?: string;
  summary: string;
  achievements: string[];
  technologies: string[];
};

export const experiences: Experience[] = [
  {
    id: "click-suite",
    startDate: "Sep 2025",
    endDate: "Present",
    title: "Full Stack Web Developer",
    company: "Click Suite",
    location: "Wellington, New Zealand",
    workMode: "Hybrid",
    summary:
      "Building modern web, desktop, and interactive applications for cultural, community, and public-facing organisations.",
    achievements: [
      "Delivered responsive React and Next.js applications integrated with GraphQL and DatoCMS.",
      "Developed Electron-based desktop experiences and supported production deployments.",
      "Worked across frontend development, CMS integration, technical planning, testing, and client delivery.",
    ],
    technologies: ["Next.js", "React", "TypeScript", "GraphQL", "DatoCMS", "Electron"],
  },
  {
    id: "pulsebay",
    startDate: "Jan 2025",
    endDate: "Aug 2025",
    title: "UI Developer",
    company: "Pulsebay",
    location: "Auckland, New Zealand",
    summary:
      "Developed responsive interfaces in close collaboration with UX and design teams.",
    achievements: [
      "Translated Figma prototypes into reusable, production-ready React interfaces.",
      "Improved usability, accessibility, responsiveness, and cross-device performance.",
    ],
    technologies: ["React", "JavaScript", "HTML", "CSS", "Figma"],
  },
  {
    id: "pat-falvey",
    startDate: "Jul 2023",
    endDate: "Oct 2024",
    title: "Web Developer",
    company: "Pat Falvey",
    location: "Ireland",
    summary:
      "Built internal platforms and customer-facing tools supporting travel operations.",
    achievements: [
      "Developed a high-performance communication platform using React and TypeScript.",
      "Improved booking and onboarding workflows, contributing to a 30% reduction in lead drop-off.",
    ],
    technologies: ["React", "TypeScript", "Tailwind CSS", "REST APIs"],
  },
  {
    id: "axa",
    startDate: "Aug 2022",
    endDate: "May 2023",
    title: "UX Designer",
    company: "AXA",
    location: "Dublin, Ireland",
    summary:
      "Designed research-driven improvements for customer-facing insurance experiences.",
    achievements: [
      "Conducted usability testing, design sprints, and stakeholder workshops.",
      "Created interactive Figma prototypes based on customer insights and product KPIs.",
    ],
    technologies: ["Figma", "UX Research", "Prototyping", "Design Systems"],
  },
  {
    id: "the-hustle",
    startDate: "2017",
    endDate: "2020",
    title: "Web UI Developer",
    company: "The Hustle · Purpose Driven Humans",
    location: "New Zealand",
    summary:
      "Delivered SaaS products and client websites across government, retail, hospitality, property, and community sectors.",
    achievements: [
      "Developed React and TypeScript dashboards and CRUD interfaces for the Cedar Insight debt-management platform.",
      "Delivered responsive client websites and improved information architecture across multiple industries.",
    ],
    technologies: ["React", "TypeScript", "REST APIs", "Figma"],
  },
];
