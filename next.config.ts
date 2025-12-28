import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        pathname: "/**",
      },
    ],
  },

  async headers() {
    return [
      {
        source: "/:all*(svg|jpg|png|webp|avif|woff|woff2|glb)",
        headers: [
          {
            key: "Cache-Control",
            // CRITICAL: If you change Sony.glb, you MUST rename it to Sony-v2.glb
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
