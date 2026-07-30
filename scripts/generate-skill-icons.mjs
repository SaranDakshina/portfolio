import { mkdir } from "fs/promises";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import sharp from "sharp";
import StackIcon from "tech-stack-icons";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "../public/skills");
const SIZE = 144;

const icons = [
  { id: "react", name: "react" },
  { id: "nextjs", name: "nextjs" },
  { id: "typescript", name: "typescript" },
  { id: "tailwindcss", name: "tailwindcss" },
  { id: "sass", name: "sass" },
  { id: "gsap", name: "gsap" },
  { id: "motion", name: "motion" },
  { id: "threejs", name: "threejs" },
  { id: "graphql", name: "graphql" },
  { id: "electron", name: "electron" },
  { id: "docker", name: "docker" },
  { id: "aws", name: "aws" },
  { id: "vercel", name: "vercel" },
  { id: "nodejs", name: "nodejs" },
  { id: "laravel", name: "laravel" },
  { id: "js", name: "js" },
  { id: "html5", name: "html5" },
  { id: "css3", name: "css3" },
  { id: "figma", name: "figma" },
];

function extractSvg(html) {
  const match = html.match(/<svg[\s\S]*<\/svg>/);
  if (!match) throw new Error("No SVG found in rendered markup");
  return match[0];
}

await mkdir(outDir, { recursive: true });

for (const { id, name } of icons) {
  const html = renderToStaticMarkup(
    React.createElement(StackIcon, { name, variant: "light" })
  );
  const svg = extractSvg(html);
  const png = await sharp(Buffer.from(svg)).resize(SIZE, SIZE).png().toBuffer();
  const outPath = join(outDir, `${id}.png`);
  await sharp(png).toFile(outPath);
  console.log(`Wrote ${outPath}`);
}

console.log(`Done — ${icons.length} icons at ${SIZE}px`);
