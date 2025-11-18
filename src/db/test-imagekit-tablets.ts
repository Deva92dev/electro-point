/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { getImagesFromFolder } from "./utils/imagekit-helper";

function groupTabletsByModel(files: any[]) {
  const grouped = files.reduce((acc: any, file: any) => {
    const baseName = file.name
      .replace(/\.(jpg|jpeg|png|webp|JPG)$/i, "")
      .replace(/[-\s]+(v1|v2|V1|V2)$/i, "")
      .replace(/\s+copy$/i, "")
      .trim();

    // Extract color (last word)
    const colorMatch = baseName.match(
      /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|brown|fe\+?)$/i
    );
    const color = colorMatch
      ? colorMatch[1].toLowerCase().replace(/\+/g, "-plus")
      : "default";

    // Remove color from model name
    const modelName = baseName
      .replace(
        /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|brown|fe\+?)$/i,
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

async function testTabletsGrouping() {
  console.log("🧪 Testing Tablets Grouping with Color Variants...\n");

  const result = await getImagesFromFolder("Tablet");

  if (result.success) {
    const grouped = groupTabletsByModel(result.files);

    console.log(
      `📱 Found ${Object.keys(grouped).length} unique tablet models\n`
    );
    console.log("═══════════════════════════════════════════════════\n");

    Object.entries(grouped).forEach(([modelName, data]: [string, any]) => {
      const totalImages = Object.values(data.colors).reduce(
        (sum: number, imgs: any) => sum + imgs.length,
        0
      );
      const colorCount = Object.keys(data.colors).length;

      console.log(`📱 ${modelName}`);
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
    console.log(`📱 Unique Models: ${Object.keys(grouped).length}`);
  } else {
    console.error("❌ Error:", result.error);
  }

  console.log("\n✅ Test completed! 🎉");
}

testTabletsGrouping()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
