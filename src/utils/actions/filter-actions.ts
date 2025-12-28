import { db } from "@/db";
import { products, brands, categories, productVariants } from "@/db/schema";
import {
  and,
  asc,
  count,
  desc,
  eq,
  gte,
  ilike,
  isNotNull,
  lte,
  sql,
  SQL,
} from "drizzle-orm";
import { ProductSearchParams } from "../types";

export const getAllProducts = async (params: ProductSearchParams) => {
  const ITEMS_PER_PAGE = 12;
  const page = Number(params.page) || 1;
  const offset = (page - 1) * ITEMS_PER_PAGE;

  //  OPTIMIZATION: Resolve Filter IDs First
  // This prevents the DB from running a sub-select for every single product row.
  let brandIdFilter: number | undefined;
  let categoryIdFilter: number | undefined;

  if (params.brand) {
    const brandData = await db.query.brands.findFirst({
      where: eq(brands.slug, params.brand),
      columns: { id: true },
    });
    brandIdFilter = brandData?.id;
  }

  if (params.category) {
    const categoryData = await db.query.categories.findFirst({
      where: eq(categories.slug, params.category),
      columns: { id: true },
    });
    categoryIdFilter = categoryData?.id;
  }

  // Build Conditions
  const conditions: (SQL<unknown> | undefined)[] = [
    eq(products.isActive, true),
    isNotNull(products.mainImagePath),
  ];

  if (params.search) {
    conditions.push(ilike(products.name, `%${params.search}%`));
  }

  if (params.productType) {
    conditions.push(eq(products.productType, params.productType as any));
  }

  if (params.minPrice) {
    conditions.push(gte(products.basePrice, params.minPrice));
  }
  if (params.maxPrice) {
    conditions.push(lte(products.basePrice, params.maxPrice));
  }

  if (params.color) {
    conditions.push(
      sql`${products.availableColors} @> ${JSON.stringify([
        { name: params.color },
      ])}`
    );
  }

  if (brandIdFilter) {
    conditions.push(eq(products.brandId, brandIdFilter));
  }
  if (categoryIdFilter) {
    conditions.push(eq(products.categoryId, categoryIdFilter));
  }

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
        salePrice: true,
        mainImagePath: true,
        productType: true,
        availableColors: true,
      },
      with: {
        category: { columns: { name: true } },
        brand: { columns: { name: true } },
        variants: {
          columns: {
            id: true,
            color: true,
            imagePath: true,
            stockQuantity: true,
          },
          where: isNotNull(productVariants.imagePath),
        },
      },
    }),

    db
      .select({ count: count() })
      .from(products)
      .where(and(...conditions)),
  ]);

  const totalItems = Number(totalCount[0]?.count || 0);
  const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

  return {
    products: data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems,
    },
  };
};

export async function getProductIds() {
  return await db.query.products.findMany({
    columns: { id: true },
  });
}
