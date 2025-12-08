import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../index";
import { sql } from "drizzle-orm";

/**
 * 🎨 MASTER COLOR PALETTE
 * Maps marketing names to CSS Hex Codes.
 * Add new colors here as you add new products.
 */
const COLOR_PALETTE: Record<string, string> = {
  // --- Standard Colors ---
  Black: "#000000",
  White: "#FFFFFF",
  Silver: "#C0C0C0",
  Grey: "#808080",
  Gray: "#808080",
  Red: "#FF0000",
  Blue: "#0000FF",
  Green: "#008000",
  Gold: "#FFD700",
  Rose: "#FF007F",
  Pink: "#FFC0CB",
  Purple: "#800080",
  Yellow: "#FFFF00",
  Orange: "#FFA500",

  // --- Apple / Premium Tech ---
  "Space Black": "#2e2e2e",
  "Space Grey": "#4a4a4a",
  Midnight: "#191970",
  Starlight: "#f0f0e0",
  "Natural Titanium": "#dce0e0",
  "Blue Titanium": "#2f3847",
  "White Titanium": "#f2f2f2",
  "Black Titanium": "#1c1c1e",
  "Deep Purple": "#4b365f",
  "Alpine Green": "#3f4e3f",

  // --- Samsung / Android ---
  "Phantom Black": "#1a1a1a",
  Cream: "#fffdd0",
  Lavender: "#e6e6fa",
  "Titanium Gray": "#808080",
  "Titanium Black": "#111111",
  "Titanium Violet": "#8a2be2",
  "Titanium Yellow": "#ffd700",
  Obsidian: "#181818",
  Porcelain: "#fdfcf7",
  Bay: "#96b6d6",
  Aloe: "#a8c8bd",
  Hazel: "#8e8d89",

  // --- Gaming / Laptops ---
  "Abyssal Black": "#0a0a0a",
  "Storm Grey": "#555555",
  "Glacier White": "#f8f9fa",
  "Dark Shadow Grey": "#333333",
  "Quantum White": "#eeeeee",
  "Mecha Gray": "#7a7a7a",
  "Eclipse Grey": "#2c2c2c",

  // --- Audio / Accessories ---
  "Platinum Silver": "#e5e4e2",
  "Midnight Blue": "#191970",
  "Khaki Green": "#8a865d",
  "Flowy Emerald": "#008f73",
  "Silky Black": "#111111",

  // Fallback
  Default: "#cccccc",
};

const syncColors = async () => {
  console.log("🎨 Syncing product colors with Hex Codes...");
  const start = performance.now();

  // 1. GENERATE SQL CASE STATEMENT
  // This dynamically builds the SQL logic to map names to hexes
  let caseStatement = "CASE";
  for (const [name, hex] of Object.entries(COLOR_PALETTE)) {
    // Escape single quotes in names just in case (e.g. "Let's Go Blue")
    const safeName = name.replace(/'/g, "''");
    caseStatement += ` WHEN v.color = '${safeName}' THEN '${hex}'`;
  }
  caseStatement += " ELSE '#cccccc' END"; // Default hex if not found

  // 2. EXECUTE THE UPDATE
  // This query:
  // - Groups variants by product_id
  // - Builds a JSON object { name, hex } for each variant
  // - Aggregates them into a JSONB array
  // - Updates the 'products' table
  try {
    await db.execute(
      sql.raw(`
      UPDATE products p
      SET colors = COALESCE(
        (
          SELECT json_agg(
            json_build_object(
              'name', v.color,
              'hex', ${caseStatement}
            ) 
            ORDER BY v.color
          )::jsonb 
          FROM product_variants v
          WHERE v.product_id = p.id
          AND v.color IS NOT NULL
        ),
        '[]'::jsonb
      )
    `)
    );

    const end = performance.now();
    console.log(`✅ Hex codes synced in ${(end - start).toFixed(2)}ms`);
  } catch (error) {
    console.error("❌ Database Error during sync:");
    throw error;
  }
};

// Run if called directly
if (require.main === module) {
  syncColors()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Fatal Error:", error);
      process.exit(1);
    });
}
