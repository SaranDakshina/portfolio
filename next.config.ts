import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const productionBasePath = "/portfolio";
const basePath = process.env.NODE_ENV === "production" ? productionBasePath : "";

const nextConfig: NextConfig = {
  output: "export",
  basePath,
  assetPrefix: basePath || undefined,
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
  turbopack: {
    root: __dirname,
  },
};

export default withMDX(nextConfig);
