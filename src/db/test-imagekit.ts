/* eslint-disable @typescript-eslint/no-explicit-any */
import * as dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

import {
  getImageKit,
  getImagesFromFolder,
  groupImagesByProduct,
  sortProductImages,
  getAllLaptopImages,
} from "./utils/imagekit-helper";

async function testImageKit() {
  console.log("🧪 Testing ImageKit Configuration...\n");

  // Test 1: Check environment variables
  console.log("1️⃣  Checking environment variables...");
  const publicKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY;
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  const urlEndpoint = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT;

  if (!publicKey || !privateKey || !urlEndpoint) {
    console.error("❌ Missing ImageKit credentials!");
    console.log("Public Key:", publicKey ? "✅ Set" : "❌ Missing");
    console.log("Private Key:", privateKey ? "✅ Set" : "❌ Missing");
    console.log("URL Endpoint:", urlEndpoint ? "✅ Set" : "❌ Missing");
    process.exit(1);
  }

  console.log("✅ All environment variables found\n");
  console.log("URL Endpoint:", urlEndpoint);
  console.log("Public Key:", publicKey.substring(0, 20) + "...\n");

  // Test 2: Test connection by listing files from root
  console.log("2️⃣  Testing ImageKit connection...");
  try {
    const imagekit = getImageKit();
    const rootFiles = await imagekit.listFiles({ limit: 1 });
    console.log("✅ Successfully connected to ImageKit");
    console.log(`Found ${rootFiles.length} file(s) in root\n`);
  } catch (error) {
    console.error("❌ Failed to connect to ImageKit:", error);
    process.exit(1);
  }

  // Test 3: Fetch images from a specific folder
  console.log("3️⃣  Testing single folder fetch (macbook)...");
  const macbookResult = await getImagesFromFolder("macbook");

  if (macbookResult.success) {
    console.log(`✅ Found ${macbookResult.count} images in 'macbook' folder`);

    // Show first few files
    console.log("\nFirst 3 files:");
    macbookResult.files.slice(0, 3).forEach((file: any, index: number) => {
      console.log(
        `  ${index + 1}. ${file.name} (${file.width}x${file.height})`
      );
    });
  } else {
    console.error("❌ Error fetching macbook folder:", macbookResult.error);
  }

  // Test 4: Test grouping logic
  console.log("\n4️⃣  Testing image grouping logic...");
  if (macbookResult.success && macbookResult.files.length > 0) {
    const grouped = groupImagesByProduct(macbookResult.files);
    console.log(
      `✅ Grouped ${macbookResult.count} images into ${
        Object.keys(grouped).length
      } products`
    );

    // Show grouped products
    console.log("\nGrouped products:");
    Object.entries(grouped).forEach(([productName, images]: [string, any]) => {
      console.log(`  📦 ${productName}: ${images.length} image(s)`);
      images.forEach((img: any) => {
        console.log(`     - ${img.name}`);
      });
    });
  }

  // Test 5: Test sorting logic
  console.log("\n5️⃣  Testing image sorting logic...");
  if (macbookResult.success && macbookResult.files.length > 0) {
    const grouped = groupImagesByProduct(macbookResult.files);
    const firstProduct = Object.values(grouped)[0] as any[];

    if (firstProduct && firstProduct.length > 1) {
      const sorted = sortProductImages([...firstProduct]);
      console.log("✅ Images sorted (main first, then v1, then v2):");
      sorted.forEach((img: any, index: number) => {
        const isMain = !img.name.match(/-(v1|v2)\.(jpg|jpeg|png|webp)$/i);
        console.log(`  ${index + 1}. ${img.name} ${isMain ? "(MAIN)" : ""}`);
      });
    }
  }

  // Test 6: Fetch ALL laptop images
  console.log("\n6️⃣  Fetching images from ALL laptop folders...");
  const allResults = await getAllLaptopImages();

  console.log("\n📊 Summary:");
  console.log("─────────────────────────────────────────");

  let totalImages = 0;
  let totalProducts = 0;

  Object.entries(allResults).forEach(([folder, data]: [string, any]) => {
    if (data.error) {
      console.log(`❌ ${folder}: Error`);
    } else {
      console.log(
        `✅ ${folder}: ${data.totalImages} images, ${data.products} products`
      );
      totalImages += data.totalImages;
      totalProducts += data.products;
    }
  });

  console.log("─────────────────────────────────────────");
  console.log(`📸 Total Images: ${totalImages}`);
  console.log(`📦 Total Products: ${totalProducts}`);
  console.log("─────────────────────────────────────────\n");

  // Test 7: Show detailed product list
  console.log("7️⃣  Detailed product list:");
  Object.entries(allResults).forEach(([folder, data]: [string, any]) => {
    if (!data.error && data.grouped) {
      console.log(`\n📁 ${folder}:`);
      Object.entries(data.grouped).forEach(
        ([productName, images]: [string, any]) => {
          console.log(`  ✅ ${productName} (${images.length} images)`);
        }
      );
    }
  });

  console.log("\n✅ All tests completed successfully! 🎉");
}

// Run tests
testImageKit()
  .then(() => {
    console.log("\n✨ ImageKit is ready for seeding!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Test failed:", error);
    process.exit(1);
  });
