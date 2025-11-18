/* eslint-disable @typescript-eslint/no-explicit-any */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../index";
import {
  categories,
  brands,
  products,
  tabletSpecs,
  productImages,
  productVariants,
} from "../schema";
import { eq } from "drizzle-orm";

import { getImagesFromFolder } from "../utils/imagekit-helper";

function groupTabletsByModel(files: any[]) {
  const grouped = files.reduce((acc: any, file: any) => {
    const baseName = file.name
      .replace(/\.(jpg|jpeg|png|webp|JPG)$/i, "")
      .replace(/[-\s]+(v1|v2|V1|V2)$/i, "")
      .replace(/\s+copy$/i, "")
      .trim();

    const colorMatch = baseName.match(
      /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|brown|fe\+?)$/i
    );
    const color = colorMatch
      ? colorMatch[1].toLowerCase().replace(/\+/g, "-plus")
      : "default";

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

// Tablets database - All 5 models
const tabletsDatabase: Record<string, any> = {
  "apple-ipad-m4": {
    name: "Apple iPad Pro M4",
    category: "tablets",
    brand: "apple",
    model: "iPad Pro M4",
    sku: "APPLE-IPADM4-2024",
    warranty: "1 Year Apple Limited Warranty",
    releaseYear: 2024,
    basePrice: "109900.00",
    salePrice: null,
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Apple iPad Pro M4 - Ultimate Tablet",
    metaDescription:
      "iPad Pro M4 with 13-inch OLED display, M4 chip, Apple Pencil Pro support, and all-day battery life.",
    specs: {
      screenSize: "13.0",
      screenResolution: "2752x2064",
      screenType: "OLED Tandem Display",
      refreshRate: 120,
      brightness: 1600,
      ppi: 264,
      chipset: "Apple M4",
      gpu: "10-core GPU",
      cpu: "10-core CPU",
      ramSize: 8,
      storageSize: 256,
      expandableStorage: false,
      rearCamera: "12MP Wide, 10MP Ultrawide",
      frontCamera: "12MP TrueDepth",
      videoRecording: "4K@60fps, ProRes",
      batteryCapacity: 10758,
      chargingSpeed: "40W USB-C",
      batteryLife: "Up to 10 hours",
      weight: "579",
      dimensions: "281.6 x 215.5 x 5.1 mm",
      colors: ["Space Black", "Silver"],
      wifi: "Wi-Fi 6E",
      bluetooth: "5.3",
      cellular: false,
      network5G: false,
      speakers: "4 speakers",
      audioJack: false,
      stylusSupport: true,
      keyboardSupport: true,
      operatingSystem: "iPadOS 18",
    },
  },

  "samsung-galaxy-tab-s10": {
    name: "Samsung Galaxy Tab S10 FE+",
    category: "tablets",
    brand: "samsung",
    model: "Galaxy Tab S10 FE+",
    sku: "SAMSUNG-TABS10FE-2024",
    warranty: "1 Year Samsung India Warranty",
    releaseYear: 2024,
    basePrice: "52999.00",
    salePrice: "47999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Samsung Galaxy Tab S10 FE+ - Premium Mid-Range Tablet",
    metaDescription:
      "Samsung Galaxy Tab S10 FE+ with 12.4-inch display, S Pen included, and long battery life.",
    specs: {
      screenSize: "12.4",
      screenResolution: "2560x1600",
      screenType: "TFT LCD",
      refreshRate: 90,
      brightness: 400,
      ppi: 243,
      chipset: "Exynos 1480",
      gpu: "Xclipse 530",
      cpu: "Octa-core (2.75 GHz)",
      ramSize: 8,
      storageSize: 128,
      expandableStorage: true,
      rearCamera: "8MP + 5MP Ultrawide",
      frontCamera: "12MP",
      videoRecording: "4K@30fps",
      batteryCapacity: 10090,
      chargingSpeed: "45W",
      batteryLife: "Up to 13 hours",
      weight: "627",
      dimensions: "293.8 x 185.4 x 6.9 mm",
      colors: ["Gray", "Mint", "Silver"],
      wifi: "Wi-Fi 6",
      bluetooth: "5.3",
      cellular: false,
      network5G: false,
      speakers: "Quad speakers with Dolby Atmos",
      audioJack: false,
      stylusSupport: true,
      keyboardSupport: true,
      operatingSystem: "Android 14",
    },
  },

  "samsung-galxy-tab-s10-ultra": {
    name: "Samsung Galaxy Tab S10 Ultra",
    category: "tablets",
    brand: "samsung",
    model: "Galaxy Tab S10 Ultra",
    sku: "SAMSUNG-TABS10U-2024",
    warranty: "1 Year Samsung India Warranty",
    releaseYear: 2024,
    basePrice: "119999.00",
    salePrice: null,
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Samsung Galaxy Tab S10 Ultra - Flagship Tablet",
    metaDescription:
      "Samsung Galaxy Tab S10 Ultra with 14.6-inch AMOLED display, Snapdragon 8 Gen 3, and S Pen included.",
    specs: {
      screenSize: "14.6",
      screenResolution: "2960x1848",
      screenType: "Dynamic AMOLED 2X",
      refreshRate: 120,
      brightness: 930,
      ppi: 239,
      chipset: "Snapdragon 8 Gen 3",
      gpu: "Adreno 750",
      cpu: "Octa-core (3.3 GHz)",
      ramSize: 12,
      storageSize: 256,
      expandableStorage: true,
      rearCamera: "13MP + 8MP Ultrawide",
      frontCamera: "12MP + 12MP Ultrawide",
      videoRecording: "4K@60fps",
      batteryCapacity: 11200,
      chargingSpeed: "45W",
      batteryLife: "Up to 14 hours",
      weight: "737",
      dimensions: "326.4 x 208.6 x 5.4 mm",
      colors: ["Graphite", "Platinum", "Gold"],
      wifi: "Wi-Fi 7",
      bluetooth: "5.3",
      cellular: false,
      network5G: false,
      speakers: "Quad speakers with Dolby Atmos",
      audioJack: false,
      stylusSupport: true,
      keyboardSupport: true,
      operatingSystem: "Android 14",
    },
  },

  "lenovo-idea-tab-pro": {
    name: "Lenovo IdeaTab Pro",
    category: "tablets",
    brand: "lenovo",
    model: "IdeaTab Pro 12.7",
    sku: "LENOVO-ITPRO-2024",
    warranty: "1 Year Lenovo Warranty",
    releaseYear: 2024,
    basePrice: "44999.00",
    salePrice: "39999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Lenovo IdeaTab Pro - Entertainment Tablet",
    metaDescription:
      "Lenovo IdeaTab Pro with 12.7-inch 3K display, MediaTek Dimensity 7050, and JBL speakers.",
    specs: {
      screenSize: "12.7",
      screenResolution: "3000x1876",
      screenType: "IPS LCD",
      refreshRate: 144,
      brightness: 400,
      ppi: 297,
      chipset: "MediaTek Dimensity 7050",
      gpu: "Mali-G68 MC4",
      cpu: "Octa-core (2.6 GHz)",
      ramSize: 8,
      storageSize: 256,
      expandableStorage: true,
      rearCamera: "13MP",
      frontCamera: "13MP",
      videoRecording: "4K@30fps",
      batteryCapacity: 10200,
      chargingSpeed: "45W",
      batteryLife: "Up to 12 hours",
      weight: "650",
      dimensions: "293.4 x 190.5 x 6.6 mm",
      colors: ["Storm Grey", "Luna Grey", "Sage"],
      wifi: "Wi-Fi 6",
      bluetooth: "5.3",
      cellular: false,
      network5G: false,
      speakers: "Quad JBL speakers with Dolby Atmos",
      audioJack: false,
      stylusSupport: true,
      keyboardSupport: true,
      operatingSystem: "Android 13",
    },
  },

  "microsoft-surface-pro-tablet": {
    name: "Microsoft Surface Pro 10",
    category: "tablets",
    brand: "microsoft",
    model: "Surface Pro 10",
    sku: "MS-SURFPRO10-2024",
    warranty: "1 Year Microsoft Warranty",
    releaseYear: 2024,
    basePrice: "109999.00",
    salePrice: "104999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Microsoft Surface Pro 10 - 2-in-1 Laptop Tablet",
    metaDescription:
      "Microsoft Surface Pro 10 with Intel Core Ultra, 13-inch PixelSense display, and Windows 11 Pro.",
    specs: {
      screenSize: "13.0",
      screenResolution: "2880x1920",
      screenType: "PixelSense Flow Display",
      refreshRate: 120,
      brightness: 450,
      ppi: 267,
      chipset: "Intel Core Ultra 5 135U",
      gpu: "Intel Graphics",
      cpu: "10-core (1.6 GHz)",
      ramSize: 16,
      storageSize: 512,
      expandableStorage: false,
      rearCamera: "10MP",
      frontCamera: "1080p Windows Hello",
      videoRecording: "4K@30fps",
      batteryCapacity: 53,
      chargingSpeed: "65W Surface Connect",
      batteryLife: "Up to 14 hours",
      weight: "879",
      dimensions: "287 x 209 x 9.3 mm",
      colors: ["Platinum", "Graphite", "Sapphire", "Forest"],
      wifi: "Wi-Fi 6E",
      bluetooth: "5.3",
      cellular: false,
      network5G: false,
      speakers: "2W stereo speakers with Dolby Atmos",
      audioJack: false,
      stylusSupport: true,
      keyboardSupport: true,
      operatingSystem: "Windows 11 Pro",
    },
  },
};

const tabletsFolders = {
  Tablet: "tablets",
};

export async function seedTablets() {
  console.log("📱 Seeding tablets with color variants...\n");

  const allBrands = await db.select().from(brands);
  const brandMap = new Map(allBrands.map((b) => [b.slug, b]));

  for (const [folderName, categorySlug] of Object.entries(tabletsFolders)) {
    console.log(`📁 Processing ${folderName}...`);

    const category = await db.query.categories.findFirst({
      where: eq(categories.slug, categorySlug),
    });

    if (!category) {
      console.log(`  ⚠️  Category not found: ${categorySlug}`);
      continue;
    }

    try {
      const result = await getImagesFromFolder(folderName, 100);

      if (!result.success) {
        console.error(`  ❌ Error fetching images:`, result.error);
        continue;
      }

      console.log(`  🖼️  Found ${result.files.length} images`);

      // Group by model and color
      const groupedByModel = groupTabletsByModel(result.files);
      console.log(
        `  📦 Grouped into ${Object.keys(groupedByModel).length} models\n`
      );

      for (const [modelKey, modelData] of Object.entries(groupedByModel)) {
        const tabletData = tabletsDatabase[modelKey];

        if (!tabletData) {
          console.log(`  ⚠️  No specs found for: ${modelKey} (skipping)`);
          continue;
        }

        const brandId = brandMap.get(tabletData.brand)?.id || null;

        // Get main image (first color variant)
        const firstColor = Object.keys((modelData as any).colors)[0];
        const mainImage = (modelData as any).colors[firstColor][0];

        // Create main product
        const [product] = await db
          .insert(products)
          .values({
            name: tabletData.name,
            slug: `${categorySlug}-${modelKey}`,
            description: `${tabletData.name} featuring ${
              tabletData.specs.chipset
            } processor, ${tabletData.specs.ramSize}GB RAM, ${
              tabletData.specs.storageSize
            }GB storage, and ${tabletData.specs.screenSize}" ${
              tabletData.specs.screenType
            } display with ${tabletData.specs.refreshRate}Hz refresh rate. ${
              tabletData.specs.batteryLife
            } battery life. ${
              tabletData.specs.stylusSupport ? "Stylus support included." : ""
            } ${
              tabletData.specs.keyboardSupport ? "Keyboard compatible." : ""
            }`,
            shortDescription: `${tabletData.specs.chipset}, ${tabletData.specs.ramSize}GB/${tabletData.specs.storageSize}GB, ${tabletData.specs.screenSize}" ${tabletData.specs.refreshRate}Hz`,
            categoryId: category.id,
            brandId,
            productType: "tablet",
            mainImagePath: mainImage.filePath.replace(/^\//, ""),
            basePrice: tabletData.basePrice,
            salePrice: tabletData.salePrice,
            model: tabletData.model,
            sku: tabletData.sku,
            warranty: tabletData.warranty,
            releaseYear: tabletData.releaseYear,
            isActive: true,
            isFeatured: tabletData.isFeatured,
            isNewArrival: tabletData.isNewArrival,
            isBestseller: tabletData.isBestseller,
            stockQuantity: 0, // Stock managed by variants
            metaTitle: tabletData.metaTitle,
            metaDescription: tabletData.metaDescription,
            quickSpecs: {
              chipset: tabletData.specs.chipset,
              ram: `${tabletData.specs.ramSize}GB`,
              storage: `${tabletData.specs.storageSize}GB`,
              screen: `${tabletData.specs.screenSize}" ${tabletData.specs.refreshRate}Hz`,
              battery: `${tabletData.specs.batteryCapacity}mAh`,
              stylus: tabletData.specs.stylusSupport ? "Yes" : "No",
            },
          })
          .returning();

        // Create tablet specifications
        await db.insert(tabletSpecs).values({
          productId: product.id,
          ...tabletData.specs,
        });

        // Create color variants
        let variantIndex = 0;
        for (const [color, images] of Object.entries(
          (modelData as any).colors
        )) {
          const colorImages = images as any[];
          const variantImage = colorImages[0];

          // Create product variant
          await db.insert(productVariants).values({
            productId: product.id,
            variantName: `${tabletData.name} - ${
              color === "default" || color === "fe-plus"
                ? tabletData.specs.colors[0]
                : color.charAt(0).toUpperCase() +
                  color.slice(1).replace(/-/g, " ")
            }`,
            sku: `${tabletData.sku}-${color.toUpperCase().replace(/-/g, "")}`,
            color:
              color === "default" || color === "fe-plus"
                ? tabletData.specs.colors[0]
                : color.charAt(0).toUpperCase() +
                  color.slice(1).replace(/-/g, " "),
            storage: `${tabletData.specs.storageSize}GB`,
            ram: `${tabletData.specs.ramSize}GB`,
            size: null,
            price: tabletData.basePrice,
            salePrice: tabletData.salePrice,
            stockQuantity: 15,
            lowStockThreshold: 3,
            imagePath: variantImage.filePath.replace(/^\//, ""),
            isActive: true,
            isDefault: variantIndex === 0,
          });

          variantIndex++;
        }

        // Create product images (all color variants)
        let imageIndex = 0;
        for (const [color, images] of Object.entries(
          (modelData as any).colors
        )) {
          const colorImages = images as any[];

          for (const file of colorImages) {
            await db.insert(productImages).values({
              productId: product.id,
              imagePath: file.filePath.replace(/^\//, ""),
              imageKitFileId: file.fileId,
              altText: `${tabletData.name} - ${color}`,
              isMainImage: imageIndex === 0,
              displayOrder: imageIndex,
              width: file.width,
              height: file.height,
              imageType: color === "default" ? "front" : `color-${color}`,
            });

            imageIndex++;
          }
        }

        console.log(
          `  ✅ ${tabletData.name} (${
            Object.keys((modelData as any).colors).length
          } colors, ${imageIndex} images)`
        );
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${folderName}:`, error);
    }
  }

  console.log("\n🎉 All tablets seeded successfully!\n");
}

if (require.main === module) {
  seedTablets()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Error:", error);
      process.exit(1);
    });
}
