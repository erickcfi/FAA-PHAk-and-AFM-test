import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
  },
  // Allow large data files (question banks)
  experimental: {
    largePageDataBytes: 512 * 1024,
  },
};

export default nextConfig;
