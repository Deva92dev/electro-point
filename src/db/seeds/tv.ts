/* eslint-disable @typescript-eslint/no-explicit-any */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../index";
import {
  categories,
  brands,
  products,
  tvSpecs,
  productImages,
  productVariants,
} from "../schema";
import { eq } from "drizzle-orm";

import { getImagesFromFolder } from "../utils/imagekit-helper";

// Size-aware grouping function
function groupTVsByModel(files: any[]) {
  const grouped = files.reduce((acc: any, file: any) => {
    const baseName = file.name.replace(/\.(jpg|jpeg|png|webp)$/i, "").trim();

    const sizeMatch = baseName.match(/(\d+)[-\s]?inch/i);
    const size = sizeMatch ? sizeMatch[1] : "unknown";

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

// TVs database - All 6 unique models (merging similar LG models)
const tvsDatabase: Record<string, any> = {
  "sony-4k-ultra-hd-tv-a90k": {
    name: "Sony A90K OLED 4K TV",
    category: "tvs",
    brand: "sony",
    model: "A90K",
    sku: "SONY-A90K-2024",
    warranty: "1 Year Sony India Warranty + 1 Year Panel Warranty",
    releaseYear: 2024,
    basePrice: "119990.00",
    salePrice: "109990.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Sony A90K OLED 4K TV - Premium OLED Television",
    metaDescription:
      "Sony A90K with OLED display, 4K 120Hz, HDMI 2.1, Google TV, and Acoustic Surface Audio+.",
    sizes: ["42", "48", "55", "65"],
    specs: {
      screenResolution: "3840x2160",
      displayTechnology: "OLED",
      refreshRate: 120,
      hdr: true,
      hdrFormats: ["HDR10", "HLG", "Dolby Vision"],
      peakBrightness: 1000,
      contrastRatio: "Infinite",
      viewingAngle: "178°",
      responseTime: "0.1ms",
      smartTV: true,
      operatingSystem: "Google TV",
      voiceAssistant: ["Google Assistant", "Alexa"],
      screenMirroring: true,
      airplaySupport: true,
      chromecastBuiltIn: true,
      processor: "Cognitive Processor XR",
      ram: "4GB",
      storage: "16GB",
      audioOutput: "60W",
      speakers: "Acoustic Surface Audio+",
      audioFormats: ["Dolby Atmos"],
      hdmiPorts: 4,
      hdmiVersion: "HDMI 2.1",
      usbPorts: 3,
      ethernetPort: true,
      opticalAudioOut: true,
      headphoneJack: false,
      wifi: "Wi-Fi 5",
      bluetooth: "4.2",
      gamingMode: true,
      vrr: true,
      allm: true,
      freesync: false,
      gsync: false,
      dimensions: "Varies by size",
      dimensionsWithStand: "Varies by size",
      bezels: "Ultra-slim",
      standType: "Center stand",
      vesaMountSupport: "300x300mm",
      colors: ["Black"],
      powerConsumption: "Varies by size",
      energyRating: "A",
      ambientMode: false,
      pictureInPicture: true,
      usbRecording: false,
      timeshift: false,
      builtInTuner: "DVB-T2/C/S2",
      panelWarranty: "1 Year",
      features: [
        "XR OLED Contrast Pro",
        "XR Triluminos Pro",
        "Perfect for PS5",
        "Acoustic Surface Audio+",
      ],
    },
  },

  "lg-oled-evo": {
    name: "LG OLED Evo C3",
    category: "tvs",
    brand: "lg",
    model: "OLED Evo C3",
    sku: "LG-OLEDC3-2024",
    warranty: "1 Year LG Comprehensive Warranty + 1 Year Panel Warranty",
    releaseYear: 2024,
    basePrice: "134990.00",
    salePrice: "124990.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "LG OLED Evo C3 - Self-Lit OLED 4K TV",
    metaDescription:
      "LG OLED Evo C3 with Brightness Booster, α9 AI Processor Gen6, 4K 120Hz, and webOS 23.",
    sizes: ["48", "55", "65", "77", "83"],
    specs: {
      screenResolution: "3840x2160",
      displayTechnology: "OLED Evo",
      refreshRate: 120,
      hdr: true,
      hdrFormats: ["HDR10", "HLG", "Dolby Vision IQ"],
      peakBrightness: 1000,
      contrastRatio: "Infinite",
      viewingAngle: "178°",
      responseTime: "0.1ms",
      smartTV: true,
      operatingSystem: "webOS 23",
      voiceAssistant: ["Google Assistant", "Alexa"],
      screenMirroring: true,
      airplaySupport: true,
      chromecastBuiltIn: false,
      processor: "α9 AI Processor Gen6",
      ram: "4GB",
      storage: "8GB",
      audioOutput: "40W",
      speakers: "2.2 Channel",
      audioFormats: ["Dolby Atmos"],
      hdmiPorts: 4,
      hdmiVersion: "HDMI 2.1",
      usbPorts: 3,
      ethernetPort: true,
      opticalAudioOut: true,
      headphoneJack: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.0",
      gamingMode: true,
      vrr: true,
      allm: true,
      freesync: true,
      gsync: true,
      dimensions: "Varies by size",
      dimensionsWithStand: "Varies by size",
      bezels: "Near-borderless",
      standType: "Center stand",
      vesaMountSupport: "300x200mm",
      colors: ["Black"],
      powerConsumption: "Varies by size",
      energyRating: "A",
      ambientMode: false,
      pictureInPicture: true,
      usbRecording: true,
      timeshift: true,
      builtInTuner: "DVB-T2/C/S2",
      panelWarranty: "1 Year",
      features: [
        "Brightness Booster",
        "AI Picture Pro",
        "AI Sound Pro",
        "Game Optimizer",
      ],
    },
  },

  "lg-oled-evo-g4": {
    name: "LG OLED Evo G4",
    category: "tvs",
    brand: "lg",
    model: "OLED Evo G4",
    sku: "LG-OLEDG4-2024",
    warranty: "1 Year LG Comprehensive Warranty + 1 Year Panel Warranty",
    releaseYear: 2024,
    basePrice: "299990.00",
    salePrice: null,
    isNewArrival: true,
    isBestseller: false,
    isFeatured: true,
    metaTitle: "LG OLED Evo G4 - Flagship OLED Gallery TV",
    metaDescription:
      "LG OLED Evo G4 flagship with α11 AI Processor, Micro Lens Array+, 144Hz, and One Wall Design.",
    sizes: ["55", "65", "77", "83"],
    specs: {
      screenResolution: "3840x2160",
      displayTechnology: "OLED Evo",
      refreshRate: 144,
      hdr: true,
      hdrFormats: ["HDR10", "HLG", "Dolby Vision IQ"],
      peakBrightness: 1500,
      contrastRatio: "Infinite",
      viewingAngle: "178°",
      responseTime: "0.03ms",
      smartTV: true,
      operatingSystem: "webOS 24",
      voiceAssistant: ["Google Assistant", "Alexa"],
      screenMirroring: true,
      airplaySupport: true,
      chromecastBuiltIn: false,
      processor: "α11 AI Processor",
      ram: "8GB",
      storage: "16GB",
      audioOutput: "60W",
      speakers: "4.2 Channel",
      audioFormats: ["Dolby Atmos"],
      hdmiPorts: 4,
      hdmiVersion: "HDMI 2.1",
      usbPorts: 3,
      ethernetPort: true,
      opticalAudioOut: true,
      headphoneJack: false,
      wifi: "Wi-Fi 6E",
      bluetooth: "5.3",
      gamingMode: true,
      vrr: true,
      allm: true,
      freesync: true,
      gsync: true,
      dimensions: "Varies by size",
      dimensionsWithStand: "Varies by size",
      bezels: "Zero-bezel One Wall Design",
      standType: "Slim One Wall Mount",
      vesaMountSupport: "300x200mm",
      colors: ["Black"],
      powerConsumption: "Varies by size",
      energyRating: "A",
      ambientMode: true,
      pictureInPicture: true,
      usbRecording: true,
      timeshift: true,
      builtInTuner: "DVB-T2/C/S2",
      panelWarranty: "1 Year",
      features: [
        "Micro Lens Array+",
        "α11 AI Processor",
        "144Hz refresh rate",
        "One Wall Design",
      ],
    },
  },

  "samsung-class-qled-8qf-4k-uhd-tv": {
    name: "Samsung Q80F QLED 4K TV",
    category: "tvs",
    brand: "samsung",
    model: "Q80F",
    sku: "SAMSUNG-Q80F-2024",
    warranty: "1 Year Samsung Comprehensive Warranty",
    releaseYear: 2024,
    basePrice: "84990.00",
    salePrice: "74990.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Samsung Q80F QLED 4K TV - Premium QLED Television",
    metaDescription:
      "Samsung Q80F QLED with Quantum Processor 4K, 120Hz, HDMI 2.1, and Tizen Smart TV.",
    sizes: ["43", "50", "55", "65", "75"],
    specs: {
      screenResolution: "3840x2160",
      displayTechnology: "QLED",
      refreshRate: 120,
      hdr: true,
      hdrFormats: ["HDR10", "HDR10+", "HLG"],
      peakBrightness: 1200,
      contrastRatio: "5000:1",
      viewingAngle: "Wide",
      responseTime: "6.5ms",
      smartTV: true,
      operatingSystem: "Tizen",
      voiceAssistant: ["Bixby", "Alexa", "Google Assistant"],
      screenMirroring: true,
      airplaySupport: true,
      chromecastBuiltIn: false,
      processor: "Quantum Processor 4K",
      ram: "3GB",
      storage: "8GB",
      audioOutput: "60W",
      speakers: "Object Tracking Sound+",
      audioFormats: ["Dolby Atmos"],
      hdmiPorts: 4,
      hdmiVersion: "HDMI 2.1",
      usbPorts: 2,
      ethernetPort: true,
      opticalAudioOut: true,
      headphoneJack: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.2",
      gamingMode: true,
      vrr: true,
      allm: true,
      freesync: true,
      gsync: false,
      dimensions: "Varies by size",
      dimensionsWithStand: "Varies by size",
      bezels: "Slim",
      standType: "Center stand",
      vesaMountSupport: "200x200mm / 400x400mm",
      colors: ["Titan Gray"],
      powerConsumption: "Varies by size",
      energyRating: "A",
      ambientMode: true,
      pictureInPicture: true,
      usbRecording: true,
      timeshift: true,
      builtInTuner: "DVB-T2/C/S2",
      panelWarranty: "1 Year",
      features: [
        "Quantum HDR",
        "Motion Xcelerator Turbo+",
        "Gaming Hub",
        "Q-Symphony",
      ],
    },
  },

  "samsung-class-qled-8q60b-4k-uhd-tv": {
    name: "Samsung Q60B QLED 4K TV",
    category: "tvs",
    brand: "samsung",
    model: "Q60B",
    sku: "SAMSUNG-Q60B-2023",
    warranty: "1 Year Samsung Comprehensive Warranty",
    releaseYear: 2023,
    basePrice: "54990.00",
    salePrice: "47990.00",
    isNewArrival: false,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Samsung Q60B QLED 4K TV - Affordable QLED",
    metaDescription:
      "Samsung Q60B QLED with Quantum Processor Lite 4K, 60Hz, and Smart Hub.",
    sizes: ["43", "50", "55", "65"],
    specs: {
      screenResolution: "3840x2160",
      displayTechnology: "QLED",
      refreshRate: 60,
      hdr: true,
      hdrFormats: ["HDR10", "HDR10+", "HLG"],
      peakBrightness: 500,
      contrastRatio: "4000:1",
      viewingAngle: "Standard",
      responseTime: "9.5ms",
      smartTV: true,
      operatingSystem: "Tizen",
      voiceAssistant: ["Bixby", "Alexa"],
      screenMirroring: true,
      airplaySupport: true,
      chromecastBuiltIn: false,
      processor: "Quantum Processor Lite 4K",
      ram: "2GB",
      storage: "8GB",
      audioOutput: "20W",
      speakers: "2 Channel",
      audioFormats: ["Dolby Digital Plus"],
      hdmiPorts: 3,
      hdmiVersion: "HDMI 2.0",
      usbPorts: 2,
      ethernetPort: true,
      opticalAudioOut: true,
      headphoneJack: false,
      wifi: "Wi-Fi 5",
      bluetooth: "5.2",
      gamingMode: false,
      vrr: false,
      allm: false,
      freesync: false,
      gsync: false,
      dimensions: "Varies by size",
      dimensionsWithStand: "Varies by size",
      bezels: "3-sided bezel-less",
      standType: "Center stand",
      vesaMountSupport: "200x200mm",
      colors: ["Titan Gray"],
      powerConsumption: "Varies by size",
      energyRating: "A",
      ambientMode: true,
      pictureInPicture: false,
      usbRecording: true,
      timeshift: false,
      builtInTuner: "DVB-T2/C/S2",
      panelWarranty: "1 Year",
      features: ["Quantum HDR", "Smart Hub", "OTS Lite", "Adaptive Sound"],
    },
  },

  "vizio-quantum-pro-4k-120hz-qled": {
    name: "Vizio Quantum Pro QLED 4K TV",
    category: "tvs",
    brand: "vizio",
    model: "Quantum Pro",
    sku: "VIZIO-QPRO-2024",
    warranty: "1 Year Vizio Warranty",
    releaseYear: 2024,
    basePrice: "64990.00",
    salePrice: "59990.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: false,
    metaTitle: "Vizio Quantum Pro QLED 4K TV - High Performance QLED",
    metaDescription:
      "Vizio Quantum Pro with 120Hz, HDMI 2.1, ProGaming Engine, and SmartCast.",
    sizes: ["43", "50", "55", "65", "75"],
    specs: {
      screenResolution: "3840x2160",
      displayTechnology: "QLED",
      refreshRate: 120,
      hdr: true,
      hdrFormats: ["HDR10", "HDR10+", "HLG", "Dolby Vision"],
      peakBrightness: 1000,
      contrastRatio: "5000:1",
      viewingAngle: "Wide",
      responseTime: "6ms",
      smartTV: true,
      operatingSystem: "SmartCast",
      voiceAssistant: ["Google Assistant", "Alexa"],
      screenMirroring: true,
      airplaySupport: true,
      chromecastBuiltIn: true,
      processor: "IQ Ultra Processor",
      ram: "3GB",
      storage: "16GB",
      audioOutput: "30W",
      speakers: "2.1 Channel",
      audioFormats: ["Dolby Atmos", "DTS:X"],
      hdmiPorts: 4,
      hdmiVersion: "HDMI 2.1",
      usbPorts: 2,
      ethernetPort: true,
      opticalAudioOut: true,
      headphoneJack: false,
      wifi: "Wi-Fi 6",
      bluetooth: "5.1",
      gamingMode: true,
      vrr: true,
      allm: true,
      freesync: true,
      gsync: false,
      dimensions: "Varies by size",
      dimensionsWithStand: "Varies by size",
      bezels: "Bezel-less",
      standType: "V-shaped feet",
      vesaMountSupport: "300x300mm",
      colors: ["Black"],
      powerConsumption: "Varies by size",
      energyRating: "Energy Star",
      ambientMode: false,
      pictureInPicture: false,
      usbRecording: false,
      timeshift: false,
      builtInTuner: "ATSC 3.0",
      panelWarranty: "1 Year",
      features: [
        "ProGaming Engine",
        "Active Full Array",
        "UltraBright 1000",
        "Game Menu",
      ],
    },
  },
};

const tvsFolders = {
  TVs: "tvs",
};

export async function seedTVs() {
  console.log("📺 Seeding TVs with size variants...\n");

  const allBrands = await db.select().from(brands);
  const brandMap = new Map(allBrands.map((b) => [b.slug, b]));

  for (const [folderName, categorySlug] of Object.entries(tvsFolders)) {
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

      // Group by model and size
      const groupedByModel = groupTVsByModel(result.files);
      console.log(
        `  📦 Grouped into ${Object.keys(groupedByModel).length} models\n`
      );

      for (const [modelKey, modelData] of Object.entries(groupedByModel)) {
        const tvData = tvsDatabase[modelKey];

        if (!tvData) {
          console.log(`  ⚠️  No specs found for: ${modelKey} (skipping)`);
          continue;
        }

        const brandId = brandMap.get(tvData.brand)?.id || null;

        // Get main image (first size variant)
        const firstSize = Object.keys((modelData as any).sizes)[0];
        const mainImage = (modelData as any).sizes[firstSize][0];

        // Create main product
        const [product] = await db
          .insert(products)
          .values({
            name: tvData.name,
            slug: `${categorySlug}-${modelKey}`,
            description: `${tvData.name} ${
              tvData.specs.displayTechnology
            } television featuring ${
              tvData.specs.screenResolution
            } 4K resolution, ${tvData.specs.refreshRate}Hz refresh rate, and ${
              tvData.specs.operatingSystem
            } Smart TV platform. ${
              tvData.specs.hdr
                ? `Supports ${tvData.specs.hdrFormats.join(", ")} HDR formats`
                : ""
            }. ${
              tvData.specs.audioFormats
                ? `${tvData.specs.audioFormats.join(", ")} audio support`
                : ""
            }. ${
              tvData.specs.gamingMode
                ? "Gaming features with VRR, ALLM, and low latency mode."
                : ""
            } Available in multiple sizes.`,
            shortDescription: `${tvData.specs.displayTechnology} 4K ${tvData.specs.refreshRate}Hz, ${tvData.specs.operatingSystem}, ${tvData.specs.audioOutput}`,
            categoryId: category.id,
            brandId,
            productType: "tv",
            mainImagePath: mainImage.filePath.replace(/^\//, ""),
            basePrice: tvData.basePrice,
            salePrice: tvData.salePrice,
            model: tvData.model,
            sku: tvData.sku,
            warranty: tvData.warranty,
            releaseYear: tvData.releaseYear,
            isActive: true,
            isFeatured: tvData.isFeatured,
            isNewArrival: tvData.isNewArrival,
            isBestseller: tvData.isBestseller,
            stockQuantity: 0, // Stock managed by variants
            metaTitle: tvData.metaTitle,
            metaDescription: tvData.metaDescription,
            quickSpecs: {
              display: tvData.specs.displayTechnology,
              resolution: "4K UHD",
              refreshRate: `${tvData.specs.refreshRate}Hz`,
              hdr: tvData.specs.hdr ? "Yes" : "No",
              smartTV: tvData.specs.operatingSystem,
              audio: tvData.specs.audioOutput,
            },
          })
          .returning();

        // Create TV specifications
        await db.insert(tvSpecs).values({
          productId: product.id,
          screenSize: null, // Size varies by variant
          ...tvData.specs,
        });

        // Create size variants
        let variantIndex = 0;
        for (const [size, images] of Object.entries((modelData as any).sizes)) {
          const sizeImages = images as any[];
          const variantImage = sizeImages[0];

          // Calculate price based on size (simple multiplier)
          const basePriceNum = parseFloat(tvData.basePrice);
          const sizeNum = parseInt(size);
          const sizeFactor = sizeNum / 43; // 43" as base
          const variantPrice = (basePriceNum * sizeFactor).toFixed(2);
          const variantSalePrice = tvData.salePrice
            ? (parseFloat(tvData.salePrice) * sizeFactor).toFixed(2)
            : null;

          // Create product variant
          await db.insert(productVariants).values({
            productId: product.id,
            variantName: `${tvData.name} - ${size}"`,
            sku: `${tvData.sku}-${size}IN`,
            color: null,
            storage: null,
            ram: null,
            size: `${size}"`,
            price: variantPrice,
            salePrice: variantSalePrice,
            stockQuantity: 10,
            lowStockThreshold: 2,
            imagePath: variantImage.filePath.replace(/^\//, ""),
            isActive: true,
            isDefault: variantIndex === 0,
          });

          variantIndex++;
        }

        // Create product images (all size variants)
        let imageIndex = 0;
        for (const [size, images] of Object.entries((modelData as any).sizes)) {
          const sizeImages = images as any[];

          for (const file of sizeImages) {
            await db.insert(productImages).values({
              productId: product.id,
              imagePath: file.filePath.replace(/^\//, ""),
              imageKitFileId: file.fileId,
              altText: `${tvData.name} - ${size}"`,
              isMainImage: imageIndex === 0,
              displayOrder: imageIndex,
              width: file.width,
              height: file.height,
              imageType: `size-${size}`,
            });

            imageIndex++;
          }
        }

        console.log(
          `  ✅ ${tvData.name} (${
            Object.keys((modelData as any).sizes).length
          } sizes, ${imageIndex} images)`
        );
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${folderName}:`, error);
    }
  }

  console.log("\n🎉 All TVs seeded successfully!\n");
}

if (require.main === module) {
  seedTVs()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Error:", error);
      process.exit(1);
    });
}
