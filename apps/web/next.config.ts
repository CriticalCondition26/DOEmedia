import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@doemedia/db",
    "@doemedia/meta-api",
    "@doemedia/ai",
    "@doemedia/ad-research",
    "@doemedia/shared",
  ],
};

export default nextConfig;
