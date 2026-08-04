import fs from "fs/promises";
import path from "path";
import type { Element } from "hast";
import ReactMarkdown from "react-markdown";
import ProseMedia from "@/components/ui/ProseMedia";

function paragraphContainsOnlyImage(node: Element | undefined) {
  if (!node || node.tagName !== "p") return false;
  const meaningful = node.children.filter(
    (child) => child.type !== "text" || child.value.trim() !== "",
  );
  return (
    meaningful.length === 1 &&
    meaningful[0].type === "element" &&
    meaningful[0].tagName === "img"
  );
}

const caseStudySlugs = ["woap", "te-matapihi", "zonescan-install", "tell-your-story"] as const;

export async function getCaseStudy(slug: string): Promise<React.ReactNode> {
  if (!caseStudySlugs.includes(slug as (typeof caseStudySlugs)[number])) {
    return null;
  }

  try {
    const filePath = path.join(process.cwd(), "case-studies", `${slug}.mdx`);
    const source = await fs.readFile(filePath, "utf-8");
    return (
      <ReactMarkdown
        components={{
          h1: ({ children }) => <h1>{children}</h1>,
          h2: ({ children }) => <h2>{children}</h2>,
          h3: ({ children }) => <h3>{children}</h3>,
          p: ({ children, node }) => {
            if (paragraphContainsOnlyImage(node)) return <>{children}</>;
            return <p>{children}</p>;
          },
          ul: ({ children }) => <ul>{children}</ul>,
          li: ({ children }) => <li>{children}</li>,
          hr: () => <hr className="prose-rule" />,
          strong: ({ children }) => <strong>{children}</strong>,
          img: ({ src, alt }) => {
            if (!src || typeof src !== "string") return null;
            return <ProseMedia src={src} alt={alt ?? ""} />;
          },
        }}
      >
        {source}
      </ReactMarkdown>
    );
  } catch {
    return null;
  }
}
