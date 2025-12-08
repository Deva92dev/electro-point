"use server";

import { cacheLife, cacheTag } from "next/cache";
import {
  and,
  eq,
  isNotNull,
  lte,
  SQL,
  sql,
  exists,
  desc,
  asc,
  like,
  or,
  ilike,
  gte,
  inArray,
} from "drizzle-orm";
import { db } from "@/db";
import {
  brands,
  categories,
  products,
  productTags,
  productVariants,
  tags,
} from "@/db/schema";
import {
  categoryTypes,
  ComparisonProduct,
  FilteredProductsType,
  ProductType,
} from "./types";
import { getProductCard } from "@/lib/imagekit-loader";
import { performance } from "perf_hooks";

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
      whereClauses.push(lte(products.basePrice, maxBudget.toString()));
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

export const getBentoGridProducts = async () => {
  "use cache";
  cacheLife("hours");
  cacheTag("bento-products");

  // featured(Most Expensive)
  const featuredQuery = db.query.products.findFirst({
    where: and(eq(products.isActive, true), isNotNull(products.mainImagePath)),
    orderBy: [desc(products.basePrice)],
    with: { category: true },
  });

  // best rated
  const staffPickQuery = db.query.products.findFirst({
    where: and(eq(products.isActive, true), isNotNull(products.mainImagePath)),
    orderBy: [asc(products.averageRating)],
  });

  // flash deal(newest item)
  const flashDealQuery = db.query.products.findFirst({
    where: and(
      eq(products.isActive, true),
      isNotNull(products.salePrice),
      isNotNull(products.mainImagePath)
    ),
    orderBy: [desc(products.createdAt)],
  });

  // lowest price
  const accessoryQuery = db.query.products.findFirst({
    where: and(eq(products.isActive, true), isNotNull(products.mainImagePath)),
    orderBy: [asc(products.basePrice)],
  });

  // gaming
  const gamingQuery = db.query.products.findFirst({
    where: and(eq(products.isActive, true), like(products.name, "%Gaming%")),
  });

  const [featuredRaw, staffPickRaw, flashDealRaw, accessoryRaw, gamingRaw] =
    await Promise.all([
      featuredQuery,
      staffPickQuery,
      flashDealQuery,
      accessoryQuery,
      gamingQuery,
    ]);

  const transformedImageProducts = <T extends { mainImagePath: string | null }>(
    prod: T | undefined | null
  ) => {
    if (!prod) return null;
    const rawPath = prod.mainImagePath || "";
    const encodedPath = encodeURI(rawPath);

    return {
      ...prod,
      mainImagePath: rawPath ? getProductCard(encodedPath) : "/placeholder.jpg",
    } as T & { mainImagePath: string };
  };

  return {
    featured: transformedImageProducts(featuredRaw),
    highestRated: transformedImageProducts(staffPickRaw),
    flashDeal: transformedImageProducts(flashDealRaw),
    accessory: transformedImageProducts(accessoryRaw),
    gaming: transformedImageProducts(gamingRaw),
  };
};

export const getProductForComparison = async (): Promise<
  ComparisonProduct[]
