import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        //   Everything not listed in Disallow is crawlable.
        disallow: [
          "/api",
          "/checkout",
          "/favorites",
          "/orders",
          "/signup",
          "/login",
        ],
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
