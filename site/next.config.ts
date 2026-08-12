import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: "/ai-matrix-countdown",
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
