"use cache";

import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import {
  and,
  eq,
  isNotNull,
  sql,
  exists,
  desc,
  asc,
  like,
  or,
  ilike,
  inArray,
  ne,
} from "drizzle-orm";
import { db } from "@/db";
import { categories, products, productTags, tags } from "@/db/schema";
import { categoryTypes, ComparisonProduct } from "../types";
import { getHeroImage, getProductCard } from "@/lib/imagekit-loader";
import { getImagesFromFolder } from "@/db/utils/imagekit-helper";
import { transformedProductImage } from "../util";

export const getProductsForSitemap = async () => {
  cacheLife("days");
  cacheTag("sitemap-products");

  return db
    .select({
      id: products.id,
      updatedAt: products.updatedAt,
    })
    .from(products)
    .where(eq(products.isActive, true))
    .orderBy(desc(products.updatedAt));
};

export const getHeroImages = async () => {
  cacheLife("hours");

  const sq = db
    .select({
      id: products.id,
      name: products.name,
      mainImagePath: products.mainImagePath,
      productType: products.productType,
      // row number to get the first product per category type & avoid n+1 problem
      rowNumber:
        sql<number>`row_number() OVER (PARTITION BY ${products.productType} ORDER BY ${products.isFeatured} DESC)`.as(
          "row-number"
        ),
    })
    .from(products)
    .where(
      and(
        inArray(products.productType, categoryTypes),
        isNotNull(products.mainImagePath)
      )
    )
    .as("sq");

  const results = await db.select().from(sq).where(eq(sq.rowNumber, 1));

  return results.map((p) => ({
    id: p.id,
    imageUrl: transformedProductImage(p.mainImagePath),
    alt: p.name,
    productType: p.productType,
  }));
};

export const getCategories = async () => {
  cacheLife("days");

  const result = await db
    .selectDistinctOn([categories.productType], {
      id: categories.id,
      name: categories.name,
      productType: categories.productType,
      imageUrl: products.mainImagePath,
    })
    .from(categories)
    .leftJoin(products, eq(products.categoryId, categories.id))
    .where(eq(categories.isActive, true))
    .orderBy(
      categories.productType,
      desc(products.isBestseller),
      desc(products.basePrice)
    );

  return result.map((cat) => ({
    ...cat,
    imageUrl: transformedProductImage(cat.imageUrl),
  }));
};

export type getCategoryTypes = Awaited<ReturnType<typeof getCategories>>;

export const getBentoGridProducts = async () => {
  cacheLife("hours");
  cacheTag("bento-products");

  const queries = {
    featured: db.query.products.findFirst({
      where: and(
        eq(products.isActive, true),
        isNotNull(products.mainImagePath)
      ),
      orderBy: [desc(products.basePrice)],
    }),
    highestRated: db.query.products.findFirst({
      where: and(
        eq(products.isActive, true),
        isNotNull(products.mainImagePath)
      ),
      orderBy: [desc(products.averageRating)],
    }),
    flashDeal: db.query.products.findFirst({
      where: and(
        eq(products.isActive, true),
        isNotNull(products.salePrice),
        isNotNull(products.mainImagePath)
      ),
      orderBy: [desc(products.createdAt)],
    }),
    accessory: db.query.products.findFirst({
      where: and(
        eq(products.isActive, true),
        isNotNull(products.mainImagePath)
      ),
      orderBy: [asc(products.basePrice)],
    }),
    gaming: db.query.products.findFirst({
      where: and(eq(products.isActive, true), ilike(products.name, "%Gaming%")), // Changed like to ilike for safety
    }),
  };

  const results = await Promise.all(Object.values(queries));
  const keys = Object.keys(queries);

  return keys.reduce((acc, key, index) => {
    const prod = results[index];
    acc[key] = prod
      ? { ...prod, mainImagePath: transformedProductImage(prod.mainImagePath) }
      : null;
    return acc;
  }, {} as any);
};

export const getProductForComparison = async (): Promise<
  ComparisonProduct[]
> => {
  cacheLife("days");
  cacheTag("comparison-products");

  const flagshipSlugs = ["apple-iphone-17-pro-max", "samsung-galaxy-s25-ultra"];

  const results = await db.query.products.findMany({
    where: and(
      eq(products.isActive, true),
      or(
        like(products.name, "%iPhone 17 Pro Max%"),
        like(products.name, "%Galaxy S25 Ultra%")
      )
    ),
    limit: 2,
    columns: {
      id: true,
      name: true,
      slug: true,
      mainImagePath: true,
      quickSpecs: true,
    },
  });

  // Transform image paths
  return results.map((prod) => ({
    ...prod,
    mainImagePath: prod.mainImagePath
      ? getProductCard(encodeURI(prod.mainImagePath))
      : "/placeholder.jpg",
  }));
};

export const getFilterOptions = async () => {
  cacheLife("hours");

  const [categories, brands] = await Promise.all([
    db.query.categories.findMany({
      columns: { name: true, slug: true },
    }),
    db.query.brands.findMany({
      columns: { name: true, slug: true },
    }),
  ]);

  return { categories, brands };
};

const TYPE_TO_SLUG_MAP: Record<string, string> = {
  laptop: "ultrabooks",
  smartphone: "smartphones",
  tablet: "tablets",
  smartwatch: "smart-watches",
  headphones: "headphones",
  tv: "tvs",
};

