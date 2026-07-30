"use client";

import dynamic from "next/dynamic";
import { SkillsStaticGrid } from "@/components/sections/Skills";

const SkillsPlayground = dynamic(
  () => import("@/components/ui/SkillsPlayground"),
  {
    ssr: false,
    loading: () => <SkillsStaticGrid />,
  }
);

export default function SkillsPlaygroundLoader() {
  return <SkillsPlayground />;
}
