import type { NextConfig } from "next";

// Static export: `next build` writes plain HTML/CSS/JS to ./out,
// which GitHub Pages serves at diegocaputo.com (see .github/workflows/deploy.yml).
const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
