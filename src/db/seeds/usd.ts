import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import { db } from "..";
import { products, productVariants } from "../schema";

// ⚠️ SETTINGS ⚠️
const INR_TO_USD_RATE = 86.5;
const SAFETY_CHECK = false; // Step 1: Run as TRUE. Step 2: Set to FALSE.

const convertToUsd = (priceInr: string | number | null): string | null => {
  if (!priceInr) return null;

  // Drizzle returns decimal as string parse it safely.
  const num = typeof priceInr === "string" ? parseFloat(priceInr) : priceInr;

  if (isNaN(num)) return null;

  const usdPrice = (num / INR_TO_USD_RATE).toFixed(2);
  return usdPrice;
};

async function migrate() {
  console.log("\n🚀 STARTING CURRENCY MIGRATION (INR -> USD)");
  console.log(`ℹ️  Rate: ${INR_TO_USD_RATE}`);
  console.log(
    `🛡️  Safety Mode: ${SAFETY_CHECK ? "ON (Dry Run)" : "OFF (Live Update)"}\n`
  );

  // --- 1. UPDATE PRODUCTS ---
  const allProducts = await db.select().from(products);
  console.log(`📦 Processing ${allProducts.length} Products...`);

  for (const product of allProducts) {
    const newBasePrice = convertToUsd(product.basePrice);
    const newSalePrice = convertToUsd(product.salePrice);

    // Logging changes clearly
    console.log(
      `   [${product.id}] ${product.name.slice(0, 25).padEnd(25)} | INR ${
        product.basePrice
      } => USD $${newBasePrice}`
    );

    if (!SAFETY_CHECK && newBasePrice) {
      await db
        .update(products)
        .set({
          basePrice: newBasePrice, // Drizzle accepts string for decimal columns
          salePrice: newSalePrice,
        })
        .where(eq(products.id, product.id));
    }
  }

  console.log(`\n🎨 Processing Variants...`);
  const allVariants = await db.select().from(productVariants);

  for (const variant of allVariants) {
    // 'price', not 'basePrice' for variants
    const newPrice = convertToUsd(variant.price);
    const newSalePrice = convertToUsd(variant.salePrice);

    console.log(
      `   [${variant.id}] ${variant.variantName
        .slice(0, 25)
        .padEnd(25)} | INR ${variant.price} => USD $${newPrice}`
    );

    if (!SAFETY_CHECK && newPrice) {
      await db
        .update(productVariants)
        .set({
          price: newPrice,
          salePrice: newSalePrice,
        })
        .where(eq(productVariants.id, variant.id));
    }
  }

  console.log(
    `\n✅ Migration ${SAFETY_CHECK ? "Simulation" : "Execution"} Complete!`
  );
}

migrate()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("❌ Error:", err);
    process.exit(1);
  });
