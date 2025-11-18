/* eslint-disable @typescript-eslint/no-explicit-any */

import * as dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import { db } from "../index";
import {
  categories,
  brands,
  products,
  smartphoneSpecs,
  productImages,
  productVariants,
} from "../schema";
import { eq } from "drizzle-orm";

import { getImagesFromFolder } from "../utils/imagekit-helper";

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

// Smartphone database - 7 models
const smartphoneDatabase: Record<string, any> = {
  "sony-xperia1-vi": {
    name: "Sony Xperia 1 VI",
    category: "smartphones",
    brand: "sony",
    model: "Xperia 1 VI",
    sku: "SONY-XPERIA1-VI-2024",
    warranty: "1 Year Sony India Warranty",
    releaseYear: 2024,
    basePrice: "99999.00",
    salePrice: null,
    isNewArrival: true,
    isBestseller: false,
    isFeatured: false,
    metaTitle: "Sony Xperia 1 VI - Premium Flagship Smartphone",
    metaDescription:
      "Sony Xperia 1 VI with 6.5-inch 4K OLED display, Snapdragon 8 Gen 3, triple camera system, and premium design.",
    specs: {
      screenSize: "6.5",
      screenResolution: "3840x1644",
      screenType: "4K OLED",
      refreshRate: 120,
      peakBrightness: 1300,
      ppi: 643,
      protectionGlass: "Gorilla Glass Victus 2",
      hdr: true,
      alwaysOnDisplay: true,
      chipset: "Snapdragon 8 Gen 3",
      gpu: "Adreno 750",
      cpu: "Octa-core (3.3 GHz)",
      ramSize: 12,
      ramType: "LPDDR5X",
      storageSize: 256,
      storageType: "UFS 4.0",
      expandableStorage: true,
      maxStorageExpansion: 1024,
      rearCameraMain: "48MP f/1.9",
      rearCameraUltrawide: "12MP f/2.2",
      rearCameraTelephoto: "12MP f/2.3-2.8",
      rearCameraMacro: null,
      rearCameraDepth: null,
      videoRecording: "4K@120fps, 1080p@240fps",
      opticalImageStabilization: true,
      frontCamera: "12MP f/2.0",
      frontVideoRecording: "4K@30fps",
      batteryCapacity: 5000,
      chargingSpeed: "30W wired",
      fastCharging: true,
      wirelessCharging: true,
      reverseWirelessCharging: false,
      weight: "192",
      buildMaterial: "Glass front and back, aluminum frame",
      dimensions: "161 x 74 x 8.2 mm",
      colors: ["Black", "Green", "Silver", "Red"],
      waterResistance: "IP68",
      dustResistance: "IP68",
      network5g: true,
      network4g: true,
      dualSim: true,
      esim: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usbType: "USB-C 3.2",
      nfc: true,
      infrared: false,
      audioJack: true,
      speakers: "Stereo speakers",
      fingerprintSensor: "Side-mounted",
      faceUnlock: false,
      operatingSystem: "Android",
      osVersion: "Android 14",
      features: ["120Hz 4K display", "Triple camera", "3.5mm jack"],
    },
  },

  "motorola-raze-ultra": {
    name: "Motorola Razr Ultra",
    category: "smartphones",
    brand: "motorola",
    model: "Razr Ultra",
    sku: "MOTO-RAZR-ULTRA-2024",
    warranty: "1 Year Motorola Warranty",
    releaseYear: 2024,
    basePrice: "89999.00",
    salePrice: "84999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Motorola Razr Ultra - Foldable Smartphone",
    metaDescription:
      "Motorola Razr Ultra with 6.9-inch foldable display, Snapdragon 8+ Gen 1, and premium flip design.",
    specs: {
      screenSize: "6.9",
      screenResolution: "2640x1080",
      screenType: "Foldable OLED",
      refreshRate: 144,
      peakBrightness: 1400,
      ppi: 413,
      protectionGlass: "Ultra Thin Glass",
      hdr: true,
      alwaysOnDisplay: true,
      chipset: "Snapdragon 8+ Gen 1",
      gpu: "Adreno 730",
      cpu: "Octa-core (3.2 GHz)",
      ramSize: 8,
      ramType: "LPDDR5",
      storageSize: 256,
      storageType: "UFS 3.1",
      expandableStorage: false,
      maxStorageExpansion: null,
      rearCameraMain: "12MP f/1.5",
      rearCameraUltrawide: "13MP f/2.2",
      rearCameraTelephoto: null,
      rearCameraMacro: null,
      rearCameraDepth: null,
      videoRecording: "4K@60fps, 1080p@240fps",
      opticalImageStabilization: true,
      frontCamera: "32MP f/2.4",
      frontVideoRecording: "4K@30fps",
      batteryCapacity: 3800,
      chargingSpeed: "30W wired, 5W wireless",
      fastCharging: true,
      wirelessCharging: true,
      reverseWirelessCharging: false,
      weight: "188",
      buildMaterial: "Glass front, plastic back, aluminum frame",
      dimensions: "170.8 x 74 x 7 mm (unfolded)",
      colors: ["Black", "Red", "Gold", "Grey"],
      waterResistance: "IPX8",
      dustResistance: "IP5X",
      network5g: true,
      network4g: true,
      dualSim: true,
      esim: true,
      wifi: "Wi-Fi 6E",
      bluetooth: "5.3",
      usbType: "USB-C 3.1",
      nfc: true,
      infrared: false,
      audioJack: false,
      speakers: "Stereo speakers",
      fingerprintSensor: "Side-mounted",
      faceUnlock: true,
      operatingSystem: "Android",
      osVersion: "Android 13",
      features: ["Foldable display", "144Hz refresh rate", "Cover display"],
    },
  },

  "apple-iphone-17-pro": {
    name: "Apple iPhone 17 Pro",
    category: "smartphones",
    brand: "apple",
    model: "iPhone 17 Pro",
    sku: "APPLE-IP17P-2025",
    warranty: "1 Year Apple Limited Warranty",
    releaseYear: 2025,
    basePrice: "139900.00",
    salePrice: null,
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Apple iPhone 17 Pro - Next-Gen iPhone",
    metaDescription:
      "iPhone 17 Pro with A18 Pro chip, ProMotion display, and advanced camera system.",
    specs: {
      screenSize: "6.3",
      screenResolution: "2796x1290",
      screenType: "Super Retina XDR OLED",
      refreshRate: 120,
      peakBrightness: 2000,
      ppi: 460,
      protectionGlass: "Ceramic Shield",
      hdr: true,
      alwaysOnDisplay: true,
      chipset: "Apple A18 Pro",
      gpu: "6-core GPU",
      cpu: "6-core CPU",
      ramSize: 8,
      ramType: "LPDDR5X",
      storageSize: 256,
      storageType: "NVMe",
      expandableStorage: false,
      maxStorageExpansion: null,
      rearCameraMain: "48MP f/1.6",
      rearCameraUltrawide: "12MP f/2.2",
      rearCameraTelephoto: "12MP f/2.8 5x",
      rearCameraMacro: null,
      rearCameraDepth: null,
      videoRecording: "4K@120fps, ProRes",
      opticalImageStabilization: true,
      frontCamera: "12MP TrueDepth",
      frontVideoRecording: "4K@60fps",
      batteryCapacity: 3600,
      chargingSpeed: "27W wired, 25W MagSafe",
      fastCharging: true,
      wirelessCharging: true,
      reverseWirelessCharging: false,
      weight: "199",
      buildMaterial: "Titanium frame, Glass back",
      dimensions: "149.6 x 71.5 x 8.25 mm",
      colors: ["Gold"],
      waterResistance: "IP68",
      dustResistance: "IP68",
      network5g: true,
      network4g: true,
      dualSim: true,
      esim: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usbType: "USB-C 3.2",
      nfc: true,
      infrared: false,
      audioJack: false,
      speakers: "Stereo speakers",
      fingerprintSensor: null,
      faceUnlock: true,
      operatingSystem: "iOS",
      osVersion: "iOS 19",
      features: ["Dynamic Island", "Action Button", "Always-On Display"],
    },
  },

  "apple-iphone-17-pro-max": {
    name: "Apple iPhone 17 Pro Max",
    category: "smartphones",
    brand: "apple",
    model: "iPhone 17 Pro Max",
    sku: "APPLE-IP17PM-2025",
    warranty: "1 Year Apple Limited Warranty",
    releaseYear: 2025,
    basePrice: "159900.00",
    salePrice: null,
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Apple iPhone 17 Pro Max - Ultimate iPhone",
    metaDescription:
      "iPhone 17 Pro Max with 6.9-inch display, A18 Pro chip, and best battery life.",
    specs: {
      screenSize: "6.9",
      screenResolution: "2868x1320",
      screenType: "Super Retina XDR OLED",
      refreshRate: 120,
      peakBrightness: 2000,
      ppi: 460,
      protectionGlass: "Ceramic Shield",
      hdr: true,
      alwaysOnDisplay: true,
      chipset: "Apple A18 Pro",
      gpu: "6-core GPU",
      cpu: "6-core CPU",
      ramSize: 8,
      ramType: "LPDDR5X",
      storageSize: 256,
      storageType: "NVMe",
      expandableStorage: false,
      maxStorageExpansion: null,
      rearCameraMain: "48MP f/1.6",
      rearCameraUltrawide: "12MP f/2.2",
      rearCameraTelephoto: "12MP f/2.8 5x",
      rearCameraMacro: null,
      rearCameraDepth: null,
      videoRecording: "4K@120fps, ProRes",
      opticalImageStabilization: true,
      frontCamera: "12MP TrueDepth",
      frontVideoRecording: "4K@60fps",
      batteryCapacity: 4685,
      chargingSpeed: "45W wired, 25W MagSafe",
      fastCharging: true,
      wirelessCharging: true,
      reverseWirelessCharging: false,
      weight: "227",
      buildMaterial: "Titanium frame, Glass back",
      dimensions: "163 x 77.6 x 8.25 mm",
      colors: ["Red"],
      waterResistance: "IP68",
      dustResistance: "IP68",
      network5g: true,
      network4g: true,
      dualSim: true,
      esim: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usbType: "USB-C 3.2",
      nfc: true,
      infrared: false,
      audioJack: false,
      speakers: "Stereo speakers",
      fingerprintSensor: null,
      faceUnlock: true,
      operatingSystem: "iOS",
      osVersion: "iOS 19",
      features: ["Dynamic Island", "Action Button", "Largest iPhone display"],
    },
  },

  "google-pixel-9-pro-xl": {
    name: "Google Pixel 9 Pro XL",
    category: "smartphones",
    brand: "google-pixel",
    model: "Pixel 9 Pro XL",
    sku: "GOOGLE-PIX9PXL-2024",
    warranty: "1 Year Google Warranty",
    releaseYear: 2024,
    basePrice: "109999.00",
    salePrice: "104999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Google Pixel 9 Pro XL - AI-Powered Smartphone",
    metaDescription:
      "Google Pixel 9 Pro XL with Tensor G4, 6.8-inch display, and best-in-class AI features.",
    specs: {
      screenSize: "6.8",
      screenResolution: "3120x1440",
      screenType: "LTPO OLED",
      refreshRate: 120,
      peakBrightness: 3000,
      ppi: 510,
      protectionGlass: "Gorilla Glass Victus 2",
      hdr: true,
      alwaysOnDisplay: true,
      chipset: "Google Tensor G4",
      gpu: "Mali-G715",
      cpu: "Octa-core (3.1 GHz)",
      ramSize: 16,
      ramType: "LPDDR5X",
      storageSize: 256,
      storageType: "UFS 4.0",
      expandableStorage: false,
      maxStorageExpansion: null,
      rearCameraMain: "50MP f/1.7",
      rearCameraUltrawide: "48MP f/1.95",
      rearCameraTelephoto: "48MP f/2.8 5x",
      rearCameraMacro: null,
      rearCameraDepth: null,
      videoRecording: "4K@60fps, 1080p@240fps",
      opticalImageStabilization: true,
      frontCamera: "42MP f/2.2",
      frontVideoRecording: "4K@60fps",
      batteryCapacity: 5060,
      chargingSpeed: "37W wired, 23W wireless",
      fastCharging: true,
      wirelessCharging: true,
      reverseWirelessCharging: true,
      weight: "221",
      buildMaterial: "Glass front and back, aluminum frame",
      dimensions: "162.8 x 76.6 x 8.5 mm",
      colors: ["Obsidian", "Porcelain", "Hazel", "Rose"],
      waterResistance: "IP68",
      dustResistance: "IP68",
      network5g: true,
      network4g: true,
      dualSim: true,
      esim: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usbType: "USB-C 3.2",
      nfc: true,
      infrared: false,
      audioJack: false,
      speakers: "Stereo speakers",
      fingerprintSensor: "Under display",
      faceUnlock: true,
      operatingSystem: "Android",
      osVersion: "Android 15",
      features: ["Tensor G4", "7 years updates", "Magic Eraser", "Best Take"],
    },
  },

  "samsung-galaxy-s25-ultra": {
    name: "Samsung Galaxy S25 Ultra",
    category: "smartphones",
    brand: "samsung",
    model: "Galaxy S25 Ultra",
    sku: "SAMSUNG-S25U-2025",
    warranty: "1 Year Samsung India Warranty",
    releaseYear: 2025,
    basePrice: "129999.00",
    salePrice: null,
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "Samsung Galaxy S25 Ultra - Ultimate Android Flagship",
    metaDescription:
      "Galaxy S25 Ultra with Snapdragon 8 Gen 4, 200MP camera, S Pen, and 6.8-inch display.",
    specs: {
      screenSize: "6.8",
      screenResolution: "3120x1440",
      screenType: "Dynamic AMOLED 2X",
      refreshRate: 120,
      peakBrightness: 2600,
      ppi: 505,
      protectionGlass: "Gorilla Glass Victus 3",
      hdr: true,
      alwaysOnDisplay: true,
      chipset: "Snapdragon 8 Gen 4",
      gpu: "Adreno 830",
      cpu: "Octa-core (3.4 GHz)",
      ramSize: 12,
      ramType: "LPDDR5X",
      storageSize: 256,
      storageType: "UFS 4.0",
      expandableStorage: false,
      maxStorageExpansion: null,
      rearCameraMain: "200MP f/1.7",
      rearCameraUltrawide: "12MP f/2.2",
      rearCameraTelephoto: "50MP f/3.4 5x, 10MP f/2.4 3x",
      rearCameraMacro: null,
      rearCameraDepth: null,
      videoRecording: "8K@30fps, 4K@120fps",
      opticalImageStabilization: true,
      frontCamera: "12MP f/2.2",
      frontVideoRecording: "4K@60fps",
      batteryCapacity: 5000,
      chargingSpeed: "45W wired, 15W wireless",
      fastCharging: true,
      wirelessCharging: true,
      reverseWirelessCharging: true,
      weight: "232",
      buildMaterial: "Titanium frame, Glass back",
      dimensions: "162.3 x 79 x 8.6 mm",
      colors: ["Titanium Gray", "Titanium Black", "Titanium Gold"],
      waterResistance: "IP68",
      dustResistance: "IP68",
      network5g: true,
      network4g: true,
      dualSim: true,
      esim: true,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usbType: "USB-C 3.2",
      nfc: true,
      infrared: false,
      audioJack: false,
      speakers: "Stereo speakers with Dolby Atmos",
      fingerprintSensor: "Ultrasonic under display",
      faceUnlock: true,
      operatingSystem: "Android",
      osVersion: "One UI 7 (Android 15)",
      features: ["S Pen", "200MP camera", "Titanium build", "AI features"],
    },
  },

  "one-plus-13": {
    name: "OnePlus 13",
    category: "smartphones",
    brand: "oneplus",
    model: "OnePlus 13",
    sku: "ONEPLUS-13-2025",
    warranty: "1 Year OnePlus India Warranty",
    releaseYear: 2025,
    basePrice: "69999.00",
    salePrice: "64999.00",
    isNewArrival: true,
    isBestseller: true,
    isFeatured: true,
    metaTitle: "OnePlus 13 - Flagship Killer Smartphone",
    metaDescription:
      "OnePlus 13 with Snapdragon 8 Gen 4, Hasselblad camera, 100W charging, and premium design.",
    specs: {
      screenSize: "6.82",
      screenResolution: "3168x1440",
      screenType: "LTPO AMOLED",
      refreshRate: 120,
      peakBrightness: 4500,
      ppi: 510,
      protectionGlass: "Ceramic Guard",
      hdr: true,
      alwaysOnDisplay: true,
      chipset: "Snapdragon 8 Gen 4",
      gpu: "Adreno 830",
      cpu: "Octa-core (3.4 GHz)",
      ramSize: 12,
      ramType: "LPDDR5X",
      storageSize: 256,
      storageType: "UFS 4.0",
      expandableStorage: false,
      maxStorageExpansion: null,
      rearCameraMain: "50MP f/1.6",
      rearCameraUltrawide: "50MP f/2.0",
      rearCameraTelephoto: "64MP f/2.6 3x",
      rearCameraMacro: null,
      rearCameraDepth: null,
      videoRecording: "8K@30fps, 4K@120fps",
      opticalImageStabilization: true,
      frontCamera: "32MP f/2.4",
      frontVideoRecording: "4K@60fps",
      batteryCapacity: 6000,
      chargingSpeed: "100W wired, 50W wireless",
      fastCharging: true,
      wirelessCharging: true,
      reverseWirelessCharging: false,
      weight: "213",
      buildMaterial: "Glass front and back, aluminum frame",
      dimensions: "163.3 x 76.1 x 8.9 mm",
      colors: ["Arctic Dawn", "Midnight Ocean", "Black Eclipse"],
      waterResistance: "IP69",
      dustResistance: "IP69",
      network5g: true,
      network4g: true,
      dualSim: true,
      esim: false,
      wifi: "Wi-Fi 7",
      bluetooth: "5.4",
      usbType: "USB-C 3.2",
      nfc: true,
      infrared: true,
      audioJack: false,
      speakers: "Stereo speakers with Dolby Atmos",
      fingerprintSensor: "Optical under display",
      faceUnlock: true,
      operatingSystem: "Android",
      osVersion: "OxygenOS 15 (Android 15)",
      features: ["100W charging", "Hasselblad camera", "Alert Slider"],
    },
  },
};

