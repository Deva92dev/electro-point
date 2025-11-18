/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../index";
import { products, tags, productTags } from "../schema";
import { inArray } from "drizzle-orm";

/**
 * The 5 priority tags to create.
 */
const priorityTags = [
  { name: "Performance", slug: "performance" },
  { name: "Battery Life", slug: "battery-life" },
  { name: "Design", slug: "design" },
  { name: "Camera", slug: "camera" },
  { name: "Gaming", slug: "gaming" },
];

/**
 * Creates the 5 tags if they don't exist.
 * @returns A Map of tag names to their database IDs.
 */
const getOrCreateTags = async (): Promise<Map<string, number>> => {
  console.log("🏷️  Creating tags...");

  const insertedTags = await db
    .insert(tags)
    .values(priorityTags)
    .onConflictDoNothing()
    .returning();

  if (insertedTags.length > 0) {
    insertedTags.forEach((tag) => console.log(`  ✅ ${tag.name}`));
  } else {
    console.log("  ℹ️ Tags already exist.");
  }

  // Fetch all tags to get their IDs
  const allTags = await db
    .select()
    .from(tags)
    .where(
      inArray(
        tags.name,
        priorityTags.map((t) => t.name)
      )
    );

  return new Map(allTags.map((tag) => [tag.name, tag.id]));
};

/**
 * This is the heuristic logic. It checks a product's specs
 * and returns an array of tag names it should have.
 */
const applyTaggingRules = (
  specs: Record<string, string | undefined>
): string[] => {
  const matchedTags: Set<string> = new Set();
  if (!specs) return [];

  // --- Performance Rule ---
  const ramGigs = parseInt(specs.ram || "0");
  const procKeywords = [
    "i7",
    "i9",
    "Ultra 9",
    "Ryzen 7",
    "Ryzen AI 9",
    "M4",
    "Snapdragon 8",
    "A18",
    "Tensor G4",
  ];
  if (
    ramGigs >= 16 ||
    procKeywords.some((k) => specs.processor?.includes(k)) ||
    procKeywords.some((k) => specs.chipset?.includes(k))
  ) {
    matchedTags.add("Performance");
  }

  // --- Gaming Rule ---
  if (
    specs.graphics?.includes("NVIDIA") ||
    specs.graphics?.includes("RTX") ||
    specs.refreshRate === "144Hz" || // For TVs
    specs.screen?.includes("144Hz") // For Laptops/Phones
  ) {
    matchedTags.add("Gaming");
  }

  // --- Battery Life Rule ---
  const batteryMah = parseInt(specs.battery || "0");
  const batteryHours = parseInt(specs.battery || "0");
  if (
    batteryMah >= 5000 ||
    batteryHours >= 30 ||
    specs.battery?.includes("days") ||
    specs.batteryLife?.includes("days")
  ) {
    matchedTags.add("Battery Life");
  }

  // --- Design Rule (Proxy for "Premium") ---
  if (
    specs.processor?.includes("M4") ||
    specs.chipset?.includes("A18") ||
    specs.display?.includes("OLED") ||
    specs.display?.includes("QLED") ||
    specs.material?.includes("Titanium") // Example
  ) {
    matchedTags.add("Design");
  }

  // --- Camera Rule ---
  const cameraMp = parseInt(specs.camera || "0");
  if (cameraMp >= 48) {
    matchedTags.add("Camera");
  }

  return Array.from(matchedTags);
};

/**
 * Main seeding function
 */
export const seedProductTags = async () => {
  // 1. Get or create the tags and their IDs
  const tagIdMap = await getOrCreateTags();

  // 2. Fetch all products and their quickSpecs
  console.log("\n fetching all products and specs...");
  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      quickSpecs: products.quickSpecs,
    })
    .from(products);

  console.log(`  ℹ️ Found ${allProducts.length} products to analyze.`);

  // 3. Determine which tags to link
  const linksToCreate: { productId: number; tagId: number }[] = [];

  for (const product of allProducts) {
    const specs = (product.quickSpecs || {}) as Record<
      string,
      string | undefined
    >;
    const matchedTagNames = applyTaggingRules(specs);

    if (matchedTagNames.length > 0) {
      console.log(`  - ${product.name} -> [${matchedTagNames.join(", ")}]`);
      for (const tagName of matchedTagNames) {
        const tagId = tagIdMap.get(tagName);
        if (tagId) {
          linksToCreate.push({
            productId: product.id,
            tagId: tagId,
          });
        }
      }
    }
  }

  // 4. Batch-insert all the new links
  console.log(`\n🔗 Creating ${linksToCreate.length} new product-tag links...`);
  if (linksToCreate.length > 0) {
    const result = await db
      .insert(productTags)
      .values(linksToCreate)
      .onConflictDoNothing() // Makes it safe to re-run
      .returning();

    console.log(`  ✅ Successfully created ${result.length} links.`);
  } else {
    console.log("  ℹ️ No new links to create.");
  }

  console.log("\n✅ Automated tag seeding complete!\n");
};

// Run if called directly
if (require.main === module) {
  seedProductTags()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Error seeding product tags:", error);
      process.exit(1);
    });
}
