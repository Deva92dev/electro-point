import { cacheLife } from "next/cache";
import { eq, min } from "drizzle-orm";
import { db } from "@/db";
import { categories, products } from "@/db/schema";

// aggregate values like min are used with in conjunction to groupBy
export const getCategoriesWithImages = async () => {
  "use cache";
  cacheLife({ expire: 3600 });

  const categoryResult = await db
    .select({
      id: categories.id,
      name: categories.name,
      productType: categories.productType,
      imageUrl: min(products.mainImagePath),
    })
    .from(categories)
    .leftJoin(products, eq(categories.id, products.categoryId))
    .groupBy(categories.id);

  return categoryResult;
};