const smartphoneFolders = {
  Smartphones: "smartphones",
};

export async function seedSmartphones() {
  console.log("📱 Seeding smartphones with color variants...\n");

  const allBrands = await db.select().from(brands);
  const brandMap = new Map(allBrands.map((b) => [b.slug, b]));

  for (const [folderName, categorySlug] of Object.entries(smartphoneFolders)) {
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
      const groupedByModel = groupSmartphonesByModel(result.files);
      console.log(
        `  📦 Grouped into ${Object.keys(groupedByModel).length} models\n`
      );

      for (const [modelKey, modelData] of Object.entries(groupedByModel)) {
        const smartphoneData = smartphoneDatabase[modelKey];

        if (!smartphoneData) {
          console.log(`  ⚠️  No specs found for: ${modelKey} (skipping)`);
          continue;
        }

        const brandId = brandMap.get(smartphoneData.brand)?.id || null;

        // Get main image (first color variant)
        const firstColor = Object.keys((modelData as any).colors)[0];
        const mainImage = (modelData as any).colors[firstColor][0];

        // Create main product
        const [product] = await db
          .insert(products)
          .values({
            name: smartphoneData.name,
            slug: `${categorySlug}-${modelKey}`,
            description: `${smartphoneData.name} featuring ${smartphoneData.specs.chipset} processor, ${smartphoneData.specs.ramSize}GB RAM, ${smartphoneData.specs.storageSize}GB storage, and ${smartphoneData.specs.screenSize}" ${smartphoneData.specs.screenType} display with ${smartphoneData.specs.refreshRate}Hz refresh rate. ${smartphoneData.specs.rearCameraMain} camera. ${smartphoneData.specs.batteryCapacity}mAh battery with ${smartphoneData.specs.chargingSpeed} charging.`,
            shortDescription: `${smartphoneData.specs.chipset}, ${smartphoneData.specs.ramSize}GB/${smartphoneData.specs.storageSize}GB, ${smartphoneData.specs.screenSize}" ${smartphoneData.specs.refreshRate}Hz`,
            categoryId: category.id,
            brandId,
            productType: "smartphone",
            mainImagePath: mainImage.filePath.replace(/^\//, ""),
            basePrice: smartphoneData.basePrice,
            salePrice: smartphoneData.salePrice,
            model: smartphoneData.model,
            sku: smartphoneData.sku,
            warranty: smartphoneData.warranty,
            releaseYear: smartphoneData.releaseYear,
            isActive: true,
            isFeatured: smartphoneData.isFeatured,
            isNewArrival: smartphoneData.isNewArrival,
            isBestseller: smartphoneData.isBestseller,
            stockQuantity: 0, // Stock managed by variants
            metaTitle: smartphoneData.metaTitle,
            metaDescription: smartphoneData.metaDescription,
            quickSpecs: {
              chipset: smartphoneData.specs.chipset,
              ram: `${smartphoneData.specs.ramSize}GB`,
              storage: `${smartphoneData.specs.storageSize}GB`,
              screen: `${smartphoneData.specs.screenSize}" ${smartphoneData.specs.refreshRate}Hz`,
              camera: smartphoneData.specs.rearCameraMain,
              battery: `${smartphoneData.specs.batteryCapacity}mAh`,
            },
          })
          .returning();

        // Create smartphone specifications
        await db.insert(smartphoneSpecs).values({
          productId: product.id,
          ...smartphoneData.specs,
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
            variantName: `${smartphoneData.name} - ${
              color.charAt(0).toUpperCase() + color.slice(1)
            }`,
            sku: `${smartphoneData.sku}-${color.toUpperCase()}`,
            color:
              color === "xl" || color === "default"
                ? null
                : color.charAt(0).toUpperCase() + color.slice(1),
            storage: `${smartphoneData.specs.storageSize}GB`,
            ram: `${smartphoneData.specs.ramSize}GB`,
            size: null,
            price: smartphoneData.basePrice,
            salePrice: smartphoneData.salePrice,
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
              altText: `${smartphoneData.name} - ${color}`,
              isMainImage: imageIndex === 0,
              displayOrder: imageIndex,
              width: file.width,
              height: file.height,
              imageType:
                color === "xl" || color === "default"
                  ? "front"
                  : `color-${color}`,
            });

            imageIndex++;
          }
        }

        console.log(
          `  ✅ ${smartphoneData.name} (${
            Object.keys((modelData as any).colors).length
          } colors, ${imageIndex} images)`
        );
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${folderName}:`, error);
    }
  }

  console.log("\n🎉 All smartphones seeded successfully!\n");
}

if (require.main === module) {
  seedSmartphones()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("❌ Error:", error);
      process.exit(1);
    });
}
