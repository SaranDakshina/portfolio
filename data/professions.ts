export type Profession = {
  id: string;
  title: string;
  skills: string[];
};

export const professions: Profession[] = [
  {
    id: "full-stack",
    title: "Full Stack Developer",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "Node.js",
      "GraphQL",
      "REST APIs",
      "PostgreSQL",
      "Tailwind CSS",
    ],
  },
  {
    id: "frontend",
    title: "Frontend Developer",
    skills: [
      "React",
      "Next.js",
      "TypeScript",
      "JavaScript",
      "HTML",
      "CSS",
      "Tailwind CSS",
      "Accessibility",
    ],
  },
  {
    id: "backend",
    title: "Backend Developer",
    skills: [
      "Node.js",
      "TypeScript",
      "REST APIs",
      "GraphQL",
      "PostgreSQL",
      "MongoDB",
      "Docker",
      "AWS",
    ],
  },
  {
    id: "ui-ux",
    title: "UI/UX Designer",
    skills: [
      "Figma",
      "Prototyping",
      "User Research",
      "Wireframing",
      "Design Systems",
      "Accessibility",
      "HTML",
      "CSS",
    ],
  },
  {
    id: "mobile",
    title: "Mobile Developer",
    skills: [
      "React Native",
      "TypeScript",
      "Swift",
      "Kotlin",
      "REST APIs",
      "Firebase",
      "App Store",
      "Play Store",
    ],
  },
  {
    id: "devops",
    title: "DevOps Engineer",
    skills: [
      "Docker",
      "Kubernetes",
      "CI/CD",
      "AWS",
      "Terraform",
      "Linux",
      "Monitoring",
      "GitHub Actions",
    ],
  },
  {
    id: "creative-tech",
    title: "Creative Technologist",
    skills: [
      "React",
      "Three.js",
      "WebGL",
      "GSAP",
      "TypeScript",
      "Creative Coding",
      "Interaction Design",
      "Performance",
    ],
  },
  {
    id: "product",
    title: "Product Manager",
    skills: [
      "Roadmapping",
      "User Research",
      "Agile",
      "Stakeholder Management",
      "Analytics",
      "A/B Testing",
      "PRD Writing",
      "Prioritisation",
    ],
  },
];

export const CUSTOM_PROFESSION_ID = "custom";
