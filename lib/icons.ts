import type { IconName } from "tech-stack-icons";
import { assetPath } from "@/lib/asset-path";

export type IconSize = "large" | "medium" | "small";

export interface TechIconItem {
  id: string;
  label: string;
  icon: IconName;
  size: IconSize;
  category: string;
  color: string;
}

export const skillIconPng = (id: string) => assetPath(`/skills/${id}.png`);

export const ICON_SIZES: Record<IconSize, number> = {
  large: 144,
  medium: 112,
  small: 88,
};

/** Skills playground icon scale — mobile 2× smaller, desktop ~1.3× smaller than base. */
export const PLAYGROUND_ICON_SCALE = {
  mobile: 0.5,
  desktop: 2 / 3,
} as const;

export function playgroundIconSize(size: IconSize, isDesktop: boolean): number {
  const scale = isDesktop ? PLAYGROUND_ICON_SCALE.desktop : PLAYGROUND_ICON_SCALE.mobile;
  return Math.round(ICON_SIZES[size] * scale);
}

export const physicsIcons: TechIconItem[] = [
  { id: "react", label: "React", icon: "react", size: "large", category: "Frontend", color: "#C4532A" },
  { id: "nextjs", label: "Next.js", icon: "nextjs", size: "large", category: "Frontend", color: "#C4532A" },
  { id: "typescript", label: "TypeScript", icon: "typescript", size: "small", category: "Frontend", color: "#C4532A" },
  { id: "tailwindcss", label: "Tailwind", icon: "tailwindcss", size: "medium", category: "Frontend", color: "#C4532A" },
  { id: "sass", label: "SCSS", icon: "sass", size: "small", category: "Frontend", color: "#C4532A" },
  { id: "gsap", label: "GSAP", icon: "gsap", size: "medium", category: "Animation", color: "#8A857E" },
  { id: "motion", label: "Motion", icon: "motion", size: "small", category: "Animation", color: "#8A857E" },
  { id: "threejs", label: "Three.js", icon: "threejs", size: "medium", category: "Animation", color: "#8A857E" },
  { id: "graphql", label: "GraphQL", icon: "graphql", size: "small", category: "CMS / Data", color: "#4A7A5E" },
  { id: "electron", label: "Electron", icon: "electron", size: "small", category: "Apps / Deploy", color: "#3A5A8A" },
  { id: "docker", label: "Docker", icon: "docker", size: "medium", category: "Apps / Deploy", color: "#3A5A8A" },
  { id: "aws", label: "AWS", icon: "aws", size: "small", category: "Apps / Deploy", color: "#3A5A8A" },
  { id: "vercel", label: "Vercel", icon: "vercel", size: "small", category: "Apps / Deploy", color: "#3A5A8A" },
  { id: "nodejs", label: "Node.js", icon: "nodejs", size: "small", category: "Apps / Deploy", color: "#3A5A8A" },
  { id: "laravel", label: "Laravel", icon: "laravel", size: "small", category: "Apps / Deploy", color: "#3A5A8A" },
  { id: "js", label: "JavaScript", icon: "js", size: "small", category: "Frontend", color: "#C4532A" },
  { id: "html5", label: "HTML", icon: "html5", size: "small", category: "Frontend", color: "#C4532A" },
  { id: "css3", label: "CSS", icon: "css3", size: "small", category: "Frontend", color: "#C4532A" },
  { id: "figma", label: "Figma", icon: "figma", size: "small", category: "Creative", color: "#7A4A8A" },
];

export const heroIcons: Pick<TechIconItem, "icon" | "label" | "size">[] = [
  { icon: "react", label: "React", size: "medium" },
  { icon: "nextjs", label: "Next.js", size: "large" },
  { icon: "typescript", label: "TypeScript", size: "medium" },
  { icon: "gsap", label: "GSAP", size: "small" },
  { icon: "threejs", label: "Three.js", size: "small" },
  { icon: "tailwindcss", label: "Tailwind", size: "medium" },
  { icon: "graphql", label: "GraphQL", size: "small" },
  { icon: "docker", label: "Docker", size: "small" },
];
