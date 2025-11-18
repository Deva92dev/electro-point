/* eslint-disable @typescript-eslint/no-explicit-any */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../index";
import {
  categories,
  brands,
  products,
  smartwatchSpecs,
  productImages,
  productVariants,
} from "../schema";
import { eq } from "drizzle-orm";

import { getImagesFromFolder } from "../utils/imagekit-helper";

// Color-aware grouping function
function groupSmartwatchesByModel(files: any[]) {
  const grouped = files.reduce((acc: any, file: any) => {
    const baseName = file.name.replace(/\.(jpg|jpeg|png|webp)$/i, "").trim();

    const colorMatch = baseName.match(
      /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|orange|brown|sky|multi|light[-\s]?blue|light[-\s]?green|light[-\s]?brown|2nd[-\s]?gen)$/i
    );
    const color = colorMatch
      ? colorMatch[1].toLowerCase().replace(/[-\s]/g, "-")
      : "default";

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

// Smartwatches database - All 6 models
const smartwatchesDatabase: Record<string, any> = {
  "apple-wtach-se-2nd-gen": {
    name: "Apple Watch SE (2nd Gen)",
    category: "smartwatches",
    brand: "apple",
    model: "Watch SE 2nd Gen",
    sku: "APPLE-WATCHSE2-2024",
    warranty: "1 Year Apple Limited Warranty",
    releaseYear: 2024,
    basePrice: "29900.00",
    salePrice: null,
    isNewArrival: false,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Apple Watch SE (2nd Gen) - Affordable Apple Watch",
    metaDescription:
      "Apple Watch SE with Retina display, fitness tracking, crash detection, and watchOS 11.",
    specs: {
      screenSize: "1.78",
      screenResolution: "448x368",
      screenType: "Retina LTPO OLED",
      alwaysOnDisplay: false,
      touchscreen: true,
      caseSize: "40mm / 44mm",
      caseMaterial: "Aluminum",
      bandMaterial: "Sport Band / Sport Loop",
      weight: "32.9",
      waterResistance: "50m (WR50)",
      colors: ["Midnight", "Starlight", "Silver", "Storm Blue", "Winter"],
      chipset: "Apple S8 SiP",
      ram: "1GB",
      storage: "32GB",
      batteryLife: "Up to 18 hours",
      chargingTime: "1.5 hours",
      wirelessCharging: true,
      heartRateMonitor: true,
      ecg: false,
      bloodOxygen: false,
      bloodPressure: false,
      sleepTracking: true,
      stressMonitoring: false,
      bodyTemperature: false,
      stepCounter: true,
      calorieTracking: true,
      distanceTracking: true,
      workoutModes: 90,
      gps: true,
      bluetooth: "5.3",
      wifi: true,
      cellular: false,
      nfc: true,
      voiceAssistant: "Siri",
      notificationSupport: true,
      callSupport: false,
      musicStorage: true,
      compatibleWithIOS: true,
      compatibleWithAndroid: false,
      operatingSystem: "watchOS 11",
    },
  },

  "apple-wtach-ultra2": {
    name: "Apple Watch Ultra 2",
    category: "smartwatches",
    brand: "apple",
    model: "Watch Ultra 2",
    sku: "APPLE-WATCHULTRA2-2024",
    warranty: "1 Year Apple Limited Warranty",
    releaseYear: 2024,
    basePrice: "89900.00",
    salePrice: null,
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Apple Watch Ultra 2 - Ultimate Adventure Watch",
    metaDescription:
      "Apple Watch Ultra 2 with titanium case, brightest display, precision dual-frequency GPS, and up to 36-hour battery.",
    specs: {
      screenSize: "1.93",
      screenResolution: "502x410",
      screenType: "Retina LTPO OLED",
      alwaysOnDisplay: true,
      touchscreen: true,
      caseSize: "49mm",
      caseMaterial: "Titanium",
      bandMaterial: "Alpine Loop / Ocean Band / Trail Loop",
      weight: "61.4",
      waterResistance: "100m (WR100)",
      colors: ["Natural", "Blue", "Orange", "Starlight", "Green", "Indigo"],
      chipset: "Apple S9 SiP",
      ram: "1GB",
      storage: "64GB",
      batteryLife: "Up to 36 hours (72 with Low Power)",
      chargingTime: "1.5 hours",
      wirelessCharging: true,
      heartRateMonitor: true,
      ecg: true,
      bloodOxygen: true,
      bloodPressure: false,
      sleepTracking: true,
      stressMonitoring: false,
      bodyTemperature: true,
      stepCounter: true,
      calorieTracking: true,
      distanceTracking: true,
      workoutModes: 90,
      gps: true,
      bluetooth: "5.3",
      wifi: true,
      cellular: true,
      nfc: true,
      voiceAssistant: "Siri",
      notificationSupport: true,
      callSupport: true,
      musicStorage: true,
      compatibleWithIOS: true,
      compatibleWithAndroid: false,
      operatingSystem: "watchOS 11",
    },
  },

  "google-pixel-watch-3": {
    name: "Google Pixel Watch 3",
    category: "smartwatches",
    brand: "google-pixel",
    model: "Pixel Watch 3",
    sku: "GOOGLE-PIXWATCH3-2024",
    warranty: "1 Year Google Warranty",
    releaseYear: 2024,
    basePrice: "39999.00",
    salePrice: "36999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Google Pixel Watch 3 - Smart Fitness Watch",
    metaDescription:
      "Pixel Watch 3 with Fitbit integration, advanced health tracking, and Wear OS 5 by Google.",
    specs: {
      screenSize: "1.4",
      screenResolution: "456x456",
      screenType: "AMOLED",
      alwaysOnDisplay: true,
      touchscreen: true,
      caseSize: "41mm / 45mm",
      caseMaterial: "Aluminum / Stainless Steel",
      bandMaterial: "Active Sport Band",
      weight: "37",
      waterResistance: "5ATM + IP68",
      colors: ["Obsidian", "Porcelain", "Hazel"],
      chipset: "Qualcomm SW5100",
      ram: "2GB",
      storage: "32GB",
      batteryLife: "Up to 24 hours (36 with Battery Saver)",
      chargingTime: "75 minutes",
      wirelessCharging: true,
      heartRateMonitor: true,
      ecg: true,
      bloodOxygen: true,
      bloodPressure: false,
      sleepTracking: true,
      stressMonitoring: true,
      bodyTemperature: true,
      stepCounter: true,
      calorieTracking: true,
      distanceTracking: true,
      workoutModes: 40,
      gps: true,
      bluetooth: "5.0",
      wifi: true,
      cellular: true,
      nfc: true,
      voiceAssistant: "Google Assistant",
      notificationSupport: true,
      callSupport: true,
      musicStorage: true,
      compatibleWithIOS: true,
      compatibleWithAndroid: true,
      operatingSystem: "Wear OS 5",
    },
  },

  "samsung-galaxy-watch-7": {
    name: "Samsung Galaxy Watch 7",
    category: "smartwatches",
    brand: "samsung",
    model: "Galaxy Watch 7",
    sku: "SAMSUNG-GW7-2024",
    warranty: "1 Year Samsung India Warranty",
    releaseYear: 2024,
    basePrice: "29999.00",
    salePrice: "27999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Samsung Galaxy Watch 7 - AI Powered Smartwatch",
    metaDescription:
      "Galaxy Watch 7 with Galaxy AI, advanced health monitoring, and 40mm/44mm sizes.",
    specs: {
      screenSize: "1.3",
      screenResolution: "432x432",
      screenType: "Super AMOLED",
      alwaysOnDisplay: true,
      touchscreen: true,
      caseSize: "40mm / 44mm",
      caseMaterial: "Armor Aluminum",
      bandMaterial: "Sport Band",
      weight: "33.8",
      waterResistance: "5ATM + IP68",
      colors: ["Green", "Cream", "Silver"],
      chipset: "Exynos W1000 (3nm)",
      ram: "2GB",
      storage: "32GB",
      batteryLife: "Up to 30 hours (40mm) / 40 hours (44mm)",
      chargingTime: "80 minutes",
      wirelessCharging: true,
      heartRateMonitor: true,
      ecg: true,
      bloodOxygen: true,
      bloodPressure: true,
      sleepTracking: true,
      stressMonitoring: true,
      bodyTemperature: true,
      stepCounter: true,
      calorieTracking: true,
      distanceTracking: true,
      workoutModes: 100,
      gps: true,
      bluetooth: "5.3",
      wifi: true,
      cellular: false,
      nfc: true,
      voiceAssistant: "Bixby / Google Assistant",
      notificationSupport: true,
      callSupport: false,
      musicStorage: true,
      compatibleWithIOS: false,
      compatibleWithAndroid: true,
      operatingSystem: "Wear OS 5 (One UI Watch 6)",
    },
  },

  "fitbit-sense-2": {
    name: "Fitbit Sense 2",
    category: "smartwatches",
    brand: "fitbit",
    model: "Sense 2",
    sku: "FITBIT-SENSE2-2024",
    warranty: "1 Year Fitbit Warranty",
    releaseYear: 2024,
    basePrice: "24999.00",
    salePrice: "21999.00",
    isNewArrival: false,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Fitbit Sense 2 - Advanced Health Smartwatch",
    metaDescription:
      "Fitbit Sense 2 with stress management, ECG, skin temperature, and 6+ day battery life.",
    specs: {
      screenSize: "1.58",
      screenResolution: "336x336",
      screenType: "AMOLED",
      alwaysOnDisplay: true,
      touchscreen: true,
      caseSize: "40.48mm",
      caseMaterial: "Aluminum",
      bandMaterial: "Infinity Band",
      weight: "37.64",
      waterResistance: "5ATM",
      colors: ["Graphite", "Lunar White", "Soft Gold"],
      chipset: "Custom Fitbit",
      ram: "N/A",
      storage: "4GB",
      batteryLife: "6+ days",
      chargingTime: "2 hours",
      wirelessCharging: false,
      heartRateMonitor: true,
      ecg: true,
      bloodOxygen: true,
      bloodPressure: false,
      sleepTracking: true,
      stressMonitoring: true,
      bodyTemperature: true,
      stepCounter: true,
      calorieTracking: true,
      distanceTracking: true,
      workoutModes: 40,
      gps: true,
      bluetooth: "5.0",
      wifi: false,
      cellular: false,
      nfc: true,
      voiceAssistant: "Google Assistant / Alexa",
      notificationSupport: true,
      callSupport: false,
      musicStorage: false,
      compatibleWithIOS: true,
      compatibleWithAndroid: true,
      operatingSystem: "Fitbit OS",
    },
  },

  "motorola-moto-watch-120": {
    name: "Motorola Moto Watch 120",
    category: "smartwatches",
    brand: "motorola",
    model: "Moto Watch 120",
    sku: "MOTO-WATCH120-2024",
    warranty: "1 Year Motorola Warranty",
    releaseYear: 2024,
    basePrice: "4999.00",
    salePrice: "3999.00",
    isNewArrival: false,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Motorola Moto Watch 120 - Budget Smartwatch",
    metaDescription:
      "Moto Watch 120 with 1.85-inch display, 120+ watch faces, IP68 rating, and 10-day battery.",
    specs: {
      screenSize: "1.85",
      screenResolution: "240x284",
      screenType: "TFT LCD",
      alwaysOnDisplay: false,
      touchscreen: true,
      caseSize: "46mm",
      caseMaterial: "Plastic",
      bandMaterial: "Silicone",
      weight: "45",
      waterResistance: "IP68",
      colors: ["Black", "Phantom Blue"],
      chipset: "Proprietary",
      ram: "N/A",
      storage: "N/A",
      batteryLife: "Up to 10 days",
      chargingTime: "2.5 hours",
      wirelessCharging: false,
      heartRateMonitor: true,
      ecg: false,
      bloodOxygen: true,
      bloodPressure: false,
      sleepTracking: true,
      stressMonitoring: false,
      bodyTemperature: false,
      stepCounter: true,
      calorieTracking: true,
      distanceTracking: true,
      workoutModes: 100,
      gps: false,
      bluetooth: "5.1",
      wifi: false,
      cellular: false,
      nfc: false,
      voiceAssistant: null,
      notificationSupport: true,
      callSupport: false,
      musicStorage: false,
      compatibleWithIOS: true,
      compatibleWithAndroid: true,
      operatingSystem: "Proprietary OS",
    },
  },
};

const smartwatchesFolders = {
  Smartwatch: "smart-watches",
};

export async function seedSmartwatches() {
  console.log("⌚ Seeding smartwatches with color variants...\n");

  const allBrands = await db.select().from(brands);
  const brandMap = new Map(allBrands.map((b) => [b.slug, b]));

  for (const [folderName, categorySlug] of Object.entries(
    smartwatchesFolders
  )) {
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
      const groupedByModel = groupSmartwatchesByModel(result.files);
      console.log(
        `  📦 Grouped into ${Object.keys(groupedByModel).length} models\n`
      );

      for (const [modelKey, modelData] of Object.entries(groupedByModel)) {
        const smartwatchData = smartwatchesDatabase[modelKey];

        if (!smartwatchData) {
          console.log(`  ⚠️  No specs found for: ${modelKey} (skipping)`);
          continue;
        }

        const brandId = brandMap.get(smartwatchData.brand)?.id || null;

        // Get main image (first color variant)
        const firstColor = Object.keys((modelData as any).colors)[0];
        const mainImage = (modelData as any).colors[firstColor][0];

        // Create main product
        const [product] = await db
          .insert(products)
          .values({
            name: smartwatchData.name,
            slug: `${categorySlug}-${modelKey}`,
            description: `${smartwatchData.name} smartwatch featuring ${
              smartwatchData.specs.screenSize
            }" ${smartwatchData.specs.screenType} display, ${
              smartwatchData.specs.caseSize
            } ${smartwatchData.specs.caseMaterial} case, and ${
              smartwatchData.specs.batteryLife
            } battery life. ${
              smartwatchData.specs.heartRateMonitor
                ? "Heart rate monitoring"
                : ""
            }, ${
              smartwatchData.specs.gps ? "Built-in GPS" : "Connected GPS"
            }, ${smartwatchData.specs.workoutModes}+ workout modes. ${
              smartwatchData.specs.waterResistance
            } water resistance. Runs ${smartwatchData.specs.operatingSystem}.`,
            shortDescription: `${smartwatchData.specs.screenSize}" ${smartwatchData.specs.screenType}, ${smartwatchData.specs.batteryLife}, ${smartwatchData.specs.workoutModes}+ modes`,
            categoryId: category.id,
            brandId,
            productType: "smartwatch",
            mainImagePath: mainImage.filePath.replace(/^\//, ""),
            basePrice: smartwatchData.basePrice,
            salePrice: smartwatchData.salePrice,
            model: smartwatchData.model,
            sku: smartwatchData.sku,
            warranty: smartwatchData.warranty,
            releaseYear: smartwatchData.releaseYear,
            isActive: true,
            isFeatured: smartwatchData.isFeatured,
            isNewArrival: smartwatchData.isNewArrival,
            isBestseller: smartwatchData.isBestseller,
            stockQuantity: 0, // Stock managed by variants
            metaTitle: smartwatchData.metaTitle,
            metaDescription: smartwatchData.metaDescription,
            quickSpecs: {
              display: `${smartwatchData.specs.screenSize}" ${smartwatchData.specs.screenType}`,
              caseSize: smartwatchData.specs.caseSize,
              battery: smartwatchData.specs.batteryLife,
              gps: smartwatchData.specs.gps ? "Yes" : "No",
              waterResistance: smartwatchData.specs.waterResistance,
              workoutModes: smartwatchData.specs.workoutModes,
            },
          })
          .returning();

        // Create smartwatch specifications
        await db.insert(smartwatchSpecs).values({
          productId: product.id,
          ...smartwatchData.specs,
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
            variantName: `${smartwatchData.name} - ${
              color === "default" || color === "2nd-gen"
                ? smartwatchData.specs.colors[0]
                : color.charAt(0).toUpperCase() +
                  color.slice(1).replace(/-/g, " ")
            }`,
            sku: `${smartwatchData.sku}-${color
              .toUpperCase()
              .replace(/-/g, "")}`,
            color:
              color === "default" || color === "2nd-gen"
                ? smartwatchData.specs.colors[0]
                : color.charAt(0).toUpperCase() +
                  color.slice(1).replace(/-/g, " "),
            storage: null,
            ram: null,
            size: smartwatchData.specs.caseSize,
            price: smartwatchData.basePrice,
            salePrice: smartwatchData.salePrice,
            stockQuantity: 20,
            lowStockThreshold: 5,
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
              altText: `${smartwatchData.name} - ${color}`,
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
          `  ✅ ${smartwatchData.name} (${
            Object.keys((modelData as any).colors).length
          } colors, ${imageIndex} images)`
        );
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${folderName}:`, error);
    }
  }

  console.log("\n🎉 All smartwatches seeded successfully!\n");
}

if (require.main === module) {
  seedSmartwatches()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Error:", error);
      process.exit(1);
    });
}
