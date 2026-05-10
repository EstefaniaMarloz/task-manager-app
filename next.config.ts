import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://task-api-production-bd4c.up.railway.app/api/:path*",
      },
    ];
  },
};

export default nextConfig;
