import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb", // or "500kb", "3mb", etc.
      // allowedOrigins: [] // optional
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.pexels.com",
        port: "",
      },
      {
        protocol: "https",
        hostname: "aromatic-puma-833.convex.cloud",
        pathname: "/api/storage/*",
      },
    ],
  },
};

/**https://aromatic-puma-833.convex.cloud/api/storage/f7fbf6b2-4940-4a86-916e-145cdfb052ab */

export default nextConfig;
