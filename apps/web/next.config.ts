import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/creative-os",
        destination: "/creative-os/index.html",
      },
    ];
  },
  transpilePackages: [
    "@doemedia/db",
    "@doemedia/meta-api",
    "@doemedia/ai",
    "@doemedia/ad-research",
    "@doemedia/shared",
  ],
};

export default nextConfig;
