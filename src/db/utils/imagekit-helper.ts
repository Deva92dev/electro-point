/* eslint-disable @typescript-eslint/no-explicit-any */
import ImageKit from "imagekit";

let imagekitInstance: ImageKit | null = null;

// Function to get or create ImageKit instance
export function getImageKit(): ImageKit {
  if (!imagekitInstance) {
    const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
    const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
    const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

    if (!publicKey) {
      throw new Error(
        "Missing NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY in environment variables"
      );
    }

    if (!privateKey) {
      throw new Error("Missing IMAGEKIT_PRIVATE_KEY in environment variables");
    }

    if (!urlEndpoint) {
      throw new Error(
        "Missing NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT in environment variables"
      );
    }

    imagekitInstance = new ImageKit({
      publicKey,
      privateKey,
      urlEndpoint,
    });
  }

  return imagekitInstance;
}

// Fetch images from a specific folder
export async function getImagesFromFolder(
  folderPath: string,
  limit: number = 100
) {
  try {
    const ik = getImageKit();
    const files = await ik.listFiles({
      path: folderPath,
      limit: limit,
    });

    return {
      success: true,
      count: files.length,
      files: files,
    };
  } catch (error) {
    return {
      success: false,
      error: error,
      files: [],
    };
  }
}

// Group images by product name (removes -v1, -v2 suffixes)
export function groupImagesByProduct(files: any[]) {
  const grouped = files.reduce((acc: any, file: any) => {
    const baseName = file.name
      .replace(/\.(jpg|jpeg|png|webp)$/i, "") // Remove extension
      .replace(/[-\s]+(v1|v2|V1|V2)$/i, "") // Remove v1/v2 variants
      .replace(/\s+/g, "-") // Replace spaces with dashes
      .replace(/--+/g, "-") // Replace multiple dashes with single
      .toLowerCase() // Convert to lowercase for consistency
      .trim();

    if (!acc[baseName]) {
      acc[baseName] = [];
    }

    acc[baseName].push(file);
    return acc;
  }, {});

  return grouped;
}

// Sort images: main image first, then v1, then v2
export function sortProductImages(images: any[]) {
  return images.sort((a, b) => {
    const aIsMain = !a.name.match(/-(v1|v2)\.(jpg|jpeg|png|webp)$/i);
    const bIsMain = !b.name.match(/-(v1|v2)\.(jpg|jpeg|png|webp)$/i);

    if (aIsMain) return -1;
    if (bIsMain) return 1;

    return a.name.localeCompare(b.name);
  });
}

// Get all images for all laptop folders
export async function getAllLaptopImages() {
  const laptopFolders = [
    "Macbook",
    "Gaming Laptops",
    "Business Laptops",
    "Ultrabook",
  ];

  const results: any = {};

  for (const folder of laptopFolders) {
    console.log(`\n📁 Fetching images from: ${folder}`);

    const result = await getImagesFromFolder(folder);

    if (result.success) {
      const grouped = groupImagesByProduct(result.files);
      results[folder] = {
        totalImages: result.count,
        products: Object.keys(grouped).length,
        grouped: grouped,
      };

      console.log(`  ✅ Found ${result.count} images`);
      console.log(`  📦 Grouped into ${Object.keys(grouped).length} products`);
    } else {
      console.log(`  ❌ Error fetching images:`, result.error);
      results[folder] = {
        error: result.error,
      };
    }
  }

  return results;
}

// Group smartphone images by model (ignore color variants)
export function groupSmartphonesByModel(files: any[]) {
  const grouped = files.reduce((acc: any, file: any) => {
    // Remove extension and color names
    const baseName = file.name
      .replace(/\.(jpg|jpeg|png|webp)$/i, "")
      .replace(/[-\s]+(v1|v2|V1|V2)$/i, "")
      .trim();

    // Extract color from filename (last word before extension)
    const colorMatch = baseName.match(
      /[-\s](black|white|silver|gold|grey|gray|red|blue|green|pink|purple|orange|yellow|rose|titanium|midnight|starlight|phantom)$/i
    );
    const color = colorMatch ? colorMatch[1] : "default";

    // Remove color from base name to get model
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
