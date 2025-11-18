/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { getImagesFromFolder } from "./utils/imagekit-helper";

// Size-aware grouping for TVs
function groupTVsByModel(files: any[]) {
  const grouped = files.reduce((acc: any, file: any) => {
    const baseName = file.name.replace(/\.(jpg|jpeg|png|webp)$/i, "").trim();

    // Extract size (number + "inch" or "Inch")
    const sizeMatch = baseName.match(/(\d+)[-\s]?inch/i);
    const size = sizeMatch ? sizeMatch[1] : "unknown";

    // Remove size from model name to get base model
    const modelName = baseName
      .replace(/\d+[-\s]?inch/gi, "")
      .replace(/\s+/g, "-")
      .replace(/--+/g, "-")
      .toLowerCase()
      .trim()
      .replace(/^-+|-+$/g, "");

    if (!acc[modelName]) {
      acc[modelName] = {
        model: modelName,
        sizes: {},
      };
    }

    if (!acc[modelName].sizes[size]) {
      acc[modelName].sizes[size] = [];
    }

    acc[modelName].sizes[size].push({
      ...file,
      detectedSize: size,
    });

    return acc;
  }, {});

  return grouped;
}

async function testTVsGrouping() {
  console.log("🧪 Testing TVs Grouping with Size Variants...\n");

  const result = await getImagesFromFolder("TVs");

  if (result.success) {
    const grouped = groupTVsByModel(result.files);

    console.log(`📺 Found ${Object.keys(grouped).length} unique TV models\n`);
    console.log("═══════════════════════════════════════════════════\n");

    Object.entries(grouped).forEach(([modelName, data]: [string, any]) => {
      const totalImages = Object.values(data.sizes).reduce(
        (sum: number, imgs: any) => sum + imgs.length,
        0
      );
      const sizeCount = Object.keys(data.sizes).length;

      console.log(`📺 ${modelName}`);
      console.log(`   Total Images: ${totalImages} | Sizes: ${sizeCount}`);

      Object.entries(data.sizes).forEach(([size, images]: [string, any]) => {
        console.log(`   📏 ${size}": ${images.length} image(s)`);
        images.forEach((img: any) => {
          console.log(`      - ${img.name}`);
        });
      });
      console.log("");
    });

    console.log("═══════════════════════════════════════════════════");
    console.log(`📸 Total Images: ${result.count}`);
    console.log(`📺 Unique Models: ${Object.keys(grouped).length}`);
  } else {
    console.error("❌ Error:", result.error);
  }

  console.log("\n✅ Test completed! 🎉");
}

testTVsGrouping()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
