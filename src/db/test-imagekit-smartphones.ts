/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import { getImagesFromFolder } from "./utils/imagekit-helper";

// Color-aware grouping
function groupSmartphonesByModel(files: any[]) {
  const grouped = files.reduce((acc: any, file: any) => {
    const baseName = file.name
      .replace(/\.(jpg|jpeg|png|webp)$/i, "")
      .replace(/[-\s]+(v1|v2|V1|V2)$/i, "")
      .trim();

    const colorMatch = baseName.match(
      /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|orange|yellow|rose|titanium|midnight|starlight|phantom|xl)$/i
    );
    const color = colorMatch ? colorMatch[1].toLowerCase() : "default";

    const modelName = baseName
      .replace(
        /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|orange|yellow|rose|titanium|midnight|starlight|phantom)$/i,
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

async function testSmartphoneGrouping() {
  console.log("🧪 Testing Smartphone Grouping with Color Variants...\n");

  const result = await getImagesFromFolder("Smartphones");

  if (result.success) {
    const grouped = groupSmartphonesByModel(result.files);

    console.log(
      `📱 Found ${Object.keys(grouped).length} unique smartphone models\n`
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

testSmartphoneGrouping()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });
