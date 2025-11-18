/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../index";
import { brands, categories } from "../schema";

export const seedCategoriesAndBrands = async () => {
  console.log("🏷️  Seeding categories and brands...\n");

  const laptopCategories = [
    { name: "Gaming Laptops", slug: "gaming-laptops", productType: "laptop" },
    {
      name: "Business Laptops",
      slug: "business-laptops",
      productType: "laptop",
    },
    { name: "Macbooks", slug: "macbooks", productType: "laptop" },
    { name: "Ultrabooks", slug: "ultrabooks", productType: "laptop" },
  ];

  const otherCategories = [
    { name: "Smartphones", slug: "smartphones", productType: "smartphone" },
    { name: "Tablets", slug: "tablets", productType: "tablet" },
    { name: "Headphones", slug: "headphones", productType: "headphones" },
    { name: "TVs", slug: "tvs", productType: "tv" },
    { name: "Smart Watches", slug: "smart-watches", productType: "smartwatch" },
  ];

  const allCategories = [...laptopCategories, ...otherCategories];

  for (const cat of allCategories) {
    const [category] = await db
      .insert(categories)
      .values(cat as any)
      .onConflictDoNothing()
      .returning();

    if (category) {
      console.log(`  ✅ ${category.name}`);
    }
  }

  console.log("\n🏷️  Creating brands...");

  const brandList = [
    { name: "Acer", slug: "acer" },
    { name: "Apple", slug: "apple" },
    { name: "Asus", slug: "asus" },
    { name: "Dell", slug: "dell" },
    { name: "Fitbit", slug: "fitbit" },
    { name: "Google Pixel", slug: "google-pixel" },
    { name: "HP", slug: "hp" },
    { name: "JBL", slug: "jbl" },
    { name: "Lenovo", slug: "lenovo" },
    { name: "LG", slug: "lg" },
    { name: "Microsoft", slug: "microsoft" },
    { name: "Motorola", slug: "motorola" },
    { name: "MSI", slug: "msi" },
    { name: "OnePlus", slug: "oneplus" },
    { name: "Samsung", slug: "samsung" },
    { name: "Skullcandy", slug: "skullcandy" },
    { name: "Sony", slug: "sony" },
    { name: "Vizio", slug: "vizio" },
  ];

  for (const brand of brandList) {
    const [createdBrand] = await db
      .insert(brands)
      .values(brand)
      .onConflictDoNothing()
      .returning();

    if (createdBrand) {
      console.log(`  ✅ ${createdBrand.name}`);
    }
  }
  console.log("\n✅ Categories and brands seeded!\n");
};

// Run if called directly
if (require.main === module) {
  seedCategoriesAndBrands()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Error:", error);
      process.exit(1);
    });
}
