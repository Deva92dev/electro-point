/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { getImagesFromFolder } from "./utils/imagekit-helper";

// Color-aware grouping for smartwatches
function groupSmartwatchesByModel(files: any[]) {
  const grouped = files.reduce((acc: any, file: any) => {
    const baseName = file.name.replace(/\.(jpg|jpeg|png|webp)$/i, "").trim();

    // Extract color (last 1-2 words)
    const colorMatch = baseName.match(
      /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|orange|brown|sky|multi|light[-\s]?blue|light[-\s]?green|light[-\s]?brown|2nd[-\s]?gen)$/i
    );
    const color = colorMatch
      ? colorMatch[1].toLowerCase().replace(/[-\s]/g, "-")
      : "default";

    // Remove color from model name
    const modelName = baseName
      .replace(
        /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|orange|brown|sky|multi|light[-\s]?blue|light[-\s]?green|light[-\s]?brown)$/i,
        ""
      )
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .toLowerCase()
      .trim();

    if (!acc[modelName]) {
      acc[modelName] = {
        model: modelName,
        colors: {},
      };
    }

    if (!acc[modelName].colors[color]) {
      acc[modelName].colors[color] = [];
    }

    acc[modelName].colors[color].push({
      ...file,
      detectedColor: color,
    });

    return acc;
  }, {});

  return grouped;
}

async function testSmartwatchesGrouping() {
  console.log("🧪 Testing Smartwatches Grouping with Color Variants...\n");

  const result = await getImagesFromFolder("Smartwatch");

  if (result.success) {
    const grouped = groupSmartwatchesByModel(result.files);

    console.log(
      `⌚ Found ${Object.keys(grouped).length} unique smartwatch models\n`
    );
    console.log("═══════════════════════════════════════════════════\n");

    Object.entries(grouped).forEach(([modelName, data]: [string, any]) => {
      const totalImages = Object.values(data.colors).reduce(
        (sum: number, imgs: any) => sum + imgs.length,
        0
      );
      const colorCount = Object.keys(data.colors).length;

      console.log(`⌚ ${modelName}`);
      console.log(`   Total Images: ${totalImages} | Colors: ${colorCount}`);

      Object.entries(data.colors).forEach(([color, images]: [string, any]) => {
        console.log(`   🎨 ${color}: ${images.length} image(s)`);
        images.forEach((img: any) => {
          console.log(`      - ${img.name}`);
        });
      });
      console.log("");
    });

    console.log("═══════════════════════════════════════════════════");
    console.log(`📸 Total Images: ${result.count}`);
    console.log(`⌚ Unique Models: ${Object.keys(grouped).length}`);
  } else {
    console.error("❌ Error:", result.error);
  }

  console.log("\n✅ Test completed! 🎉");
}

testSmartwatchesGrouping()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