export const getCategoryChampion = async (inputSlug: string) => {
  cacheLife("days");
  cacheTag(`champion-${inputSlug}`);

  const lowerInput = inputSlug.toLowerCase();
  let targetSlug = TYPE_TO_SLUG_MAP[lowerInput] || lowerInput;

  const categoryData = await db.query.categories.findFirst({
    where: eq(categories.slug, targetSlug),
    columns: { name: true, id: true, slug: true },
  });

  if (!categoryData) {
    console.error(
      `❌ Category not found: ${targetSlug} (Input was: ${inputSlug})`
    );
    return null;
  }

  const imageKitResult = await getImagesFromFolder("Category Titan");
  if (!imageKitResult.success || !imageKitResult.files) {
    console.error("❌ Failed to fetch Titan images from ImageKit");
    return null;
  }

  const normalize = (s: string) => s.toLowerCase().replace(/[-_\s]/g, "");

  const nameNorm = normalize(categoryData.name);
  const slugNorm = normalize(categoryData.slug);

  // Also check the SINGULAR version of the product type for image matching
  const singularType =
    Object.keys(TYPE_TO_SLUG_MAP).find(
      (key) => TYPE_TO_SLUG_MAP[key] === targetSlug
    ) || "";

  const titanFile = imageKitResult.files.find((file: any) => {
    const fileName = normalize(file.name);
    return (
      fileName.includes(nameNorm) ||
      fileName.includes(slugNorm) ||
      (singularType && fileName.includes(singularType))
    );
  });

  if (!titanFile) {
    console.warn(`⚠️ No Titan image found for: ${targetSlug}`);
    return null;
  }

  const championProduct = await db.query.products.findFirst({
    where: and(
      eq(products.isActive, true),
      eq(products.categoryId, categoryData.id)
    ),
    orderBy: [desc(products.isBestseller), desc(products.basePrice)],
    columns: {
      id: true,
      name: true,
      basePrice: true,
      productType: true,
    },
  });

  const folderName = "Category Titan";
  const fileName = titanFile.name;
  const fullPath = `${encodeURI(folderName)}/${encodeURI(fileName)}`;

  const heroImageUrl = getHeroImage(fullPath);

  return {
    categoryName: categoryData.name,
    shopLink: championProduct ? `/products/${championProduct.id}` : "#grid",
    productName: championProduct?.name,
    price: championProduct?.basePrice,
    titanImage: heroImageUrl,
    productType: championProduct?.productType,
  };
};

export const getProductById = async (id: number) => {
  cacheLife("hours");
  cacheTag(`product-${id}`);

  const product = await db.query.products.findFirst({
    where: eq(products.id, id),
    with: {
      category: true,
      brand: true,
      tags: {
        with: {
          tag: true,
        },
      },
      images: {
        orderBy: (images, { asc }) => [asc(images.displayOrder)],
      },
      variants: {
        where: (variants, { eq }) => eq(variants.isActive, true),
      },
      // Spec Tables
      laptopSpecs: true,
      tvSpecs: true,
      smartphoneSpecs: true,
      headphonesSpecs: true,
      smartwatchSpecs: true,
      tabletSpecs: true,
    },
  });

  if (!product) return null;

  // normalize images
  const mainImage = transformedProductImage(
    product.mainImagePath,
    "details"
  ) as string;

  const transformedImages = product.images.map((img) => ({
    id: img.id,
    url: transformedProductImage(img.imagePath, "details") as string,
    altText: img.altText || product.name,
  }));

  return {
    ...product,
    mainImagePath: mainImage,
    images:
      transformedImages.length > 0
        ? transformedImages
        : [{ id: 0, url: mainImage, altText: product.name }],
    variants: product.variants.map((v) => ({
      ...v,
      url: transformedProductImage(v.imagePath, "details") as string,
    })),
    specs:
      (product[`${product.productType}Specs` as keyof typeof product] as any) ||
      null,
  };
};

export const getRelatedProducts = async (
  currentProductId: number,
  currentCategoryId: number,
  productTagsList: string[]
) => {
  cacheLife("hours");
  cacheTag(`related-${currentProductId}`);

  const [alternatives, ecosystem] = await Promise.all([
    db.query.products.findMany({
      where: and(
        eq(products.isActive, true),
        eq(products.categoryId, currentCategoryId),
        ne(products.id, currentProductId)
      ),
      limit: 2,
      orderBy: [desc(products.isBestseller)],
    }),
    productTagsList.length > 0
      ? db.query.products.findMany({
          where: and(
            eq(products.isActive, true),
            ne(products.categoryId, currentCategoryId),
            exists(
              db
                .select()
                .from(productTags)
                .innerJoin(tags, eq(productTags.tagId, tags.id))
                .where(
                  and(
                    eq(productTags.productId, products.id),
                    inArray(tags.name, productTagsList)
                  )
                )
            )
          ),
          limit: 2,
        })
      : Promise.resolve([]),
  ]);

  return {
    alternatives: alternatives.map((p) => ({
      ...p,
      mainImagePath: transformedProductImage(p.mainImagePath),
    })),
    ecosystem: ecosystem.map((p) => ({
      ...p,
      mainImagePath: transformedProductImage(p.mainImagePath),
    })),
  };
};
