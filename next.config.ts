import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const withMDX = createMDX({
  options: {
    remarkPlugins: [],
    rehypePlugins: [],
  },
});

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/portfolio",
  assetPrefix: "/portfolio",
  trailingSlash: true,
  images: { unoptimized: true },
  pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
  turbopack: {
    root: __dirname,
  },
};

export default withMDX(nextConfig);
