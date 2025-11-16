import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [],
    domains: [],
  },
  serverExternalPackages: ["fs"],
  experimental: {
    serverActions: {
      bodySizeLimit: '4mb'
    }
  },
};

export default nextConfig;
