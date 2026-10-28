import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/auth/:path*",
        destination: "http://localhost:3001/api/auth/:path*",
      },
      {
        source: "/api/projects/:path*",
        destination: "http://localhost:3001/api/projects/:path*",
      },
    ];
  },
};

export default nextConfig;
