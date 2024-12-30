import type { NextConfig } from "next";
import createMDX from "@next/mdx";

import remarkGfm from "remark-gfm";
import rehypeKatex from "rehype-katex";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [[rehypeKatex, { strict: true, throwOnError: true }]],
  },
});

export default withMDX(nextConfig);
