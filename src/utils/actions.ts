"use server";

import { cacheLife, cacheTag } from "next/cache";
import { and, eq, isNotNull, lte, SQL, sql, exists } from "drizzle-orm";
import { db } from "@/db";
import { categories, products, productTags, tags } from "@/db/schema";
import { categoryTypes, FilteredProductsType, ProductType } from "./types";
import { getProductCard } from "@/lib/imagekit-loader";
import { productTypes } from "../db/schema/index";

export const getHeroImages = async () => {
  "use cache";
  cacheLife("hours");

  const heroImages = await Promise.all(
    categoryTypes.map(async (category) => {
      const [product] = await db
        .select({
          id: products.id,
          name: products.name,
          mainImagePath: products.mainImagePath,
          productType: products.productType,
        })
        .from(products)
        .where(
          and(
            eq(products.productType, category),
            isNotNull(products.mainImagePath)
          )
        )
        .limit(1);

      if (product?.mainImagePath) {
        return {
          id: product.id,
          src: product.mainImagePath,
          alt: product.name,
          category: category.charAt(0).toUpperCase() + category.slice(1),
        };
      }
      return null;
    })
  );
  return heroImages.filter(
    (item): item is NonNullable<typeof item> => item !== null
  );
};

export const getCategories = async () => {
  "use cache";
  cacheLife("hours");

  const categoriesWithImages = await Promise.all(
    categoryTypes.map(async (type) => {
      const result = await db
        .select({
          id: categories.id,
          name: categories.name,
          productType: categories.productType,
          imageUrl: products.mainImagePath,
        })
        .from(categories)
        .leftJoin(
          products,
          and(eq(products.productType, type), isNotNull(products.mainImagePath))
        )
        .where(
          and(eq(categories.productType, type), eq(categories.isActive, true))
        )
        .limit(1);

      const category = result[0];
      if (!category || !category.imageUrl) return null;

      return {
        ...category,
        imageUrl: getProductCard(category.imageUrl),
      };
    })
  );

  return categoriesWithImages.filter(
    (cat): cat is NonNullable<typeof cat> => cat !== null
  );
};

export const getProductsFinder = async () => {
  "use cache";
  cacheLife("minutes");
  cacheTag("products");

  const result = await db
    .select({
      id: products.id,
      name: products.name,
      mainImagePath: products.mainImagePath,
      basePrice: products.basePrice,
      salePrice: products.salePrice,
      productType: products.productType,
      quickSpecs: products.quickSpecs,
      categoryName: categories.name,
    })
    .from(products)
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(and(eq(products.isActive, true), isNotNull(products.mainImagePath)));

  const processedResult = result.map((prod) => {
    const imageUrl = prod.mainImagePath
      ? getProductCard(prod.mainImagePath)
      : "/placeholder.jpg";

    return {
      ...prod,
      mainImagePath: imageUrl,
    };
  });

  return processedResult;
};

export const getFilteredProducts = async (filters: {
  categoryName?: string | null;
  maxBudget?: number;
  priority?: string | null;
}): Promise<FilteredProductsType> => {
  try {
    const { categoryName, maxBudget, priority } = filters;

    const whereClauses: (SQL<unknown> | undefined)[] = [
      eq(products.isActive, true),
      isNotNull(products.mainImagePath),
    ];

    if (categoryName) {
      whereClauses.push(eq(products.productType, categoryName as ProductType));
    }

    if (maxBudget) {
      whereClauses.push(lte(sql`${products.basePrice}::numeric`, maxBudget));
    }

    if (priority) {
      whereClauses.push(
        exists(
          db
            .select({ n: sql`1` })
            .from(productTags)
            .innerJoin(tags, eq(productTags.tagId, tags.id))
            .where(
              and(
                eq(productTags.productId, products.id),
                eq(tags.name, priority) // Match the tag name from the UI
              )
            )
        )
      );
    }

    const filtered = await db
      .select({
        id: products.id,
        name: products.name,
        mainImagePath: products.mainImagePath,
        basePrice: products.basePrice,
        productType: products.productType,
        quickSpecs: products.quickSpecs,
      })
      .from(products)
      .where(and(...whereClauses.filter(Boolean)))
      .limit(5);

    return filtered.map((prod) => ({
      ...prod,
      mainImagePath: prod.mainImagePath
        ? getProductCard(prod.mainImagePath)
        : "/placeholder.jpg",
    })) as unknown as FilteredProductsType;
  } catch (error) {
    console.error("❌ [getFilteredProducts] Critical Action Error:", error);
    throw new Error(
      `Server action failed: ${
        error instanceof Error ? error.message : "Unknown error"
      }`
    );
  }
};