> => {
  "use cache";
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

// for jsonb columns
export const getUniqueColors = async () => {
  const newColors = await db
    .selectDistinct({
      colors: sql<string>`jsonb_array_elements_text(${products.availableColors})`,
      orderBy: asc(sql`colors`),
    })
    .from(products)
    // use raw sql query like this in orderBy
    .orderBy(asc(sql`jsonb_array_elements_text(${products.availableColors})`));

  return newColors.map((c) => c.colors);
};

export const getAllProduct = async (colors: string) => {
  const start = performance.now();
  const allProducts = await db.query.products.findMany({
    where: colors
      ? (products, { sql }) =>
          sql`${products.availableColors} @> ${JSON.stringify([colors])}`
      : undefined,
    columns: {
      slug: true,
      name: true,
      productType: true,
      basePrice: true,
      salePrice: true,
    },
    with: {
      category: {
        columns: {
          name: true,
        },
      },
      variants: {
        columns: {
          color: true,
          imagePath: true,
        },
      },
    },
  });

  const end = performance.now();

  console.log(
    `⚡ [Database] getProductsByColor took ${(end - start).toFixed(2)}ms`
  );
  console.log(`   📦 Items fetched: ${allProducts.length}`);

  return allProducts;
};

export const getAllProducts = async (params: {
  page?: string;
  sort?: string;
  maxPrice?: string;
  minPrice?: string;
  color?: string;
  productType?: string;
  search?: string;
  brand?: string;
  category?: string;
}) => {
  const start = performance.now();

  const ITEMS_PER_PAGE = 12;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  const conditions: (SQL<unknown> | undefined)[] = [
    eq(products.isActive, true),
    isNotNull(products.mainImagePath),
  ];

  // add search params to conditions
  if (params.search) {
    conditions.push(ilike(products.name, `%${params.search}%`));
  }
  if (params.productType) {
    conditions.push(eq(products.productType, params.productType as any));
  }
  if (params.minPrice) {
    conditions.push(gte(products.basePrice, `${params.minPrice}`));
  }
  if (params.maxPrice) {
    conditions.push(lte(products.basePrice, `${params.maxPrice}`));
  }
  if (params.color) {
    conditions.push(
      sql`${products.availableColors} @> ${JSON.stringify([params.color])}`
    );
  }
  if (params.brand) {
    conditions.push(
      inArray(
        products.brandId,
        db
          .select({ id: brands.id })
          .from(brands)
          .where(eq(brands.slug, params.brand))
      )
    );
  }
  if (params.category) {
    conditions.push(
      inArray(
        products.categoryId,
        db
          .select({ id: categories.id })
          .from(categories)
          .where(eq(categories.slug, params.category))
      )
    );
  }

  // sorting
  let orderBy = desc(products.createdAt);

  switch (params.sort) {
    case "price-asc":
      orderBy = asc(products.basePrice);
      break;
    case "price-desc":
      orderBy = desc(products.basePrice);
      break;
    case "a-z":
      orderBy = asc(products.name);
      break;
    case "z-a":
      orderBy = desc(products.name);
      break;
  }

  // query db
  const [data, totalCount] = await Promise.all([
    db.query.products.findMany({
      where: and(...conditions),
      limit: ITEMS_PER_PAGE,
      offset: offset,
      orderBy: [orderBy],
      columns: {
        id: true,
        slug: true,
        name: true,
        basePrice: true,
        productType: true,
        salePrice: true,
        mainImagePath: true,
        availableColors: true,
      },
      with: {
        category: { columns: { name: true } },
        brand: { columns: { name: true } },
        variants: {
          columns: {
            color: true,
            imagePath: true,
          },
          where: isNotNull(productVariants.imagePath),
        },
      },
    }),
    db
      .select({ count: sql<number>`count(*)` })
      .from(products)
      .where(and(...conditions)),
  ]);

  const end = performance.now();

  const totalItems = Number(totalCount[0]?.count || 0);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  console.log(`⚡ [Database] Filter Query took ${(end - start).toFixed(2)}ms`);
  console.log(`   📦 Params:`, params);
  console.log(`   📦 Found: ${totalItems} items`);

  // image transform and image select filter
  const allProducts = data.map((prod) => {
    let activeImage = prod.mainImagePath;

    // If the user filtered by a color (e.g. "Red"), try to find the "Red" variant image
    // This ensures the grid looks correct immediately without client-side JS
    if (params.color) {
      const matchingVariant = prod.variants.find(
        (v) => v.color?.toLowerCase() === params.color?.toLowerCase()
      );

      if (matchingVariant?.imagePath) {
        activeImage = matchingVariant.imagePath;
      }
    }

    return {
      ...prod,
      mainImagePath: activeImage
        ? getProductCard(encodeURI(activeImage))
        : "/placeholder.jpg",
      // We also transform the variant images so the frontend can use them directly
      variants: prod.variants.map((v) => ({
        color: v.color,
        image: v.imagePath
          ? getProductCard(encodeURI(v.imagePath))
          : "/placeholder.jpg",
      })),
    };
  });

  return {
    products: allProducts,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
    },
  };
};

export const getFilterOptions = async () => {
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
