import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Server actions cap request bodies at 1MB by default; builds allow 10MB images (+ form overhead).
    serverActions: { bodySizeLimit: "11mb" },
  },
};

export default nextConfig;
