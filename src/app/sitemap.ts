import { getProductsForSitemap } from "@/utils/actions/actions";
import { MetadataRoute } from "next";

const BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000";

type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: {
    path: string;
    changeFrequency: ChangeFrequency;
    priority: number;
  }[] = [
    { path: "/", changeFrequency: "daily", priority: 1.0 },
    { path: "/products", changeFrequency: "hourly", priority: 0.9 },
    { path: "/about", changeFrequency: "monthly", priority: 0.6 },
    { path: "/cancellation-refunds", changeFrequency: "yearly", priority: 0.3 },
    { path: "/privacy-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/booking-policy", changeFrequency: "yearly", priority: 0.3 },
    { path: "/terms-conditions", changeFrequency: "yearly", priority: 0.3 },
  ];

  const staticEntries: MetadataRoute.Sitemap = staticPages.map(
    ({ path, changeFrequency, priority }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency,
      priority,
    })
  );

  const allProducts = await getProductsForSitemap();

  const productEntries: MetadataRoute.Sitemap = allProducts.map((product) => ({
    url: `${BASE_URL}/products/${product.id}`,
    lastModified: new Date(product.updatedAt || new Date()),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [...staticEntries, ...productEntries];
}
