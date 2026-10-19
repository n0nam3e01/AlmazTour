import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: { globalNotFound: true },
  async redirects() {
    return [
      { source: "/", destination: "/ru", permanent: true },
      ...["destinations", "hot-tours", "health-tours", "reviews", "contacts"].map((route) => ({
        source: `/${route}/:path*`, destination: `/ru/${route}/:path*`, permanent: true,
      })),
      { source: "/offers", destination: "/ru/hot-tours", permanent: true },
    ];
  },
};

export default nextConfig;
